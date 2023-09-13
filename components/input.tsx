import { StyleSheet, Text, TextInput, View } from "react-native";

type InputProps = {
  header: string;
  placeholder?: string;
  setOnChange: () => void;
  width?: number;
};

export default function Input(props: InputProps) {
  return (
    <View style={[styles.container, { width: props.width }]}>
      <Text style={styles.header}>{props.header}</Text>
      <TextInput
        style={styles.input}
        onChangeText={props.setOnChange}
        keyboardType="numeric"
        placeholder={props.placeholder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},

  header: {
    fontWeight: "bold"
  },
  input: {
    borderWidth: 1,
    marginTop: 5,
    padding: 10,
    backgroundColor: "white"
  },
});
