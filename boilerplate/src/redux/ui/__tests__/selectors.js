/* eslint-env jest */
// @flow

import UISelectors from "../selectors";
import { initialState as uiInitialState } from "../reducers";
import { initialState } from "~/src/redux";

describe("UI selectors", () => {
  describe("hasAppLoaded", () => {
    it("should return the correct value when the app has not loaded", () => {
      const uiState = {
        ...uiInitialState,
        appLoaded: false
      };
      const state = {
        ...initialState,
        ui: uiState
      };

      expect(UISelectors.hasAppLoaded(state)).toEqual(false);
    });

    it("should return the correct value when the app has loaded", () => {
      const uiState = {
        ...uiInitialState,
        appLoaded: true
      };
      const state = {
        ...initialState,
        ui: uiState
      };

      expect(UISelectors.hasAppLoaded(state)).toEqual(true);
    });
  });
});
