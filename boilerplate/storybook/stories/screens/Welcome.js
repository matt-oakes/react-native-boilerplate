// @flow

import React from "react";
import { storiesOf } from "@storybook/react-native";

import { WelcomeScreen } from "~/src/screens/Welcome";
import CenterView from "~/storybook/decorators/CenterView";

storiesOf("Screen: Welcome", module).add("Default", () => <WelcomeScreen />);
