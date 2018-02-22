// @flow

import type { UIStateType } from "./types";
import { Actions } from "../types";
import type { ActionType } from "../types";

export const initialState: UIStateType = {
  appLoaded: false
};

export default function reducer(
  state: UIStateType = initialState,
  action: ActionType
): UIStateType {
  switch (action.type) {
    case Actions.UI_APP_LOADED:
      return {
        ...state,
        appLoaded: true
      };
    default:
      return state;
  }
}
