import { StyleSheet, Text, View } from "react-native";
import { Colors, FontSize, FontWeight, Sizing } from "../constants/design";

/** The green chip naming which field the headline number belongs to. */
export default function Pill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.accent,
    paddingHorizontal: Sizing.pillPaddingH,
    paddingVertical: Sizing.pillPaddingV,
    borderRadius: Sizing.pillRadius,
  },
  label: {
    fontSize: FontSize.pill,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
});
