// @flow

import type { StateType } from "../types";

export const hasAppLoaded = (state: StateType) => !!state.ui.appLoaded;

export default {
  hasAppLoaded
};
