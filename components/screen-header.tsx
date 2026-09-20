import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors, FontSize, FontWeight, Sizing } from "../constants/design";

/* Assets exported from Figma, not redrawn. Metro treats .svg as an asset and
 * expo-image renders it, so no SVG library is needed. */
const menuIcon = require("../assets/icons/menu.svg");
const helpIcon = require("../assets/icons/help.svg");

type ScreenHeaderProps = {
  title: string;
  onMenuPress: () => void;
  /** Omitted where there is no help content, e.g. Contact Us. */
  onHelpPress?: () => void;
};

/**
 * Menu at the left, centred title, optional help at the right. The title is
 * absolutely centred, not flex-distributed -- the buttons differ in width, so
 * distributing would shift it off-centre.
 */
export default function ScreenHeader({
  title,
  onMenuPress,
  onHelpPress,
}: ScreenHeaderProps) {
  return (
    <View>
      <View style={styles.bar}>
        <Text
          style={styles.title}
          numberOfLines={1}
          // The longest title only just fits; shrink rather than truncate,
          // since the rendered face may not be the Roboto this was measured in.
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {title}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          onPress={onMenuPress}
          hitSlop={8}
          style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
        >
          <Image source={menuIcon} style={styles.menuIcon} contentFit="contain" />
        </Pressable>

        {onHelpPress !== undefined && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Help"
            onPress={onHelpPress}
            hitSlop={8}
            style={({ pressed }) => [styles.helpButton, pressed && styles.pressed]}
          >
            <Image source={helpIcon} style={styles.helpIcon} contentFit="contain" />
          </Pressable>
        )}
      </View>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: Sizing.headerHeight,
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  title: {
    textAlign: "center",
    fontSize: FontSize.heading,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    // Clears both buttons: menu 15..56, help 385..415 in the 430pt frames.
    marginHorizontal: 56,
  },
  menuButton: {
    position: "absolute",
    left: 15,
  },
  menuIcon: {
    width: Sizing.menuIcon,
    height: Sizing.menuIcon,
  },
  helpButton: {
    position: "absolute",
    right: 15,
  },
  helpIcon: {
    width: Sizing.helpIcon,
    height: Sizing.helpIcon,
  },
  pressed: {
    opacity: 0.6,
  },
  divider: {
    height: Sizing.dividerHeight,
    backgroundColor: Colors.divider,
  },
});
