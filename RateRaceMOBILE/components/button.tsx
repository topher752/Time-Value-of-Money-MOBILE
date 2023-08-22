import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

type ButtonProps = {
  label: string;
  theme: string;
};

export default function Button(props: ButtonProps) {
  return (
    <View style={[props.theme === "p" ? styles.primary : styles.secondary]}>
      <Text style={styles.text}>{props.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: "green",
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 100,
    alignSelf: "center",
  },
  secondary: {
    backgroundColor: "blue",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 100,
    alignSelf: "center",
  },
  text: {
    padding: 10,
  },
});
