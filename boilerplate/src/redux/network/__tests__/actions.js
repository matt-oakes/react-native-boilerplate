/* eslint-env jest */
// @flow

import UserActions from "../actions";
import { RequestKey } from "../config";

describe("Network actions", () => {
  describe("clearError", () => {
    it("should return an action when only provided with a key", () => {
      expect(UserActions.clearError(RequestKey.REPLACE_ME)).toMatchSnapshot();
    });

    it("should return an action when provided with a key and properties", () => {
      expect(
        UserActions.clearError(RequestKey.REPLACE_ME, "12345")
      ).toMatchSnapshot();
    });
  });
});
