/* eslint-env jest */
// @flow

import _ from "lodash";

import reducer, {
  initialState,
  signedOutAction,
  signedOutState,
  signedInState
} from "../reducers";
import NavigationActions from "../actions";
import type { NavigationStateType } from "../types";
import { UIActions } from "../../ui";
import type { ActionType } from "../../types";
import Navigator from "~/src/navigation/rootNavigationStack";
import NavigationTypes from "~/src/navigation/types";

describe("Navigation reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "noop" })).toMatchSnapshot();
  });

  /**
   * Initial load
   */

  // TODO: Do not skip once implemented
  // describe.skip("UI_APP_LOADED", () => {
  //   it("should show the tabs when the app is loaded and the user is signed in", () => {
  //     const action = UIActions.appLoaded(true);
  //     expect(reducer(initialState, action)).toEqual(signedInState);
  //   });

  //   it("should show the signedOut screen when the app is loaded and the user is not signed in", () => {
  //     const action = UIActions.appLoaded(false);
  //     expect(reducer(initialState, action)).toEqual(signedOutState);
  //   });
  // });

  /**
   * Close modal
   */

  describe("NAVIGATION_CLOSE_MODAL", () => {
    it("should show the tabs when signing in is complete", () => {
      const startState: NavigationStateType = Navigator.router.getStateForAction(
        signedOutAction,
        initialState
      );

      expect(
        reducer(startState, NavigationActions.closeModal())
      ).toMatchSnapshot();
    });
  });
});
