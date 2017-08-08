/* eslint-env jest */
// @flow

import UIActions from "../actions";

describe("UI actions", () => {
  it("should correctly return a appLoaded action", () => {
    expect(UIActions.appLoaded()).toMatchSnapshot();
  });
});
