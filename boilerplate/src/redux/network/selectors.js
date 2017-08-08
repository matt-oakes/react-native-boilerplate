// @flow

import { createSelector } from "reselect";

import type { RequestKeyType, RequestIdType } from "./types";
import type { StateType } from "../types";
import { createRequestHashKey } from "./utils";

const isLoading = (
  requestKey: RequestKeyType,
  requestId: RequestIdType = ""
) => (state: StateType) =>
  !!state.network.loading[createRequestHashKey(requestKey, requestId)];

const getError = (
  requestKey: RequestKeyType,
  requestId: RequestIdType = ""
) => (state: StateType) =>
  state.network.errors[createRequestHashKey(requestKey, requestId)] || null;

const getErrorTitle = (
  requestKey: RequestKeyType,
  requestId: RequestIdType = ""
) =>
  createSelector(getError(requestKey, requestId), error => {
    return error && error.title ? error.title : null;
  });

export default {
  isLoading,
  getError,
  getErrorTitle
};
