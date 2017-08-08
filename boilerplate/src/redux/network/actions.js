// @flow

import { Actions } from "./types";
import type { NetworkActionType, RequestKeyType, RequestIdType } from "./types";

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
