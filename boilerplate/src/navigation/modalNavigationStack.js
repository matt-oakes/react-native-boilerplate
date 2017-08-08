// @flow

import { StackNavigator } from "react-navigation";

import { ModalRouteKeys } from "./types";

const routes = {};

const congifuration = {
  mode: "card",
  headerMode: "screen"
};

export default StackNavigator(routes, congifuration);
