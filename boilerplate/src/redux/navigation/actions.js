// @flow

import { NavigationActions } from "react-navigation";

import NavigationTypes from "~/src/navigation/types";
import { Actions } from "./types";
import type { NavigationActionType } from "./types";

export function closeModal(): NavigationActionType {
  return {
    type: Actions.NAVIGATION_CLOSE_MODAL
  };
}

export default {
  closeModal
};
