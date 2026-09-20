import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Dimensions,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Colors, FontSize, FontWeight, Sizing, Spacing } from "../constants/design";
import type { CalculatorDef, FieldDef, FieldId, TargetId } from "../lib/calculators";
import { adjacentField } from "../lib/field-navigation";
import type { UseCalculator } from "../hooks/use-calculator";
import { useKeyboard } from "../hooks/use-keyboard";
import Button from "./button";
import Input from "./input";
import KeyboardToolbar, { KEYBOARD_TOOLBAR_HEIGHT } from "./keyboard-toolbar";
import Pill from "./pill";

/** Breathing room left below a revealed field. */
const REVEAL_MARGIN = 12;

/** Either a single field, or the years+months pair sharing one button. */
type Row =
  | { kind: "single"; field: FieldDef }
  | { kind: "term"; years: FieldDef; months: FieldDef };

/** Collapse the flat field list into renderable rows. */
function toRows(fields: FieldDef[]): Row[] {
  const rows: Row[] = [];
  const termFields = fields.filter((f) => f.group === "term");

  for (const field of fields) {
    if (field.group === "term") {
      // Emit the pair once, at the first term field's position.
      if (field.id !== termFields[0]?.id) continue;
      const years = termFields.find((f) => f.id === "years");
      const months = termFields.find((f) => f.id === "months");
      if (years && months) rows.push({ kind: "term", years, months });
      continue;
    }
    rows.push({ kind: "single", field });
  }

  return rows;
}

function Label({ field }: { field: FieldDef }) {
  return (
    <Text style={styles.label}>
      {field.label}
      {field.secondaryLabel !== undefined && (
        <Text style={styles.secondaryLabel}>{` ${field.secondaryLabel}`}</Text>
      )}
    </Text>
  );
}

type CalculatorProps = {
  calculator: CalculatorDef;
  controller: UseCalculator;
  onViewAmortization: () => void;
};

export default function Calculator({
  calculator,
  controller,
  onViewAmortization,
}: CalculatorProps) {
  const { state, setField, compute, reset, computedValue, computedLabel } =
    controller;

  const rows = useMemo(() => toRows(calculator.fields), [calculator.fields]);
  const hasResult = computedValue !== "";

  /*
   * Keyboard navigation. Fields are declared in visual order, so that order
   * doubles as the tab order.
   *
   * Which field has focus is a ref rather than state: nothing on screen
   * depends on it, so there is no reason to re-render when it changes.
   */
  const inputRefs = useRef(new Map<FieldId, TextInput | null>());
  const focusedField = useRef<FieldId | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const scrollOffset = useRef(0);
  const keyboardHeight = useRef(0);

  const keyboard = useKeyboard();

  // Written in an effect, not during render.
  useEffect(() => {
    keyboardHeight.current = keyboard.height;
  }, [keyboard.height]);

  const fieldOrder = useMemo(
    () => calculator.fields.map((f) => f.id),
    [calculator.fields],
  );

  /*
   * Bring a field into view above the keyboard.
   *
   * iOS scrolls a focused input clear of the keyboard on its own, but knows
   * nothing about the toolbar sitting on top of it, so the field lands
   * underneath and only its label stays visible. Scrolling is done here
   * instead, measured against the keyboard height plus the toolbar.
   */
  const revealField = useCallback((id: FieldId | null) => {
    const node = id === null ? null : inputRefs.current.get(id);
    const scroll = scrollRef.current;
    if (!node || !scroll) return;

    node.measureInWindow((_x, y, _width, height) => {
      // Everything below this line is covered by the toolbar and keyboard.
      const coveredFrom =
        Dimensions.get("window").height -
        keyboardHeight.current -
        KEYBOARD_TOOLBAR_HEIGHT;

      const hidden = y + height + REVEAL_MARGIN - coveredFrom;
      if (hidden > 0) {
        scroll.scrollTo({ y: scrollOffset.current + hidden, animated: true });
      }
    });
  }, []);

  const handleInputRef = useCallback((id: string, node: TextInput | null) => {
    inputRefs.current.set(id as FieldId, node);
  }, []);

  const handleFieldFocus = useCallback(
    (id: string) => {
      focusedField.current = id as FieldId;
      // Let layout settle before measuring.
      setTimeout(() => revealField(id as FieldId), 50);
    },
    [revealField],
  );

  // Re-reveal when the keyboard appears or changes height.
  useEffect(() => {
    if (!keyboard.visible) return;
    const timer = setTimeout(() => revealField(focusedField.current), 50);
    return () => clearTimeout(timer);
  }, [keyboard.visible, keyboard.height, revealField]);

  const moveFocus = useCallback((delta: number) => {
    const next = adjacentField(fieldOrder, focusedField.current, delta);
    if (next === null) return;
    inputRefs.current.get(next)?.focus();
  }, [fieldOrder]);

  const goPrevious = useCallback(() => moveFocus(-1), [moveFocus]);
  const goNext = useCallback(() => moveFocus(1), [moveFocus]);

  const inputWidth = (field: FieldDef) => {
    if (field.width === "narrow") return styles.inputNarrow;
    if (field.width === "medium") return styles.inputMedium;
    return styles.inputFull;
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            keyboard.visible && {
              // Room to scroll the last field clear of keyboard and toolbar.
              paddingBottom:
                keyboard.height + KEYBOARD_TOOLBAR_HEIGHT + Spacing.screen,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          onScroll={(event) => {
            scrollOffset.current = event.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
        >
          {/* Status line: also the validation channel, as the original's #notes was. */}
          <Text style={styles.note}>{state.note}</Text>

          <View style={styles.computedHeaderRow}>
            <Text style={styles.computedHeader}>Computed Value:</Text>
            {hasResult && <Pill label={computedLabel} />}
          </View>

          <View style={styles.computedRow}>
            <Text
              style={[styles.computed, !hasResult && styles.computedEmpty]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {hasResult ? computedValue : "0"}
            </Text>
            <Button label="Reset" variant="action" onPress={reset} />
          </View>

          {rows.map((row) =>
            row.kind === "term" ? (
              <View key="term" style={styles.row}>
                <Label field={row.years} />
                <View style={styles.inputRow}>
                  <Input
                    value={state.raw.years ?? ""}
                    onChangeText={(value) => setField("years", value)}
                    invalid={state.invalidField === "years"}
                    style={styles.termInput}
                    accessibilityLabel="Years"
                    fieldId="years"
                    onInputRef={handleInputRef}
                    onFieldFocus={handleFieldFocus}
                  />
                  <Text style={styles.termSeparator}>-</Text>
                  <Input
                    value={state.raw.months ?? ""}
                    onChangeText={(value) => setField("months", value)}
                    invalid={state.invalidField === "months"}
                    style={styles.termInput}
                    accessibilityLabel="Months"
                    fieldId="months"
                    onInputRef={handleInputRef}
                    onFieldFocus={handleFieldFocus}
                  />
                  <Button
                    label="Compute"
                    onPress={() => compute("term")}
                    accessibilityLabel="Compute term"
                  />
                </View>
              </View>
            ) : (
              <View
                key={row.field.id}
                style={[styles.row, row.field.indent === true && styles.indented]}
              >
                <Label field={row.field} />
                <View style={styles.inputRow}>
                  <Input
                    value={state.raw[row.field.id] ?? ""}
                    onChangeText={(value) => setField(row.field.id, value)}
                    invalid={state.invalidField === row.field.id}
                    style={inputWidth(row.field)}
                    accessibilityLabel={row.field.label}
                    fieldId={row.field.id}
                    onInputRef={handleInputRef}
                    onFieldFocus={handleFieldFocus}
                  />
                  {row.field.target !== null && (
                    <Button
                      label="Compute"
                      onPress={() => compute(row.field.target as TargetId)}
                      accessibilityLabel={`Compute ${row.field.label}`}
                    />
                  )}
                </View>
              </View>
            ),
          )}

          <Button
            label="View Amortization"
            variant="action"
            onPress={onViewAmortization}
            style={styles.amortButton}
          />
        </ScrollView>
      </TouchableWithoutFeedback>

      <KeyboardToolbar
        visible={keyboard.visible}
        keyboardHeight={keyboard.height}
        onPrevious={goPrevious}
        onNext={goNext}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.screen,
    paddingBottom: Spacing.screen * 2,
  },
  note: {
    fontSize: FontSize.body,
    color: Colors.text,
    marginBottom: Spacing.rowStack,
  },
  computedHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  computedHeader: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  computedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.rowGap,
    marginBottom: Spacing.rowStack,
  },
  computed: {
    flexShrink: 1,
    fontSize: FontSize.display,
    fontWeight: FontWeight.bold,
    color: Colors.computed,
  },
  computedEmpty: {
    color: Colors.textMuted,
    fontStyle: "italic",
  },
  row: {
    marginBottom: Spacing.rowStack,
  },
  indented: {
    marginLeft: Spacing.indent,
  },
  label: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.labelGap,
  },
  secondaryLabel: {
    color: Colors.textHint,
    fontStyle: "italic",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.rowGap,
  },
  inputFull: {
    flex: 1,
  },
  inputNarrow: {
    width: Sizing.narrowInputWidth,
  },
  inputMedium: {
    width: Sizing.mediumInputWidth,
  },
  termInput: {
    flex: 1,
  },
  termSeparator: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginHorizontal: -4,
  },
  amortButton: {
    alignSelf: "flex-start",
  },
});
