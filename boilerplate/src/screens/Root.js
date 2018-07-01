// @flow

import React from "react";
import { BackHandler } from "react-native";
import { connect } from "react-redux";
import {
  NavigationActions as ReactNavigationActions,
  type NavigationState
} from "react-navigation";
import { reduxifyNavigator } from "react-navigation-redux-helpers";

import Navigator from "~/src/navigation/rootNavigationStack";
import type { DispatchType, StateType } from "~/src/redux/types";
import { NavigationSelectors } from "~/src/redux/navigation";

const ReduxNavigator = reduxifyNavigator(Navigator, "root");

type StateProps = {
  canGoBack: boolean,
  navigationState: NavigationState
};
type DispatchProps = {
  dispatch: DispatchType
};
type Props = StateProps & DispatchProps;

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
    return <ReduxNavigator dispatch={dispatch} state={navigationState} />;
  }
}

const mapStateToProps = (state: StateType): StateProps => {
  return {
    canGoBack: !NavigationSelectors.isAtRoot(state),
    navigationState: NavigationSelectors.getNavigationState(state)
  };
};

const mapDispatchToProps = (dispatch: DispatchType): DispatchProps => {
  return {
    dispatch
  };
};

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default connector(RootScreen);
