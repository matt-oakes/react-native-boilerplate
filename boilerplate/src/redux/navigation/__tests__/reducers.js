/* eslint-env jest */
// @flow

import reducer from "../reducers";

describe("Navigation reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "noop" })).toMatchSnapshot();
  });
});
