// @flow

import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Theme from "~/src/theme";

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Splash!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: Theme.Colors.appBackground
  },
  text: {
    ...Theme.Fonts.default
  }
});

export default SplashScreen;
