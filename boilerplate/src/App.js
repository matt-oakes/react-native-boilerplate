// @flow
import "./i18n"; // Imported for the side effects

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";

import store, { persistor } from "./redux";
import RootScreen from "./screens/Root";
import SplashScreen from "./screens/Splash";

export default function Root(): * {
  return (
    <Provider store={store}>
      <PersistGate loading={<SplashScreen />} persistor={persistor}>
        <RootScreen />
      </PersistGate>
    </Provider>
  );
}
