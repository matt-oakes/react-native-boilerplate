// @flow

import type { RequestKeyType } from "./config";
import { Actions } from "./types";
import type { NetworkActionType, RequestIdType } from "./types";

export function clearError(
  requestKey: RequestKeyType,
  requestId?: RequestIdType = ""
): NetworkActionType {
  return {
    type: Actions.NETWORK_CLEAR_ERROR,
    requestKey,
    requestId
  };
}

export default {
  clearError
};
