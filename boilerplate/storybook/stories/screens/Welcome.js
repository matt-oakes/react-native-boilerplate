// @flow

import React from "react";
import { storiesOf } from "@storybook/react-native";

import { WelcomeScreen } from "~/src/screens/Welcome";

storiesOf("Screen: Welcome", module).add("Default", () => <WelcomeScreen />);
