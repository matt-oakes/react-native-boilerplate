// @flow

export const RootModelRouteKeys = {
  ROOT_NAVIGATION_STACK: "rootNavigationStack",
  MODAL_NAVIGATION_STACK: "modalNavigationStack"
};

export const RootNavigationRouteKeys = {
  WELCOME: "welcome"
};

export const ModalRouteKeys = {};

export const RouteKeys = {
  ...RootModelRouteKeys,
  ...RootNavigationRouteKeys,
  ...ModalRouteKeys
};

export default {
  RootModelRouteKeys,
  RootNavigationRouteKeys,
  ModalRouteKeys,
  RouteKeys
};
