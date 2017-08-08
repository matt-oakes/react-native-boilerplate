// @flow
import "..";

jest.mock("react-native", () => ({
  NativeModules: {
    RNI18n: {
      languages: ["en"]
    }
  }
}));

import I18n from "react-native-i18n";

// This test file is mostly just to check that the i18n imports without crashing
test("Should have translations", () => {});
