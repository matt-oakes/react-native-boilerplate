/* eslint-env jest */

import { NativeModules } from "react-native";

// This fixes the current time which is used as a key for the react-navigation action key.
// If you don't do this then the tests are non-detrministic.
// See: https://github.com/react-community/react-navigation/pull/1320#issuecomment-304894065
Date.now = jest.fn(() => 1480000000000);

NativeModules.RNI18n = {
  languages: ["en"]
};
