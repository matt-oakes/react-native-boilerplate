// @flow

import type { Store as ReduxStore, Dispatch as ReduxDispatch } from "redux";

import NavigationTypes from "./navigation/types";
import type { NavigationActionType, NavigationStateType } from "./navigation/types";
import NetworkTypes from "./network/types";
import type { NetworkStateType } from "./network/types";
import UITypes from "./ui/types";
import type { UIActionType, UIStateType } from "./ui/types";

/**
 * Redux actions
 **/

export const Actions = {
  ...NavigationTypes.Actions,
  ...NetworkTypes.Actions,
  ...UITypes.Actions
};
export type ActionNameType = $Keys<typeof Actions>;

export type ActionType =
  | NavigationActionType
  | UIActionType
  | { type: "noop" };

/**
 * Redux store state
 **/

export type StateType = {|
  navigation: NavigationStateType,
  network: NetworkStateType,
  ui: UIStateType
|};

/**
 * Redux globals
 **/

export type DispatchType = ReduxDispatch<ActionType>;
export type StoreType = ReduxStore<StateType, ActionType>;
