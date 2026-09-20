import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, FontSize, FontWeight, Sizing, Spacing } from "../constants/design";
import { formatNumber } from "../lib/format";
import type { AmortizationRow, AmortizationSchedule } from "../lib/tvm";

type AmortizationSheetProps = {
  visible: boolean;
  schedule: AmortizationSchedule | null;
  onClose: () => void;
};

/** Month column width, from the frame. */
const MONTH_WIDTH = 70;

/**
 * The amortization schedule, per the FinancialAMORT frame: a white card on a
 * scrim, listing month and running principal, with each row expanding to show
 * that month's interest, principal and payment.
 *
 * The card is offset by the top safe-area inset. The frame places it 15pt
 * from the top of a 430x932 canvas, which on a real device is underneath the
 * status bar and the notch.
 *
 * Figures are real -- buildAmortizationSchedule reproduces the original
 * calculator's own reporting output row for row -- but where the schedule
 * should come from in the finished app is unsettled, so the card says so.
 */
export default function AmortizationSheet({
  visible,
  schedule,
  onClose,
}: AmortizationSheetProps) {
  const insets = useSafeAreaInsets();
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);

  const toggle = useCallback((month: number) => {
    setExpandedMonth((current) => (current === month ? null : month));
  }, []);

  const rows = schedule?.rows ?? [];

  /*
   * Sign normalisation for display.
   *
   * The financial calculator negates present value on the way into the
   * engine, matching the original print_amort(), so a deposit-funded
   * schedule comes back with a negative balance and negative interest. That
   * is an artefact of how the engine is called, not a fact about the user's
   * money -- they entered 100,000, and the frame shows "100,000 Principal".
   * Flipping here keeps the display in the user's terms. The loan calculator
   * already passes a positive amount, so it is unaffected.
   */
  const sign = (schedule?.initialPrincipal ?? 0) < 0 ? -1 : 1;
  const show = (value: number) => formatNumber(value * sign);

  const renderRow = ({ item }: { item: AmortizationRow }) => {
    const isOpen = expandedMonth === item.month;

    return (
      <View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Month ${item.month}, principal ${show(item.totalPrincipal)}`}
          accessibilityState={{ expanded: isOpen }}
          onPress={() => toggle(item.month)}
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
        >
          <Text style={styles.month}>{item.month}</Text>
          <Text style={styles.principal} numberOfLines={1}>
            {show(item.totalPrincipal)}
          </Text>
          <MaterialIcons
            name={isOpen ? "arrow-drop-up" : "arrow-drop-down"}
            size={24}
            color={Colors.text}
          />
        </Pressable>

        {isOpen && (
          <View style={styles.detail}>
            <Text style={styles.detailLine}>{`Mo_Int: ${show(item.monthlyInterest)}`}</Text>
            <Text style={styles.detailLine}>{`Mo_Prin: ${show(item.monthlyPrincipal)}`}</Text>
            <Text style={styles.detailLine}>{`Payment: ${show(item.payment)}`}</Text>
          </View>
        )}

        {isOpen && <View style={styles.rule} />}
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={styles.scrim}
        onPress={onClose}
        accessibilityLabel="Close amortization report"
      >
        {/* Swallow taps so the card itself does not dismiss. */}
        <Pressable
          style={[
            styles.card,
            { marginTop: insets.top + 15, marginBottom: insets.bottom + 15 },
          ]}
          onPress={() => {}}
        >
          <Text style={styles.title}>Amortization Report</Text>

          {schedule !== null && (
            <View style={styles.summary}>
              <Text style={styles.summaryItem}>{`${schedule.term} Month Term`}</Text>
              <Text style={styles.summaryItem}>{`${formatNumber(schedule.yearlyRate)}% Rate`}</Text>
              <Text style={styles.summaryItem}>
                {`${show(schedule.initialPrincipal)} Principal`}
              </Text>
            </View>
          )}

          <Text style={styles.demoNote}>
            Demo data — how this is produced in the finished app is still being
            worked out.
          </Text>

          <View style={styles.rule} />

          <View style={styles.headerRow}>
            <Text style={[styles.headerCell, styles.monthColumn]}>Month</Text>
            <Text style={styles.headerCell}>Principal</Text>
          </View>

          {rows.length === 0 ? (
            <Text style={styles.empty}>
              Enter a term and the other values, then reopen this to see the
              schedule.
            </Text>
          ) : (
            <FlatList
              data={rows}
              keyExtractor={(row) => String(row.month)}
              renderItem={renderRow}
              initialNumToRender={20}
              windowSize={11}
              showsVerticalScrollIndicator={false}
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: Colors.scrim,
  },
  card: {
    flexShrink: 1,
    marginHorizontal: 10,
    padding: Sizing.helpCardPadding,
    borderRadius: Sizing.helpCardRadius,
    backgroundColor: Colors.surface,
  },
  title: {
    fontSize: FontSize.heading,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 8,
  },
  summaryItem: {
    fontSize: FontSize.body,
    fontWeight: "500",
    color: Colors.computed,
    flexShrink: 1,
  },
  demoNote: {
    fontSize: 13,
    color: Colors.textHint,
    marginTop: 10,
  },
  rule: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 25,
    marginBottom: 4,
  },
  headerCell: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    color: Colors.tableHeader,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  rowPressed: {
    opacity: 0.6,
  },
  monthColumn: {
    width: MONTH_WIDTH,
  },
  month: {
    width: MONTH_WIDTH,
    fontSize: FontSize.body,
    fontWeight: "500",
    color: Colors.text,
  },
  principal: {
    flex: 1,
    fontSize: FontSize.body,
    fontWeight: "500",
    color: Colors.text,
  },
  detail: {
    gap: 5,
    paddingBottom: 4,
  },
  detailLine: {
    fontSize: FontSize.body,
    fontWeight: "500",
    color: Colors.computed,
  },
  empty: {
    fontSize: FontSize.body,
    color: Colors.textHint,
    paddingVertical: Spacing.rowStack,
    textAlign: "center",
  },
});
