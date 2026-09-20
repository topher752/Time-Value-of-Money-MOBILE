import { Ionicons } from "@expo/vector-icons";
import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors, FontSize, FontWeight } from "../constants/design";

type KeyboardToolbarProps = {
  visible: boolean;
  /** Keyboard height, so the bar sits directly on top of it. */
  keyboardHeight: number;
  onPrevious: () => void;
  onNext: () => void;
};

/**
 * Previous/next/done bar above the keyboard.
 *
 * The fields use a numeric keypad, which has no return key, so without this
 * there is no way to move between them except dismissing and tapping.
 *
 * This is an ordinary absolutely-positioned View rather than iOS's
 * InputAccessoryView. A single InputAccessoryView shared by several inputs
 * via one nativeID attaches to the first input that claims it and does not
 * follow focus to the next one, so the bar disappeared on the first move.
 * Positioning against the measured keyboard height sidesteps the native
 * lookup entirely -- and, unlike InputAccessoryView, works on Android too.
 */
export default function KeyboardToolbar({
  visible,
  keyboardHeight,
  onPrevious,
  onNext,
}: KeyboardToolbarProps) {
  if (!visible) return null;

  return (
    <View style={[styles.bar, { bottom: keyboardHeight }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Previous field"
        onPress={onPrevious}
        hitSlop={8}
        style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}
      >
        <Ionicons name="chevron-up" size={22} color={Colors.text} />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Next field"
        onPress={onNext}
        hitSlop={8}
        style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}
      >
        <Ionicons name="chevron-down" size={22} color={Colors.text} />
      </Pressable>

      <View style={styles.spacer} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss keyboard"
        onPress={() => Keyboard.dismiss()}
        hitSlop={8}
        style={({ pressed }) => [styles.done, pressed && styles.pressed]}
      >
        <Text style={styles.doneLabel}>Done</Text>
      </Pressable>
    </View>
  );
}

/** Height of the bar, so content can be padded clear of it. */
export const KEYBOARD_TOOLBAR_HEIGHT = 44;

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    height: KEYBOARD_TOOLBAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: Colors.divider,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0, 0, 0, 0.2)",
  },
  arrow: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  spacer: {
    flex: 1,
  },
  done: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  doneLabel: {
    fontSize: FontSize.button,
    fontWeight: FontWeight.bold,
    color: Colors.link,
  },
  pressed: {
    opacity: 0.5,
  },
});
