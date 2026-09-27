import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AmortizationSheet from "../components/amortization-sheet";
import Calculator from "../components/calculator";
import Footer from "../components/footer";
import HelpSheet from "../components/help-sheet";
import ScreenHeader from "../components/screen-header";
import { Colors } from "../constants/design";
import { useCalculator } from "../hooks/use-calculator";
import type { CalculatorDef } from "../lib/calculators";
import type { AmortizationSchedule } from "../lib/tvm";

/**
 * Header, rows-driven calculator, footer. Financial and Loan are both this
 * component with a different CalculatorDef -- the frames are identical.
 */
export default function CalculatorScreen({
  calculator,
}: {
  calculator: CalculatorDef;
}) {
  const navigation = useNavigation<DrawerNavigationProp<Record<string, undefined>>>();
  const controller = useCalculator(calculator);
  const [helpVisible, setHelpVisible] = useState(false);
  const [schedule, setSchedule] = useState<AmortizationSchedule | null>(null);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScreenHeader
        title={calculator.title}
        onMenuPress={() => navigation.openDrawer()}
        onHelpPress={() => setHelpVisible(true)}
      />

      <Calculator
        calculator={calculator}
        controller={controller}
        /*
         * Built on open rather than on every keystroke: a 1200-month term is
         * a lot of rows to recompute for a button that may never be pressed.
         */
        onViewAmortization={() => setSchedule(controller.buildSchedule())}
      />

      <Footer />

      <HelpSheet
        visible={helpVisible}
        content={calculator.helpContent}
        onClose={() => setHelpVisible(false)}
      />

      <AmortizationSheet
        visible={schedule !== null}
        schedule={schedule}
        onClose={() => setSchedule(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
