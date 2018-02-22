// @flow

import {
  type Store as ReduxStore, //eslint-disable-line import/named
  type Dispatch as ReduxDispatch //eslint-disable-line import/named
} from "redux";

import NavigationTypes from "./navigation/types";
import type { NavigationStateType } from "./navigation/types";
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

export type ActionType = NetworkActionType | UIActionType | { type: "noop" };

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
