import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CustomDrawer from "./components/customDrawer";
import { Colors, FontSize, FontWeight } from "./constants/design";
import { financialCalculator, loanCalculator } from "./lib/calculators";
import CalculatorScreen from "./pages/calculator-screen";
import ContactPage from "./pages/contact";

const Drawer = createDrawerNavigator();

/*
 * Defined at module scope, not inline in the navigator.
 *
 * Passing children-as-a-function (or an inline component) to Drawer.Screen
 * creates a new component identity on every render of App, so React
 * Navigation remounts the screen -- discarding entered values and tearing
 * down the keyboard accessory view attached to its inputs.
 */
function FinancialScreen() {
  return <CalculatorScreen calculator={financialCalculator} />;
}

function LoanScreen() {
  return <CalculatorScreen calculator={loanCalculator} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawer {...props} />}
          initialRouteName="Financial"
          screenOptions={{
            // Each screen draws its own header, so the navigator's is off.
            headerShown: false,
            drawerActiveTintColor: Colors.text,
            drawerActiveBackgroundColor: Colors.accent,
            drawerInactiveTintColor: Colors.text,
            drawerLabelStyle: {
              fontSize: FontSize.body,
              fontWeight: FontWeight.bold,
            },
          }}
        >
          <Drawer.Screen
            name="Financial"
            component={FinancialScreen}
            options={{ title: "Financial Calculator" }}
          />

          <Drawer.Screen
            name="Loan"
            component={LoanScreen}
            options={{ title: "Loan & Mortgage Calculator" }}
          />

          <Drawer.Screen
            name="Contact"
            component={ContactPage}
            options={{ title: "Contact Us" }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
