// @flow

/**
 * Redux store state types
 **/

export type _UIStateType = {
  appLoaded: boolean
};
type Exact<T> = T & $Shape<T>;
export type UIStateType = Exact<_UIStateType>;

/**
 * Redux action types
 **/

export const Actions = {
  UI_APP_LOADED: "ui/app_loaded"
};

// It would be lovely if Flow let you use the const above as a string literal instead of duplicating it, but it doesn't...
export type UIActionType =
  | {| type: "ui/app_loaded" |};

/**
 * Export it all
 **/

export default {
  Actions
};
