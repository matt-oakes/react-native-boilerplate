// @flow

import url from "url";
import { NativeModules } from "react-native";

// The fallback for when a URL cannot be found
const FALLBACK = "localhost";

// Figures out the correct packager URL
export default (() => {
  const { SourceCode } = NativeModules;
  if (!SourceCode || !SourceCode.scriptURL) {
    return FALLBACK;
  }

  const scriptUrl = url.parse(SourceCode.scriptURL);
  if (!scriptUrl) {
    return FALLBACK;
  }

  return scriptUrl.hostname || FALLBACK;
})();
