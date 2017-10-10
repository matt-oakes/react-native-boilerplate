/* eslint-env jest */
// @flow

import _ from "lodash";

import { RequestKey, RequestKeyActionMap } from "../config";
import NetworkSelectors from "../selectors";
import { initialState as networkInitialState } from "../reducers";
import type { NetworkStateType } from "../types";
import { createRequestHashKey } from "../utils";
import { initialState } from "~/src/redux";
import { APIError } from "~/src/models/apiError";

// TODO: Reenable these once you are making network requests
describe.skip("Network selectors", () => {
  _.each(RequestKeyActionMap, (actions, requestKey) => {
    const requestId = actions.requestIdKey ? "123" : "";
    const requestHashKey = createRequestHashKey(requestKey, requestId);

    describe("isLoading(" + requestKey + ")", () => {
      it("should return true when loading", () => {
        const networkState: NetworkStateType = {
          ...networkInitialState,
          loading: {
            [requestHashKey]: true
          }
        };
        const state = {
          ...initialState,
          network: networkState
        };

        expect(
          NetworkSelectors.isLoading(state)(requestKey, requestId)
        ).toEqual(true);
      });

      it("should return false when not loading", () => {
        const networkState: NetworkStateType = {
          ...networkInitialState,
          loading: {}
        };
        const state = {
          ...initialState,
          network: networkState
        };

        expect(
          NetworkSelectors.isLoading(state)(requestKey, requestId)
        ).toEqual(false);
      });
    });

    describe("getError(" + requestKey + ")", () => {
      it("should return the error when there is one", () => {
        const expectedError = new APIError();

        const networkState: NetworkStateType = {
          ...networkInitialState,
          errors: {
            [requestHashKey]: expectedError
          }
        };
        const state = {
          ...initialState,
          network: networkState
        };

        expect(NetworkSelectors.getError(state)(requestKey, requestId)).toEqual(
          expectedError
        );
      });

      it("should return null when there is no error", () => {
        const networkState: NetworkStateType = {
          ...networkInitialState,
          errors: {}
        };
        const state = {
          ...initialState,
          network: networkState
        };

        expect(NetworkSelectors.getError(state)(requestKey, requestId)).toEqual(
          null
        );
      });
    });

    describe("getErrorTitle(" + requestKey + ")", () => {
      it("should return the title when there is one", () => {
        const expectedError = new APIError();

        const networkState: NetworkStateType = {
          ...networkInitialState,
          errors: {
            [requestHashKey]: expectedError
          }
        };
        const state = {
          ...initialState,
          network: networkState
        };

        expect(
          NetworkSelectors.getErrorTitle(state)(requestKey, requestId)
          // $FlowExpectedError Flow cannot see inside the APIError object
        ).toEqual(expectedError.title);
      });

      it("should return null when there is no error", () => {
        const networkState: NetworkStateType = {
          ...networkInitialState,
          errors: {}
        };
        const state = {
          ...initialState,
          network: networkState
        };

        expect(
          NetworkSelectors.getErrorTitle(state)(requestKey, requestId)
        ).toEqual(null);
      });
    });
  });
});
