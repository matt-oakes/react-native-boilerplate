// @flow

import Navigator from "~/src/navigation/rootNavigationStack";
import type { NavigationStateType } from "./types";
import type { ActionType } from "../types";

const reducer = (
  state: NavigationStateType = initialState,
  action: ActionType
) => {
  return Navigator.router.getStateForAction(action, state) || state;
};

export default reducer;
