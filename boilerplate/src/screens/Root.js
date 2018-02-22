// @flow

import React from "react";
import { BackHandler } from "react-native";
import { connect, type Connector } from "react-redux";
import {
  addNavigationHelpers,
  NavigationActions as ReactNavigationActions,
  type NavigationState
} from "react-navigation";
import { createReduxBoundAddListener } from "react-navigation-redux-helpers";

import Navigator from "~/src/navigation/rootNavigationStack";
import type { DispatchType, StateType } from "~/src/redux/types";
import { NavigationSelectors } from "~/src/redux/navigation";

export type Props = {
  canGoBack: boolean,
  navigationState: NavigationState,
  dispatch: DispatchType
};

export class RootScreen extends React.PureComponent<Props> {
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this._onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._onBackPress);
  }

  _onBackPress = () => {
    if (this.props.canGoBack) {
      this.props.dispatch(ReactNavigationActions.back());
      return true;
    }

    return false;
  };

  render() {
    const { navigationState, dispatch } = this.props;
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
}

const mapStateToProps = (state: StateType) => {
  return {
    canGoBack: !NavigationSelectors.isAtRoot(state),
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
