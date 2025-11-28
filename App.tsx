import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import FinancialCalculator from "./components/Calculators/financial-calculator";
import LoanMortgageCalculator from "./components/Calculators/loan_mortgage-calculator";
import CustomDrawer from "./components/customDrawer";
import HomePage from "./pages/home";

export default function App() {
  const Drawer = createDrawerNavigator();

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />}
        initialRouteName="Home"
      >
        <Drawer.Screen name="Home" component={HomePage} />
        <Drawer.Screen name="Financial" component={FinancialCalculator} />
        <Drawer.Screen name="Loan" component={LoanMortgageCalculator} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });