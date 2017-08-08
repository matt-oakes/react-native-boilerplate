// @flow

import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import Theme from "~/src/theme";

export function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome!</Text>
    </View>
  );
}

WelcomeScreen.navigationOptions = {
  title: "Welcome"
};

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

export default WelcomeScreen;
