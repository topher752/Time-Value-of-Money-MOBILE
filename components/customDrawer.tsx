import {
  DrawerContentScrollView,
  DrawerItemList,
  type DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { StyleSheet, Text, View } from "react-native";
import { Colors, FontSize, FontWeight, Spacing } from "../constants/design";

export default function CustomDrawer(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props} style={styles.drawer}>
      <View style={styles.header}>
        <Text style={styles.title}>Escape the Rate Race!</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.rowStack,
  },
  title: {
    fontSize: FontSize.heading,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
});
