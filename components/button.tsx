import {
  Pressable,
  StyleSheet,
  Text
} from "react-native";

type ButtonProps = {
  label: string;
  theme: string;
  onPress: () => void;
};

export default function Button({
  label,
  onPress,
  theme,
}: ButtonProps) {
  return (
    <Pressable
      style={[theme === "primary" ? styles.primary : styles.secondary]}
      onPress={onPress}
    >
      <Text style={[styles.text]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: "#9AFF9D",
    borderColor: "#9AFF9D",
    borderWidth: 1,
    borderRadius: 100,
    alignSelf: "center",
  },
  secondary: {
    backgroundColor: "#98A6FF",
    borderColor: "#98A6FF",
    borderWidth: 1,
    borderRadius: 100,
    alignSelf: "center",
  },
  text: {
    padding: 10,
    fontSize: 18,
    color: "#212121",
    fontWeight: "bold",
  },
});