// @flow

import { createSelector } from "reselect";

import type { StateType } from "../types";

export const getNavigationState = (state: StateType) => state.navigation;

const getCurrentRouteInternal = state => {
  if (!state) {
    return null;
  }
  const route = state.routes[state.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteInternal(route);
  } else {
    return route;
  }
};
export const getCurrentRoute = createSelector(getNavigationState, state =>
  getCurrentRouteInternal(state)
);
export const getCurrentRouteName = createSelector(getNavigationState, state => {
  const currentRoute = getCurrentRouteInternal(state);
  return (currentRoute && currentRoute.routeName) || null;
});

export const isAtRoot = createSelector(getNavigationState, navigationState => {
  // Check if there is only a single route on the stack
  if (navigationState.index === 0) {
    // Check if that single route is a navigation stack
    const currentRoute = navigationState.routes[navigationState.index];
    if (currentRoute && currentRoute.routes) {
      // If it is, check if the navigation stack is at its root
      return currentRoute.index === 0;
    } else {
      // If not, then we're at the root
      return true;
    }
  }

  // If not then we're not at the root
  return false;
});

export default {
  getNavigationState,
  getCurrentRoute,
  getCurrentRouteName,
  isAtRoot
};
