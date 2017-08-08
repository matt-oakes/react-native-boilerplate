/* eslint-env jest */
// @flow

import UIActions from "../actions";
import reducer, { initialState as uiInitialState } from "../reducers";
import type { UIStateType } from "../types";
import { Actions } from "../../types";
import type { ActionType } from "../../types";

describe("UI reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "noop" })).toMatchSnapshot();
  });

  describe("UI_APP_LOADED", () => {
    const testAppLoad = (
      previousAppLoaded: boolean,
      action: ActionType,
      expectedAppLoaded: boolean,
    ) => {
      const startState: UIStateType = {
        ...uiInitialState,
        appLoaded: previousAppLoaded
      };

      const newState = reducer(startState, action);

      expect(newState.appLoaded).toEqual(expectedAppLoaded);
    };

    it("should correctly change the status to loaded when it was set to not loaded previously", () => {
      testAppLoad(false, UIActions.appLoaded(), true);
    });

    it("should correctly leave the status as loaded when it was set to loaded previously", () => {
      testAppLoad(true, UIActions.appLoaded(), true);
    });
  });
});
