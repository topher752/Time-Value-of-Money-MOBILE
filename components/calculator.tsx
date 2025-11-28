import React from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Button from "./button";
import Input from "./input";
import { ICalculator, ICalculatorRow } from "./types";

export default function Calculator({
  rows,
  computedValue,
  computedLabel,
  resetFunction,
  viewAmortizationFunction,
  viewAmortization = false,
}: ICalculator) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.column}>
        <View style={styles.row}>
          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={styles.headerText}>Computed Value:</Text>
              {computedValue !== "" && (
                <View style={styles.pill}><Text>{computedLabel}</Text></View>
              )}
            </View>
            <Text
              style={computedValue !== "" ? styles.computed : styles.uncomputed}
            >
              {computedValue !== "" ? computedValue : 0}
            </Text>
          </View>
          <Button label="Reset" onPress={resetFunction} theme="secondary" />
        </View>
        {rows.map((rowItem: ICalculatorRow) => (
          <View style={styles.row} key={rowItem.header}>
            <Input
              header={rowItem.header}
              setOnChange={rowItem.setInputChange}
              width={250}
            />
            <View style={{ marginTop: 15 }}>
              <Button
                label="Compute"
                theme="primary"
                onPress={rowItem.calculateFunction}
              />
            </View>
          </View>
        ))}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 25,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  headerText: {
    fontWeight: "bold",
    color: "#212121",
    fontSize: 18,
  },
  uncomputed: {
    fontSize: 40,
    color: "#212121",
    fontWeight: "bold",
    fontStyle: "italic",
  },
  computed: {
    fontSize: 40,
    color: "#874BFF",
    fontWeight: "bold",
    fontStyle: "normal",
  },
  pill: {
    padding: 10,
    color: "#9AFF9D",
    fontSize: 14,
    fontWeight: "bold",
    borderRadius: 100,
  },
});
