import React from "react";
import {
    Keyboard,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Button from "../button";
import Input from "../input";
  
  export default function LoanMortgageCalculator() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.center}>
          <Text style={styles.title}>Loan/Mortgage Calculator</Text>
          <View style={styles.outer}>
            <Text style={styles.text}>
              To Compute a value, enter values for all other cells and select
              compute button for the target
            </Text>
            {/* Loan Amount */}
            <View style={styles.row}>
              <Input header="Loan Amt" setOnChange={() => {}} width={200} />
              <View style={{ marginTop: 15 }}>
                <Button label="Compute" theme="s" onPress={() => console.log("Pressed")}/>
              </View>
            </View>
            {/* Rate Value */}
            <View style={styles.row}>
              <Input header="Rate" setOnChange={() => {}} width={200} />
              <View style={{ marginTop: 15 }}>
                <Button label="Compute" theme="s" onPress={() => console.log("Pressed")}/>
              </View>
            </View>
            {/* Term Values */}
            <View>
              <Text
                style={{
                  marginTop: 16,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Term:
              </Text>
              <View style={[styles.row, { marginTop: 2 }]}>
                <View
                  style={{ gap: 3, flexDirection: "row", alignItems: "center" }}
                >
                  <Input header="Years" setOnChange={() => {}} width={80} />
                  <Text
                    style={{
                      marginTop: 16,
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    -
                  </Text>
                  <Input header="Months" setOnChange={() => {}} width={80} />
                </View>
                <View style={{ marginTop: 15 }}>
                  <Button label="Compute" theme="s" onPress={() => console.log("Pressed")}/>
                </View>
              </View>
            </View>
            {/* Payment */}
            <View style={styles.row}>
              <Input header="Payment" setOnChange={() => {}} width={200} />
              <View style={{ marginTop: 15 }}>
                <Button label="Compute" theme="s" onPress={() => console.log("Pressed")}/>
              </View>
            </View>
            {/* Bottom Buttons */}
            <View style={styles.row}>
              <Button label="Reset" theme="p" onPress={() => console.log("Pressed")}/>
              <Button label="Amort" theme="p" onPress={() => console.log("Pressed")}/>
              <Button label="Mode" theme="p" onPress={() => console.log("Pressed")}/>
              <Button label="Help" theme="p" onPress={() => console.log("Pressed")}/>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
  
  const styles = StyleSheet.create({
    center: {
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
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 16,
    },
    title: {
      fontFamily: "Georgia",
      fontSize: 24,
      fontWeight: "bold",
      paddingBottom: 30,
    },
  });
  