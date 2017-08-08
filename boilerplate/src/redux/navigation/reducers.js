// @flow

import { NavigationActions } from "react-navigation";
import { REHYDRATE } from "redux-persist/constants";
import _ from "lodash";

import Navigator from "~/src/navigation/rootNavigationStack";
import NavigationTypes from "~/src/navigation/types";
import type { NavigationStateType } from "./types";
import { Actions } from "../types";
import type { ActionType } from "../types";

/**
 * Modal stack navigation
 **/

export const initialState = Navigator.router.getStateForAction(
  NavigationActions.init()
);

export const signedOutAction = NavigationActions.reset({
  index: 0,
  key: null,
  actions: [
    NavigationActions.navigate({
      routeName: NavigationTypes.RootModelRouteKeys.ROOT_NAVIGATION_STACK,
      action: NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: NavigationTypes.RootNavigationRouteKeys.WELCOME
          })
        ]
      })
    })
  ]
});

// TODO: Set this to the correct signed in state
export const signedInAction = NavigationActions.reset({
  index: 0,
  key: null,
  actions: [
    NavigationActions.navigate({
      routeName: NavigationTypes.RootModelRouteKeys.ROOT_NAVIGATION_STACK,
      action: NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: NavigationTypes.RootNavigationRouteKeys.WELCOME
          })
        ]
      })
    })
  ]
});

export const signedOutState = Navigator.router.getStateForAction(signedOutAction);

export const signedInState = Navigator.router.getStateForAction(signedInAction);

const reducer = (
  state: NavigationStateType = initialState,
  action: ActionType
) => {
  let nextState;
  switch (action.type) {
    case Actions.UI_APP_LOADED:
      nextState = action.isSignedIn ? signedInState : signedOutState;
      break;
    case Actions.NAVIGATION_CLOSE_MODAL:
      if (
        state.index === 0 &&
        state.routes.length === 1 &&
        state.routes[0].routeName ===
          NavigationTypes.RootModelRouteKeys.MODAL_NAVIGATION_STACK
      ) {
        nextState = signedInState;
      } else {
        nextState = {
          ...state,
          index: 0,
          routes: _.take(state.routes, 1)
        };
      }
      break;
    default:
      nextState = Navigator.router.getStateForAction(action, state);
  }

  return nextState || state;
};

export default reducer;
