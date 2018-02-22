// @flow

import { createSelector } from "reselect";

import type { RequestKeyType } from "./config";
import type { RequestIdType } from "./types";
import { createRequestHashKey } from "./utils";

import type { StateType } from "../types";

const isLoading = (state: StateType) => {
  return (requestKey: RequestKeyType, requestId: RequestIdType = "") => {
    return !!state.network.loading[createRequestHashKey(requestKey, requestId)];
  };
};

const getError = (state: StateType) => {
  return (requestKey: RequestKeyType, requestId: RequestIdType = "") => {
    return (
      state.network.errors[createRequestHashKey(requestKey, requestId)] || null
    );
  };
};

const getErrorTitle = createSelector(getError, getErrorFunction => {
  return (requestKey: RequestKeyType, requestId: RequestIdType = "") => {
    const error = getErrorFunction(requestKey, requestId);
    return error && error.title ? error.title : null;
  };
});

export default {
  isLoading,
  getError,
  getErrorTitle
};
