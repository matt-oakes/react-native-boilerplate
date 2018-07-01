// @flow
// storybook-no-mock

import React from "react";
import {
  ColorPropType,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import type { ImageSource } from "react-native/Libraries/Image/ImageSource";

export type Props = {
  text?: string,
  icon?: ImageSource | string | null,
  iconSize?: ?number,
  disableIconTint?: boolean,
  disabled?: boolean,
  onPress?: ?Function,
  textColor?: ColorPropType,
  textSize?: ?number,
  defaultStyle?: any,
  style?: any,
  containerStyle?: any,
  testID?: string
};

export const createButton = (defaultProps?: Object) => {
  return function Button(props: Props): * {
    const combinedProps = {
      ...defaultProps,
      ...props
    };
    const {
      text,
      icon,
      disableIconTint,
      disabled,
      onPress,
      defaultStyle,
      style,
      containerStyle,
      testID
    } = combinedProps;
    let { iconSize, textColor, textSize } = combinedProps;

    // Default the text color to white
    if (!textColor) {
      textColor = "white";
    }
    // Default the text size
    if (!textSize) {
      textSize = 15;
    }
    // Default the icon size
    if (!iconSize) {
      iconSize = 15;
    }

    // Create the image icon if we have one
    let imageComponent;
    if (icon) {
      imageComponent = (
        <Image
          style={[
            styles.image,
            !disableIconTint && {
              tintColor: textColor,
              width: iconSize,
              height: iconSize
            }
          ]}
          source={icon}
          resizeMode="contain"
        />
      );
    }

    // Return the button elements
    return (
      <TouchableHighlight
        style={[styles.container, containerStyle]}
        activeOpacity={0.75}
        onPress={onPress}
        disabled={disabled}
        testID={testID}
      >
        <View
          style={[
            styles.button,
            defaultStyle,
            style,
            disabled && styles.disabledButton
          ]}
        >
          {imageComponent}
          <Text
            style={[styles.text, { color: textColor, fontSize: textSize }]}
            numberOfLines={1}
          >
            {text}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };
};

export default createButton();

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 25
  },
  button: {
    flex: 1,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    borderRadius: 25,
    paddingHorizontal: 16
  },
  disabledButton: {
    backgroundColor: "#CCC"
  },
  text: {
    textAlign: "center",
    fontWeight: "700"
  },
  image: {
    marginRight: 8
  }
});
