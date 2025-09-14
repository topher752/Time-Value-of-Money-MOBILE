import "react-native-gesture-handler";
import FinancialPage from "./pages/financial";
import LoanMortgageCalculator from "./components/Calculators/loan_mortgage-calculator";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "./components/customDrawer";

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