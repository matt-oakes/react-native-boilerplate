/* eslint-env jest */
// @flow

import NavigationActions from "../actions";

describe("Navigation actions", () => {
  it("should correctly return a closeModal action", () => {
    expect(NavigationActions.closeModal()).toMatchSnapshot();
  });
});
