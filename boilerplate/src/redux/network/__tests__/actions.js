/* eslint-env jest */
// @flow

import UserActions from "../actions";
import { RequestKey } from "../types";

describe("Network actions", () => {
  describe("clearError", () => {
    it("should return an action when only provided with a key", () => {
      expect(UserActions.clearError(RequestKey.EXAMPLE)).toMatchSnapshot();
    });

    it("should return an action when provided with a key and properties", () => {
      expect(
        UserActions.clearError(RequestKey.EXAMPLE, "12345")
      ).toMatchSnapshot();
    });
  });
});
