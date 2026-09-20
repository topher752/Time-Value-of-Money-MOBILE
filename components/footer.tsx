import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors, FontSize, FontWeight, SITE_LABEL, SITE_URL, Sizing } from "../constants/design";

/** The grey bar pinned to the bottom of every screen. */
export default function Footer() {
  return (
    <View style={styles.footer}>
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
    height: Sizing.footerHeight,
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
