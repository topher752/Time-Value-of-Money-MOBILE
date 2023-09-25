import { View, Text } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";

export default function CustomDrawer(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
