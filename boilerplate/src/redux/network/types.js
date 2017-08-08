// @flow

import { APIError } from "~/src/models/apiError";

/**
* Request keys
**/

export const RequestKey = {
  EXAMPLE: "example"
};
// Why doesn't Flow let us define this type from the enum above...
export type RequestKeyType = "example";

export type RequestIdType = string;

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
  Actions,
  RequestKey
};
