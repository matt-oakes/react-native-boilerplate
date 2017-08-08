// @flow

import { StackNavigator } from "react-navigation";

import { RootNavigationRouteKeys } from "./types";

const routes = {
  [RootNavigationRouteKeys.WELCOME]: {
    getScreen: () => require("~/src/screens/Welcome").default
  }
};

const congifuration = {
  mode: "card",
  headerMode: "screen"
};

export default StackNavigator(routes, congifuration);
