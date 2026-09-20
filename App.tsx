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
          <Drawer.Screen name="Financial" options={{ title: "Financial Calculator" }}>
            {() => <CalculatorScreen calculator={financialCalculator} />}
          </Drawer.Screen>

          <Drawer.Screen name="Loan" options={{ title: "Loan & Mortgage Calculator" }}>
            {() => <CalculatorScreen calculator={loanCalculator} />}
          </Drawer.Screen>

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
