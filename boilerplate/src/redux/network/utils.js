// @flow

import type {
  RequestKeyType,
  RequestIdType,
  RequestHashKeyType
} from "./types";

export function createRequestHashKey(
  requestKey: RequestKeyType,
  requestId: RequestIdType = ""
): RequestHashKeyType {
  return requestKey + requestId;
}

export default {
  createRequestHashKey
};
