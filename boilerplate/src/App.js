// @flow
import "./i18n"; // Imported for the side effects

import React from "react";
import { Provider } from "react-redux";

import Store from "./redux";
import RootScreen from "./screens/Root";

export default function Root(): React.Element<*> {
  return (
    <Provider store={Store}>
      <RootScreen />
    </Provider>
  );
}
