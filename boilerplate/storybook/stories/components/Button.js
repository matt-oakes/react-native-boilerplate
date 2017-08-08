// @flow

import React from "react";
import { storiesOf } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";

import Button from "~/src/components/Button";
import CenterView from "~/storybook/decorators/CenterView";

storiesOf("Button", module)
  .addDecorator(getStory =>
    <CenterView dark>
      {getStory()}
    </CenterView>
  )
  .add("Default", () =>
    <Button
      onPress={action("clicked")}
      style={{ backgroundColor: "#000000" }}
      text="Black Button"
    />
  )
  .add("Disabled", () =>
    <Button
      onPress={action("clicked")}
      style={{ backgroundColor: "#000000" }}
      disabled
      text="Diabled Button"
    />
  );
