// @flow

import _ from "lodash";
import { NavigationActions } from "react-navigation";

import { Actions as NetworkActions, RequestKey } from "./types";
import type {
  RequestKeyType,
  NetworkStateType,
  RequestHashKeyType
} from "./types";
import { createRequestHashKey } from "./utils";
import { Actions } from "../types";
import type { ActionType, ActionNameType } from "../types";
import { APIError } from "~/src/models/apiError";

export const initialState: NetworkStateType = {
  loading: {},
  errors: {}
};

type ActionsMapType = {|
  requestIdKey?: string, // This key path is used to differentiate between different requests of the same type
  request?: ActionNameType,
  cancelled?: ActionNameType,
  failed?: ActionNameType, // This action must have an "error" property
  complete?: ActionNameType
|};
type RequestKeyActionMapType = {
  [requestKey: RequestKeyType]: ActionsMapType
};

// This maps the request keys to the actions which trigger the state changes
export const RequestKeyActionMap: RequestKeyActionMapType = {};

// We transform the above map into 4 other maps which are easier to work with in the reducer
// This is done because the above map is easier for the developer to set up
type ActionRequestKeyMapType = { [actionType: ActionNameType]: RequestKeyType };
// The actions which will set the loading property
export const SetsLoadingActions: ActionRequestKeyMapType = {};
// The actions which will clear the loading property
export const ClearsLoadingActions: ActionRequestKeyMapType = {};
// The actions which will set an error for the request key (from the action.error property)
export const SetsErrorActions: ActionRequestKeyMapType = {};
// The actions which will clear the error for a given request key
export const ClearsErrorActions: ActionRequestKeyMapType = {};

_.each(RequestKeyActionMap, (actions, requestKey) => {
  // Request actions set load and clear errors
  if (actions.request) {
    SetsLoadingActions[actions.request] = requestKey;
    ClearsErrorActions[actions.request] = requestKey;
  }
  // Cancelled actions clear loading and errors
  if (actions.cancelled) {
    ClearsLoadingActions[actions.cancelled] = requestKey;
    ClearsErrorActions[actions.cancelled] = requestKey;
  }
  // Failed actions clear loading and set errors
  if (actions.failed) {
    ClearsLoadingActions[actions.failed] = requestKey;
    SetsErrorActions[actions.failed] = requestKey;
  }
  // Complete actions clear loading and errors
  if (actions.complete) {
    ClearsLoadingActions[actions.complete] = requestKey;
    ClearsErrorActions[actions.complete] = requestKey;
  }
});

const getRequestHashKey = (requestKey, action) => {
  const actionMap = RequestKeyActionMap[requestKey];
  const requestId =
    actionMap && actionMap.requestIdKey && action[actionMap.requestIdKey]
      ? action[actionMap.requestIdKey]
      : "";
  return createRequestHashKey(requestKey, requestId);
};

export default function reducer(
  state: NetworkStateType = initialState,
  action: ActionType
): NetworkStateType {
  let newState = state;
  // Handle clearing the error
  if (action.type === NetworkActions.NETWORK_CLEAR_ERROR) {
    newState = {
      ...newState,
      errors: _.omit(
        newState.errors,
        createRequestHashKey(action.requestKey, action.requestId)
      )
    };
  }

  // Set the loading key if the action is in the map
  // $FlowExpectedError Flow isn't happy that we're checking for null
  const setsLoadingRequestKey = SetsLoadingActions[action.type];
  if (setsLoadingRequestKey) {
    const requestHashKey = getRequestHashKey(setsLoadingRequestKey, action);
    newState = {
      ...newState,
      loading: {
        ...newState.loading,
        [requestHashKey]: true
      }
    };
  }

  // Clear the loading key if the action is in the map
  // $FlowExpectedError Flow isn't happy that we're checking for null
  const clearsLoadingRequestKey = ClearsLoadingActions[action.type];
  if (clearsLoadingRequestKey) {
    const requestHashKey = getRequestHashKey(clearsLoadingRequestKey, action);
    newState = {
      ...newState,
      loading: _.omit(newState.loading, requestHashKey)
    };
  }

  // Set the error key if the action is in the map
  // $FlowExpectedError Flow isn't happy that we're checking for null
  const setsErrorRequestKey = SetsErrorActions[action.type];
  if (setsErrorRequestKey) {
    const requestHashKey = getRequestHashKey(setsErrorRequestKey, action);
    const error = action.error ? action.error : new APIError();
    newState = {
      ...newState,
      errors: {
        ...newState.errors,
        [requestHashKey]: error
      }
    };
  }

  // Clear the error key if the action is in the map
  // $FlowExpectedError Flow isn't happy that we're checking for null
  const clearsErrorRequestKey = ClearsErrorActions[action.type];
  if (clearsErrorRequestKey) {
    const requestHashKey = getRequestHashKey(clearsErrorRequestKey, action);
    newState = {
      ...newState,
      errors: _.omit(newState.errors, requestHashKey)
    };
  }

  return newState;
}
