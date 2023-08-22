import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

type InputProps = {
  header: string;
  placeholder?: string;
  setOnChange: () => void;
};

export default function Input(props: InputProps) {
  return (
      <View style={styles.container}>
        <Text>{props.header}</Text>
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
  input: {
    borderWidth: 1,
    marginTop: 5,
    padding: 10,
  },
});
