/* eslint-env jest */
// @flow

import _ from "lodash";

import NetworkActions from "../actions";
import reducer, { initialState, RequestKeyActionMap } from "../reducers";
import { Actions, RequestKey } from "../types";
import type { NetworkStateType, NetworkActionType } from "../types";
import { createRequestHashKey } from "../utils";
import { APIError } from "~/src/models/apiError";
import type { ActionType } from "../../types";

describe("Network reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "noop" })).toMatchSnapshot();
  });

  /**
   * Clear errors
   **/

  describe("UI_CLEAR_ERROR", () => {
    _.each(RequestKey, requestKey => {
      const action = NetworkActions.clearError(requestKey);

      describe(requestKey, () => {
        it("should clear the error when it wasnt set previously", () => {
          const startState: NetworkStateType = {
            ...initialState,
            errors: {}
          };

          expect(reducer(startState, action).errors).toEqual({});
        });

        it("should clear the error when it was set previously", () => {
          const startState: NetworkStateType = {
            ...initialState,
            loading: {},
            errors: {
              [createRequestHashKey(requestKey)]: new APIError()
            }
          };

          expect(reducer(startState, action).errors).toEqual({});
        });
      });
    });
  });

  /**
   * Request status action states
   **/
  const testRequestIdValue = "123";
  const generateAction = (type, requestIdKey): ActionType => {
    return requestIdKey
      ? // $FlowExpectedError
        { type, [requestIdKey]: testRequestIdValue }
      : // $FlowExpectedError
        { type };
  };

  const testSetLoading = (action, requestHashKey) => {
    it("should correctly set the loading state when it wasn't already set", () => {
      const startState: NetworkStateType = {
        ...initialState,
        loading: {}
      };

      expect(reducer(startState, action).loading).toEqual({
        [requestHashKey]: true
      });
    });

    it("should correctly set the loading state when it was already set", () => {
      const startState: NetworkStateType = {
        ...initialState,
        loading: {
          [requestHashKey]: true
        }
      };

      expect(reducer(startState, action).loading).toEqual({
        [requestHashKey]: true
      });
    });
  };

  const testClearsLoading = (action, requestHashKey) => {
    it("should correctly clear the loading state when it wasn't already set", () => {
      const startState: NetworkStateType = {
        ...initialState,
        loading: {}
      };

      // $FlowExpectedError
      expect(reducer(startState, action).loading).toEqual({});
    });

    it("should correctly clear the loading state when it was already set", () => {
      const startState: NetworkStateType = {
        ...initialState,
        loading: {
          [requestHashKey]: true
        }
      };

      // $FlowExpectedError
      expect(reducer(startState, action).loading).toEqual({});
    });
  };

  const testSetError = (action, requestHashKey) => {
    it("should correctly set the error state when it wasn't already set", () => {
      const startState: NetworkStateType = {
        ...initialState,
        errors: {}
      };

      // $FlowExpectedError
      expect(reducer(startState, action).errors).toEqual({
        [requestHashKey]: new APIError()
      });
    });

    it("should correctly set the error state when it was already set", () => {
      const startState: NetworkStateType = {
        ...initialState,
        errors: {
          [requestHashKey]: new APIError()
        }
      };

      // $FlowExpectedError
      expect(reducer(startState, action).errors).toEqual({
        [requestHashKey]: new APIError()
      });
    });
  };

  const testClearsError = (action, requestHashKey) => {
    it("should correctly clear the error state when it wasn't already set", () => {
      const startState: NetworkStateType = {
        ...initialState,
        errors: {}
      };

      expect(reducer(startState, action).errors).toEqual({});
    });

    it("should correctly clear the error state when it was already set", () => {
      const startState: NetworkStateType = {
        ...initialState,
        errors: {
          [requestHashKey]: new APIError()
        }
      };

      expect(reducer(startState, action).errors).toEqual({});
    });
  };

  describe("Request action states", () => {
    _.each(RequestKeyActionMap, (actions, requestKey) => {
      describe(requestKey, () => {
        const requestHashKey = createRequestHashKey(
          requestKey,
          actions.requestIdKey ? testRequestIdValue : ""
        );

        if (actions.request) {
          describe("Request action", () => {
            const requestAction = generateAction(
              actions.request,
              actions.requestIdKey
            );

            testSetLoading(requestAction, requestHashKey);
            testClearsError(requestAction, requestHashKey);
          });
        }

        if (actions.cancelled) {
          describe("Cancelled action", () => {
            const cancelledAction = generateAction(
              actions.cancelled,
              actions.requestIdKey
            );

            testClearsLoading(cancelledAction, requestHashKey);
            testClearsError(cancelledAction, requestHashKey);
          });
        }

        if (actions.failed) {
          describe("Failed action", () => {
            const failedAction = {
              ...generateAction(actions.failed, actions.requestIdKey),
              error: new APIError()
            };

            testClearsLoading(failedAction, requestHashKey);
            testSetError(failedAction, requestHashKey);
          });
        }

        if (actions.complete) {
          describe("Complete action", () => {
            const completeAction = generateAction(
              actions.complete,
              actions.requestIdKey
            );

            testClearsLoading(completeAction, requestHashKey);
            testClearsError(completeAction, requestHashKey);
          });
        }
      });
    });
  });
});
