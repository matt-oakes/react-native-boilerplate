// @flow

import React from "react";
import { connect } from "react-redux";
import type { Connector } from "react-redux";
import { addNavigationHelpers, type NavigationState } from "react-navigation";
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';

import Navigator from "~/src/navigation/rootNavigationStack";
import type { DispatchType, StateType } from "~/src/redux/types";
import { NavigationSelectors } from "~/src/redux/navigation";

export type Props = {
  navigationState: NavigationState,
  dispatch: DispatchType
};

export function RootScreen({ navigationState, dispatch}: Props) {
  return (
  <Navigator
    navigation={addNavigationHelpers({
      dispatch: dispatch,
      state: navigationState,
      addListener: createReduxBoundAddListener("root")
    })}
  />
  );
}

const mapStateToProps = (state: StateType) => {
  return {
    navigationState: NavigationSelectors.getNavigationState(state)
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    dispatch
  };
};

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default connector(RootScreen);
