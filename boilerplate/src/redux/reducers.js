// @flow

import { combineReducers } from "redux";

import navigation, { NavigationInitialState } from "./navigation";
import network, { NetworkInitialState } from "./network";
import ui, { UIInitialState } from "./ui";
import { PersistVersionKey } from "./types";
import type { ActionType, StateType, PersistStateType } from "./types";

/**
 * Default redux store state
 **/

export const initialState: StateType = {
  persist: null,
  navigation: NavigationInitialState,
  network: NetworkInitialState,
  ui: UIInitialState
};

export default combineReducers({
  // A very simple reducer which just takes and stores the persist version code for migrations
  persist: (state: PersistStateType = null) => state,
  // All of our proper reducers
  navigation,
  network,
  ui
});
