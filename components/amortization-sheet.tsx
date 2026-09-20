import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, FontSize, FontWeight, Sizing, Spacing } from "../constants/design";
import { formatNumber } from "../lib/format";
import type { AmortizationRow, AmortizationSchedule } from "../lib/tvm";

type AmortizationSheetProps = {
  visible: boolean;
  schedule: AmortizationSchedule | null;
  onClose: () => void;
};

/**
 * Column widths, so the header and rows stay aligned while scrolling.
 * Sized to fit a 430pt screen at rest; narrower devices scroll.
 */
const COLUMNS = [
  { key: "month", label: "Month", width: 64 },
  { key: "payment", label: "Payment", width: 82 },
  { key: "interest", label: "Interest", width: 80 },
  { key: "principal", label: "Principal", width: 84 },
  { key: "balance", label: "Balance", width: 100 },
] as const;

const TABLE_WIDTH = COLUMNS.reduce((total, c) => total + c.width, 0);

function cellsFor(row: AmortizationRow): string[] {
  return [
    String(row.month),
    formatNumber(row.payment),
    formatNumber(row.monthlyInterest),
    formatNumber(row.monthlyPrincipal),
    formatNumber(row.totalPrincipal),
  ];
}

/**
 * The amortization schedule.
 *
 * The numbers are real -- buildAmortizationSchedule reproduces the original
 * calculator's own reporting output, row for row. What is unsettled is where
 * this screen's data should come from in production, so it is labelled as
 * demo output rather than presented as final.
 *
 * Rows are virtualised: a term can run to 1200 months, which is too many to
 * mount at once. The table scrolls horizontally because five money columns do
 * not fit the width at this type size.
 */
export default function AmortizationSheet({
  visible,
  schedule,
  onClose,
}: AmortizationSheetProps) {
  const rows = schedule?.rows ?? [];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <Text style={styles.title}>Amortization</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close amortization schedule"
            onPress={onClose}
            hitSlop={8}
            style={({ pressed }) => [styles.close, pressed && styles.pressed]}
          >
            <Text style={styles.closeLabel}>Close</Text>
          </Pressable>
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Demo data</Text>
          <Text style={styles.bannerBody}>
            This schedule is generated in the app from the values you entered.
            How it should be produced in the finished app is still being
            worked out, so treat these figures as a preview.
          </Text>
        </View>

        {rows.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Enter a term and the other values, then reopen this to see the
              schedule.
            </Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ width: TABLE_WIDTH }}>
              <View style={[styles.row, styles.headerRow]}>
                {COLUMNS.map((column) => (
                  <Text
                    key={column.key}
                    style={[styles.cell, styles.headerCell, { width: column.width }]}
                    numberOfLines={1}
                  >
                    {column.label}
                  </Text>
                ))}
              </View>

              <FlatList
                data={rows}
                keyExtractor={(row) => String(row.month)}
                initialNumToRender={20}
                windowSize={11}
                renderItem={({ item, index }) => (
                  <View style={[styles.row, index % 2 === 1 && styles.rowAlt]}>
                    {cellsFor(item).map((value, column) => (
                      <Text
                        key={COLUMNS[column].key}
                        style={[styles.cell, { width: COLUMNS[column].width }]}
                        numberOfLines={1}
                      >
                        {value}
                      </Text>
                    ))}
                  </View>
                )}
              />
            </View>
          </ScrollView>
        )}

        {schedule !== null && rows.length > 0 && (
          <View style={styles.totals}>
            <Text style={styles.totalsCount}>{`${rows.length} months`}</Text>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsItem}>
                <Text style={styles.totalsLabel}>Total paid </Text>
                {formatNumber(schedule.totalPayments)}
              </Text>
              <Text style={styles.totalsItem}>
                <Text style={styles.totalsLabel}>Total interest </Text>
                {formatNumber(schedule.totalInterest)}
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    height: Sizing.headerHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.screen,
    borderBottomWidth: Sizing.dividerHeight,
    borderBottomColor: Colors.divider,
  },
  title: {
    fontSize: FontSize.heading,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  close: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  closeLabel: {
    fontSize: FontSize.button,
    fontWeight: FontWeight.bold,
    color: Colors.link,
  },
  pressed: {
    opacity: 0.5,
  },
  banner: {
    margin: Spacing.screen,
    padding: 12,
    borderRadius: Sizing.inputRadius,
    backgroundColor: Colors.accent,
  },
  bannerTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  bannerBody: {
    fontSize: 14,
    color: Colors.text,
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: 8,
  },
  rowAlt: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  headerRow: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    paddingBottom: 6,
  },
  cell: {
    fontSize: 13,
    color: Colors.text,
    paddingVertical: 6,
    textAlign: "right",
    paddingRight: 8,
  },
  headerCell: {
    fontWeight: FontWeight.bold,
  },
  totals: {
    padding: Spacing.screen,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  totalsCount: {
    fontSize: 13,
    color: Colors.textHint,
    marginBottom: 4,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  totalsItem: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    flexShrink: 1,
  },
  totalsLabel: {
    fontWeight: FontWeight.regular,
    color: Colors.textHint,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.screen * 2,
  },
  emptyText: {
    fontSize: FontSize.body,
    color: Colors.textHint,
    textAlign: "center",
  },
});
