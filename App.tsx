import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import LoanMortgageCalculator from "./components/Calculators/loan_mortgage-calculator";
import CustomDrawer from "./components/customDrawer";
import FinancialPage from "./pages/financial";

export default function App() {
  const Drawer = createDrawerNavigator();

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />}
        initialRouteName="Financial"
      >
        <Drawer.Screen name="Financial" component={FinancialPage} />
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