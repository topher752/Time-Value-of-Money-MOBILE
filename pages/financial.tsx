import { Dimensions, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Calculator from "../components/calculator";
import { ICalculatorRow } from "../components/types";

export default function FinancialPage() {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const financialValues: ICalculatorRow[] = [
    {
      header: "Present Val",
      setInputChange: () => {},
      calculateFunction: () => {},
      rowValue: "0",
      secondHeader: undefined,
      terms: false,
      inflation: false,
    },
    {
      header: "Interest Rate",
      setInputChange: () => {},
      calculateFunction: () => {},
      rowValue: "0",
      secondHeader: undefined,
      terms: false,
      inflation: false,
    },
  ];
  
  return (
    <SafeAreaProvider>
      <View
        style={[styles.container, { width: windowWidth, height: windowHeight }]}
      >
        <Text style={styles.mainText}>
          To compute a value, enter values for all other cells and select{" "}
          <Text style={{ fontStyle: "italic" }}>Compute </Text>
          for the target
        </Text>
        <Calculator
          rows={financialValues}
          computedValue={0}
          computedLabel="test"
          resetFunction={() => {}}
          viewAmortization={false}
          viewAmortizationFunction={() => {}}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderTopColor: "#D9D9D9",
    borderTopWidth: 5,
  },
  mainText: {
    fontSize: 16,
    color: "#212121",
    marginBottom: 15,
  },
});
