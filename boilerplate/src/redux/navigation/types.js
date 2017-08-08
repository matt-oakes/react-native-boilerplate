// @flow

import type { NavigationAction, NavigationState } from "react-navigation";

export type NavigationStateType = NavigationState;

/**
 * Redux action types
 **/

export const Actions = {
  NAVIGATION_CLOSE_MODAL: "navigation/close_modal"
};

// It would be lovely if Flow let you use the const above as a string literal instead of duplicating it, but it doesn't...
export type NavigationActionType =
  | {| type: "navigation/close_modal" |}

export default {
  Actions
};
