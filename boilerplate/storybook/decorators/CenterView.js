// @flow

import * as React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  dark?: boolean,
  children?: React.Node
};

export default function CenterView(props: Props) {
  return (
    <View style={[styles.main, props.dark && styles.mainDark]}>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 14,
    paddingTop: 36,
    paddingBottom: 16
  },
  mainDark: {
    backgroundColor: "black"
  }
});
