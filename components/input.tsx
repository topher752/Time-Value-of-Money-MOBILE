import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Colors, FontSize, FontWeight, Sizing, Spacing } from "../constants/design";

type InputProps = {
  label?: string;
  /** Dimmed italic hint, e.g. "(Years and Months)". */
  secondaryLabel?: string;
  value: string;
  onChangeText: (value: string) => void;
  /** Turns the border red. */
  invalid?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

/**
 * A labelled numeric field. The design distinguishes empty from filled by
 * style: an empty field is an italic half-opacity "0", a real value is solid.
 */
export default function Input({
  label,
  secondaryLabel,
  value,
  onChangeText,
  invalid = false,
  style,
  accessibilityLabel,
}: InputProps) {
  const isEmpty = value === "";

  return (
    <View style={style}>
      {label !== undefined && (
        <Text style={styles.label}>
          {label}
          {secondaryLabel !== undefined && (
            <Text style={styles.secondaryLabel}>{` ${secondaryLabel}`}</Text>
          )}
        </Text>
      )}
      <TextInput
        accessibilityLabel={accessibilityLabel ?? label}
        style={[
          styles.input,
          isEmpty ? styles.inputEmpty : styles.inputFilled,
          invalid && styles.inputInvalid,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder="0"
        placeholderTextColor={Colors.textMuted}
        // Payments and values may be negative.
        keyboardType="numbers-and-punctuation"
        inputMode="decimal"
        autoCorrect={false}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  input: {
    height: Sizing.inputHeight,
    paddingHorizontal: Sizing.inputPaddingH,
    borderWidth: Sizing.inputBorderWidth,
    borderColor: Colors.inputBorder,
    borderRadius: Sizing.inputRadius,
    backgroundColor: Colors.surface,
    fontSize: FontSize.input,
    fontWeight: FontWeight.bold,
  },
  inputEmpty: {
    fontStyle: "italic",
    color: Colors.textMuted,
  },
  inputFilled: {
    fontStyle: "normal",
    color: Colors.text,
  },
  inputInvalid: {
    borderColor: "#D93025",
  },
});
