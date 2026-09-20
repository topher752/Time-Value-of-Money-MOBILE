import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, FontSize, FontWeight, SITE_LABEL, SITE_URL, Sizing } from "../constants/design";

/**
 * The grey bar pinned to the bottom of every screen.
 *
 * The footer consumes the bottom safe-area inset itself rather than letting
 * the screen's SafeAreaView do it. If the screen pads instead, the grey stops
 * short of the device edge and the bar appears to float above a strip of
 * background. Here the background reaches the physical bottom while the text
 * stays clear of the home indicator.
 */
export default function Footer() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.footer,
        { height: Sizing.footerHeight + insets.bottom, paddingBottom: insets.bottom },
      ]}
    >
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`View more information at ${SITE_LABEL}`}
        onPress={() => {
          void Linking.openURL(SITE_URL);
        }}
      >
        <Text style={styles.text}>
          {"View more information at "}
          <Text style={styles.link}>{SITE_LABEL}</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.divider,
  },
  text: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: "center",
  },
  link: {
    color: Colors.link,
    textDecorationLine: "underline",
  },
});
