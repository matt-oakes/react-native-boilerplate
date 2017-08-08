#!/usr/bin/env python3
from __future__ import print_function
import os,sys,json
from collections import OrderedDict
import subprocess
import re

platform = sys.argv[1] if len(sys.argv) > 1 else None

assert platform in [None, "ios", "android"]

android = platform is None or platform == "android"
ios = platform is None or platform == "ios"

root = os.path.join(os.path.dirname(__file__), "..")
os.chdir(root)

package_file = os.path.join(root, "package.json")
package = json.load(open(package_file, "r", encoding="utf8"), object_pairs_hook=OrderedDict)


def error(message):
    print("ERROR: " + message)
    subprocess.check_call("""osascript -e 'display notification "%s" with title "Best Coffee Build"'""" % (message,), shell=True)

def pre_check():
    has_error = False

    if android and not os.getenv("APP_KEY"):
        error("Need to supply APP_KEY to unlock android keystore")
        has_error = True

    # if ios and not os.getenv("FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD"):
    #     error("Need to supply apple password in FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD")
    #     has_error = True

    if subprocess.check_output(["git", "status", "--porcelain"]):
        error("Uncommited changes in git repository")
        has_error = True

    if has_error:
        sys.exit(1)

def bump_version():
    version = list(map(int, package["version"].split(".")))
    version[-1] += 1

    build = version[-1]
    ios_version = ".".join(map(str, version[:-1]))
    android_version_name = ".".join(map(str, version))
    android_version_code = str(version[0] * 1000000 + version[1] * 1000 + version[2])

    package["version"] = ".".join(map(str, version))
    open(package_file, "w", encoding="utf8").write(json.dumps(package, indent=2))

    # IOS
    subprocess.check_call("""cd ios && agvtool new-marketing-version %s""" % (ios_version,), shell=True)
    subprocess.check_call("""cd ios && agvtool new-version %s""" % (build,), shell=True)
    subprocess.check_call("""/usr/libexec/PlistBuddy -c "Set :CFBundleVersion %s" ios/bestcoffee/Info.plist""" % (build,), shell=True)
    subprocess.check_call("""/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString %s" ios/bestcoffee/Info.plist""" % (ios_version,), shell=True)

    # Android
    gradle_build = open("android/app/build.gradle", "r", encoding="utf8").read()
    gradle_build = re.sub(r"\bversionCode\s+\d+\b", "versionCode %s" % (android_version_code,), gradle_build)
    gradle_build = re.sub(r'\bversionName\s\"[0-9.]+\"', 'versionName "%s"' % (android_version_name,), gradle_build)
    open("android/app/build.gradle", "w", encoding="utf8").write(gradle_build)

    return version

def slack_notify(message):
    webhook_url = "https://hooks.slack.com/services/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"
    subprocess.check_call("""curl -X POST -H 'Content-type: application/json' --data '{"text":"%s"}' %s""" % (message, webhook_url, ), shell=True)

def run_tests():
    subprocess.check_call("yarn test", shell=True)

def build_ios():
    subprocess.check_call("cd ios && bundle exec fastlane beta", shell=True)

def build_android():
    subprocess.check_call("cd android && bundle exec fastlane alpha", shell=True)

def tag():
    subprocess.check_call(["git", "commit", "-am", "Release %s" % (package["version"],)])
    subprocess.check_call(["git", "tag", "release/%s" % (package["version"],)])
    subprocess.check_call(["git", "push"])
    subprocess.check_call(["git", "push", "--tags"])

try:
    print("-> Pre checks")
    pre_check()
    print("-> Run tests")
    run_tests()
    print("-> Bump version")
    new_version = bump_version()
    new_version_string = str(new_version[0]) + "." + str(new_version[1]) + "." + str(new_version[2])
    print("-> Alert Slack users")
    slack_notify("Starting release of v" + new_version_string)

    if android:
        print("-> Build android")
        build_android()

    if ios:
        print("-> Build IOS")
        build_ios()

    print("-> Tag")
    tag()
    print("ALL DONE")
    subprocess.check_call("""osascript -e 'display notification "Release complete" with title "Best Coffee Build"'""", shell=True)
    slack_notify("v" + new_version_string + " released!")
except Exception as e:
    error("Build process failed")
    raise
