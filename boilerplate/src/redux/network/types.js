// @flow

import type { RequestKeyType } from "./config";
import { APIError } from "~/src/models/apiError";

/**
 * Config types
 **/

export type RequestIdType = string;

// TODO: These should have the action names as a type
export type ActionsMapType = {|
  requestIdKey?: string, // This key path is used to differentiate between different requests of the same type
  request?: string,
  cancelled?: string,
  failed?: string, // This action must have an "error" property
  complete?: string
|};
export type RequestKeyActionMapType = {
  [requestKey: RequestKeyType]: ActionsMapType
};

/**
 * Redux store state types
 **/

// This is used as the hash key for the loading and errors map
export type RequestHashKeyType = string;

type _NetworkStateType = {
  loading: { [RequestHashKeyType]: true },
  errors: { [RequestHashKeyType]: APIError }
};
type Exact<T> = T & $Shape<T>;
export type NetworkStateType = Exact<_NetworkStateType>;

/**
 * Redux action types
 **/

export const Actions = {
  NETWORK_CLEAR_ERROR: "network/clear_error"
};

// It would be lovely if Flow let you use the const above as a string literal instead of duplicating it, but it doesn't...
export type NetworkActionType = {|
  type: "network/clear_error",
  requestKey: RequestKeyType,
  requestId: RequestIdType
|};

/**
 * Export it all
 **/

export default {
  Actions
};
