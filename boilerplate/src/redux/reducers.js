// @flow

import { combineReducers } from "redux";

import navigation, { NavigationInitialState } from "./navigation";
import network, { NetworkInitialState } from "./network";
import ui, { UIInitialState } from "./ui";
import type { ActionType, StateType } from "./types";

/**
 * Default redux store state
 **/

export const initialState: StateType = {
  navigation: NavigationInitialState,
  network: NetworkInitialState,
  ui: UIInitialState
};

export default combineReducers({
  navigation,
  network,
  ui
});
