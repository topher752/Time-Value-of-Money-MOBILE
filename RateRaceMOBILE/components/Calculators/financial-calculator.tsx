import { StyleSheet, Text, TextInput, View, Keyboard, TouchableWithoutFeedback } from "react-native";
import Input from "../input";
import React from "react";
import Button from "../button";

export default function FinancialCalculator() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.testingContainer}>
        <View style={styles.outer}>
          <Text style={styles.text}>
            To Compute a value, enter values for all other cells and select
            compute button for the target
          </Text>
          <View style={styles.row}>
            <Input header="Testing" setOnChange={() => {}} />
            <Button label="Compute" theme="s" />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  testingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  outer: {
    backgroundColor: "#0096FA",
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 5,
    padding: 20,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
  },
  row: {},
});
