#!/usr/bin/env python
from __future__ import print_function
import os,sys,json
from collections import OrderedDict
import subprocess
import re

action = sys.argv[1]
assert action in ["check", "update"]
check = action == "check"
update = action == "update"

root = os.path.join(os.path.dirname(__file__), "..")
os.chdir(root)

TRANSLATE_STRING_RE = re.compile(r"""I18n.t\("([^"]+)"[,)]""")

all_strings = []

for root, dir, files in os.walk("src"):
    for f in files:
        if not f.endswith(".js"): continue
        contents = open(os.path.join(root, f),"rb").read().decode("utf8")
        translate_strings = TRANSLATE_STRING_RE.findall(contents)
        if translate_strings:
            # print(f + ":", ", ".join(translate_strings))
            all_strings += translate_strings

all_strings = sorted(list(set(all_strings)))
# print("Total count:", len(all_strings))

def add_string(locale, path, string):
    global missing, new_missing
    if len(path) == 1:
        if path[0] not in locale:
            locale[path[0]] = "MISSING: " + string
            if check:
                print("NEEDS:", string)
            new_missing += 1
            missing += 1
        elif isinstance(locale[path[0]], basestring) and locale[path[0]].startswith("MISSING:"):
            missing += 1
    else:
        if path[0] not in locale:
            locale[path[0]] = {}
        add_string(locale[path[0]], path[1:], string)

update_required = False

for locale_file in os.listdir("src/i18n/locales"):
    if not locale_file.endswith(".json"): continue
    name = locale_file.replace(".json", "")
    locale_file = "src/i18n/locales/" + locale_file
    locale = json.load(open(locale_file, "r"), object_pairs_hook=OrderedDict)

    missing = 0
    new_missing = 0
    for s in all_strings:
        add_string(locale, s.split("."), s)

    if check:
        if new_missing > 0:
            update_required = True
            print("LOCALE UPDATE REQUIRED %s (%d missing, total %d missing)" % (name, new_missing, missing))
            print("run:\n    yarn update-locales")

    if update:
        if new_missing > 0:
            open(locale_file, "wb").write(json.dumps(locale, indent=2).encode("utf8"))
            print("UPDATED %s (added %d missing, total %d missing)" % (name, new_missing, missing))
        else:
            print("NO CHANGE %s (total %d missing)" % (name, missing))

if check and update_required:
    sys.exit(1)
