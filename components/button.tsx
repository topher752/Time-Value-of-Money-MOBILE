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

export default function Button(props: ButtonProps) {
  return (
    <Pressable style={[props.theme === "p" ? styles.primary : styles.secondary]} onPress={props.onPress}>
      <Text
        style={[
          styles.text,
          { color: props.theme === "p" ? "#ffeb7a" : "#000" },
        ]}
      >
        {props.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: "#39592d",
    borderColor: "#39592d",
    borderWidth: 1,
    borderRadius: 100,
    alignSelf: "center",
  },
  secondary: {
    backgroundColor: "#b9cef0",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 100,
    alignSelf: "center",
  },
  text: {
    padding: 10,
  },
});