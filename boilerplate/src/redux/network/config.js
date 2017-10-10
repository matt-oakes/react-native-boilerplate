// @flow

import { Actions } from "../types";
import type { RequestKeyActionMapType } from "./types";

// The request keys used to reference the types of network requests
export const RequestKey = {
  REPLACE_ME: "replaceMe"
};
// Why doesn't Flow let us define this type from the enum above...
export type RequestKeyType = "";

// This maps the request keys to the actions which trigger the state changes
export const RequestKeyActionMap: RequestKeyActionMapType = {
  [RequestKey.REPLACE_ME]: {}
};
