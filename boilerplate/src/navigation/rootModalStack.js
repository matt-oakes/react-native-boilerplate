// @flow

import { StackNavigator } from "react-navigation";

import { RootModelRouteKeys } from "./types";

const routes = {
  [RootModelRouteKeys.ROOT_NAVIGATION_STACK]: {
    getScreen: () => require("./rootNavigationStack").default
  },
  [RootModelRouteKeys.MODAL_NAVIGATION_STACK]: {
    getScreen: () => require("./modalNavigationStack").default
  }
};

const congifuration = {
  mode: "modal",
  headerMode: "none",
  navigationOptions: {
    gesturesEnabled: false
  }
};

export default StackNavigator(routes, congifuration);
