// @flow

import type { Store as ReduxStore, Dispatch as ReduxDispatch } from "redux";

import NavigationTypes from "./navigation/types";
import type { NavigationActionType, NavigationStateType } from "./navigation/types";
import NetworkTypes from "./network/types";
import type { NetworkActionType, NetworkStateType } from "./network/types";
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
  | NetworkActionType
  | UIActionType
  | { type: "noop" };

/**
 * Redux store state
 **/

export const PersistVersionKey = "persist";
export type PersistStateType = ?{ version: number };

export type StateType = {|
  persist: PersistStateType,
  navigation: NavigationStateType,
  network: NetworkStateType,
  ui: UIStateType
|};

/**
 * Redux globals
 **/

export type DispatchType = ReduxDispatch<ActionType>;
export type StoreType = ReduxStore<StateType, ActionType>;
