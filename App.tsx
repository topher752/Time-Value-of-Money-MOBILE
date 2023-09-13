import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import FinancialCalculator from "./components/Calculators/financial-calculator";
import LoanMortgageCalculator from "./components/Calculators/loan_mortgage-calculator";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from "./pages/home";

export default function App() {

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Time Value of Money" component={HomePage} />
        <Stack.Screen name="Financial Calculator" component={FinancialCalculator} />
        <Stack.Screen name="Loan Calculator" component={LoanMortgageCalculator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
