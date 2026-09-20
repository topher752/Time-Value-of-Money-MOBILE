import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Calculator from "../components/calculator";
import Footer from "../components/footer";
import HelpSheet from "../components/help-sheet";
import NoticeSheet from "../components/notice-sheet";
import ScreenHeader from "../components/screen-header";
import { Colors } from "../constants/design";
import { useCalculator } from "../hooks/use-calculator";
import type { CalculatorDef } from "../lib/calculators";

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
  const [amortVisible, setAmortVisible] = useState(false);

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <ScreenHeader
        title={calculator.title}
        onMenuPress={() => navigation.openDrawer()}
        onHelpPress={() => setHelpVisible(true)}
      />

      <Calculator
        calculator={calculator}
        controller={controller}
        /* The schedule API is not identified yet, so acknowledge the tap.
         * The data side is done: controller.buildSchedule() has the rows. */
        onViewAmortization={() => setAmortVisible(true)}
      />

      <Footer />

      <HelpSheet
        visible={helpVisible}
        content={calculator.helpContent}
        onClose={() => setHelpVisible(false)}
      />

      <NoticeSheet
        visible={amortVisible}
        title="Amortization"
        message="The amortization schedule is still a work in progress. Check back soon."
        onClose={() => setAmortVisible(false)}
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
