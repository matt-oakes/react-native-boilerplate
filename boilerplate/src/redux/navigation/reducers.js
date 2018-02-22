// @flow

import { NavigationActions } from "react-navigation";

import Navigator from "~/src/navigation/rootNavigationStack";
import type { NavigationStateType } from "./types";
import type { ActionType } from "../types";

export const initialState = Navigator.router.getStateForAction(
  NavigationActions.init()
);

const reducer = (
  state: NavigationStateType = initialState,
  action: ActionType
) => {
  return Navigator.router.getStateForAction(action, state) || state;
};

export default reducer;
