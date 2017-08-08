// @flow

import React from "react";
import { connect } from "react-redux";
import type { Connector } from "react-redux";
import { addNavigationHelpers } from "react-navigation";
import type { NavigationState } from "react-navigation";

import Navigator from "~/src/navigation/rootModalStack";
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
      state: navigationState
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
