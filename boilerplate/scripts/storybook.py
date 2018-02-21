#!/usr/bin/env python
import re
import os
from os.path import join
import subprocess
import sys

action = sys.argv[1]
assert action in ["check", "update"]
check = action == "check"
update = action == "update"

# Create variables for the directories where the files are stored
components_dir = "./src/components/"
component_stories_dir = "./storybook/stories/components/"
component_story_test_dir = join(component_stories_dir, "__tests__/")
screens_dir = "./src/screens/"
screen_stories_dir = "./storybook/stories/screens/"

# Filters the list of files and returns the component names that are represented
def filter_components(files):
    components_names = []
    for item in files:
        if item.endswith(".js") and item != "index.js" and item != "Root.js":
            components_names.append(item[:-3])  # Remove the file extension
    return set(components_names)

# Filters the list of compoonents and returns the list of components marked as no mock using this comment in the file "// storybook-no-mock"
ignore_pattern = re.compile('\s*//\s*storybook-no-mock')
def filter_no_mock_components(components):
    no_mock_components = []
    for component in components:
        path = join(components_dir, component + ".js")
        if os.path.isfile(path):
            with open(path, "r") as file:
                contents = file.read()
                if ignore_pattern.search(contents):
                    no_mock_components.append(component)
    return no_mock_components

# Loads the component file and returns the imports it has for other components
# This pattern looks for components importing others, except those which are marked as do not mock
import_pattern = re.compile('import (?P<import>\S*) from \"\.\/(?P=import)\"')
def component_imports(component, no_mock_components):
    path = join(components_dir, component + ".js")
    if os.path.isfile(path):
        with open(path, "r") as file:
            contents = file.read()
            results = import_pattern.findall(contents)
            if results:
                return set([x for x in results if x not in no_mock_components])
    return set()


# Loads the storyshot test file file and returns the imports it has for other components
# This pattern looks for components importing others, except those which are marked as do not mock
mock_pattern = re.compile('jest.mock\(\s*\"(?:\.\./){4}src/components/(?P<name>\S+)\",\s*\(\) => \"(?P=name)\"\s*\);')
def component_story_test_mocks(component):
    path = join(component_story_test_dir, component + ".js")
    if os.path.isfile(path):
        with open(path, "r") as file:
            contents = file.read()
            results = mock_pattern.findall(contents)
            if results:
                return set(results)
    return set()

# Writes the index require file for the storybook for the given list of modules
def write_index(path, requires):
    require_string = ""
    for require in sorted(requires):
        require_string += "require(\"./" + require +"\");\n"
    contents = "// BEEP BOOP! I am a generated file. Don't edit me manually.\n// @flow\n\n" + require_string
    with open(join(path, "index.js"), "w") as file:
        file.write(contents)

# Get the list of components which are represented in each directory
components = filter_components(os.listdir(components_dir))
component_stories = filter_components(os.listdir(component_stories_dir))
component_story_tests = filter_components(os.listdir(component_story_test_dir))
screens = filter_components(os.listdir(screens_dir))
screen_stories = filter_components(os.listdir(screen_stories_dir))

# Calculate any missing or additional components
missing_component_stories = components - component_stories
extra_component_stories = component_stories - components
missing_component_story_tests = components - component_story_tests
extra_component_story_tests = component_story_tests - components
missing_screen_stories = screens - screen_stories
extra_screen_stories = screen_stories - screens

# Figure out the list of imports needed for the components and the ones we alreay have mocked
no_mock_components = filter_no_mock_components(components)
required_mocks = {}
current_mocks = {}
for component in components:
    required_mocks[component] = component_imports(component, no_mock_components)
    current_mocks[component] = component_story_test_mocks(component)
incorrect_mocks = required_mocks != current_mocks

# Figure out of we need an update
update_required = (len(missing_component_stories) > 0 or
                   len(extra_component_stories) > 0 or
                   len(missing_component_story_tests) > 0 or
                   len(extra_component_story_tests) > 0 or
                   len(missing_screen_stories) > 0 or
                   len(extra_screen_stories) > 0 or
                   incorrect_mocks)

# Print out the status
if len(missing_component_stories) > 0:
    print("MISSING COMPONENT STORIES: %s" % (", ".join(missing_component_stories)))
if len(extra_component_stories) > 0:
    print("EXTRA COMPONENT STORIES: %s" % (", ".join(extra_component_stories)))
if len(missing_component_story_tests) > 0:
    print("MISSING COMPONENT STORY TESTS: %s" % (", ".join(missing_component_story_tests)))
if len(extra_component_story_tests) > 0:
    print("EXTRA COMPONENT STORY TESTS: %s" % (", ".join(extra_component_story_tests)))
if len(missing_screen_stories) > 0:
    print("MISSING SCREEN STORIES: %s" % (", ".join(missing_screen_stories)))
if len(extra_screen_stories) > 0:
    print("EXTRA SCREEN STORIES: %s" % (", ".join(extra_screen_stories)))
if incorrect_mocks:
    print("INCORRECT MOCKS IN COMPONENT STORY TESTS")

if update and update_required:
    # Create missing stories
    for missing_component_story in missing_component_stories:
        contents = """// @flow

import React from "react";
import { storiesOf } from "@storybook/react-native";

import """ + missing_component_story + """ from "~/src/components/""" + missing_component_story + """";
import CenterView from "~/storybook/decorators/CenterView";

storiesOf(\"""" + missing_component_story + """\", module)
  .addDecorator(getStory =>
    <CenterView>
      {getStory()}
    </CenterView>
  )
  .add("Default", () =>
    <""" + missing_component_story + """ />
  );
"""
        with open(join(component_stories_dir, missing_component_story + ".js"), "w") as file:
            file.write(contents)
    for missing_screen_story in missing_screen_stories:
        contents = """// @flow

import React from "react";
import { storiesOf } from "@storybook/react-native";

import { """ + missing_screen_story + """Screen } from "~/src/screens/""" + missing_screen_story + """";

storiesOf(\"Screen: """ + missing_screen_story + """\", module)
  .add("Default", () =>
    <""" + missing_screen_story + """Screen />
  );
"""
        with open(join(screen_stories_dir, missing_screen_story + ".js"), "w") as file:
            file.write(contents)

    # Remove additional stories
    for extra_component_story in extra_component_stories:
        os.remove(join(component_stories_dir, extra_component_story + ".js"))
    for extra_screen_story in extra_screen_stories:
        os.remove(join(screen_stories_dir, extra_screen_story + ".js"))

    # Generate the index files
    write_index(screen_stories_dir, screens)
    write_index(component_stories_dir, components)

    # Remove previous story tests
    for test in component_story_tests:
        os.remove(join(component_story_test_dir, test + ".js"))

    # Generate the story tests
    for component in components:
        mocks_string = ""
        for mock in sorted(required_mocks[component]):
            mocks_string += "jest.mock(\"../../../../src/components/" + mock +"\", () => \"" + mock +"\");\n"
        contents = """// BEEP BOOP! I am a generated file. Don't edit me manually.
// @flow

import initStoryshots from "@storybook/addon-storyshots";
""" + mocks_string + """

initStoryshots({
  storyKindRegex: /^""" + component + """$/
});
"""
        with open(join(component_story_test_dir, component + ".js"), "w") as file:
            file.write(contents)

    # Run prettier on the generated files to ensure it is in the correct format
    subprocess.check_call(["yarn", "prettier-storybook"])

    # Print the success message
    print("Successfully updated storybook. Run `yarn test` to generate the snapshots.")

# If we are in check mode and we need to update, set the correct exit status
if check and update_required:
    sys.exit(1)
