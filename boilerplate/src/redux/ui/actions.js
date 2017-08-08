// @flow

import { Actions } from "./types";
import type { UIActionType } from "./types";

export function appLoaded(): UIActionType {
  return {
    type: Actions.UI_APP_LOADED
  };
}

export default {
  appLoaded
};
