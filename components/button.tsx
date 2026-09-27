import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";
import { Colors, FontSize, FontWeight, Sizing } from "../constants/design";

/** Green per-row Compute, or purple Reset / View Amortization. */
export type ButtonVariant = "compute" | "action";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Used when the label alone is ambiguous, e.g. "Compute". */
  accessibilityLabel?: string;
};

export default function Button({
  label,
  onPress,
  variant = "compute",
  disabled = false,
  style,
  accessibilityLabel,
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === "compute" ? styles.compute : styles.action,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Sizing.buttonPaddingH,
    paddingVertical: Sizing.buttonPaddingV,
    borderRadius: Sizing.buttonRadius,
  },
  compute: {
    backgroundColor: Colors.accent,
  },
  action: {
    backgroundColor: Colors.action,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontSize: FontSize.button,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
});
