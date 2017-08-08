// @flow

import { Platform } from "react-native";

const base = {
  fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  fontSize: 15
};

export default {
  default: base,
  h1: {
    ...base,
    fontSize: 32
  },
  h2: {
    ...base,
    fontSize: 24
  },
  h3: {
    ...base,
    fontSize: 19
  },
  h4: {
    ...base,
    fontSize: 17
  },
  regular: {
    ...base,
    fontSize: 15
  },
  small: {
    ...base,
    fontSize: 13
  },
  tiny: {
    ...base,
    fontSize: 11
  },
};
