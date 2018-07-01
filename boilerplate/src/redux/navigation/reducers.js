// @flow

import { combineReducers } from "redux";
import { NavigationActions, type NavigationState } from "react-navigation";

import Navigator from "~/src/navigation/rootNavigationStack";
import type { NavigationStateType } from "./types";
import type { ActionType } from "../types";

export const stateInitialState = Navigator.router.getStateForAction(
  NavigationActions.init(),
  null
);

const stateReducer = (
  state: NavigationState = stateInitialState,
  action: ActionType
) => {
  return Navigator.router.getStateForAction(action, state);
};

/**
 * Combine the reducers
 */

export const initialState: NavigationStateType = {
  state: stateInitialState
};

export default combineReducers({
  state: stateReducer
});
