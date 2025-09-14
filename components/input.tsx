import { StyleSheet, Text, TextInput, View } from "react-native";

type InputProps = {
  header: string;
  secondaryHeader?: string;
  placeholder?: string;
  setOnChange: () => void;
  width?: number;
};

export default function Input({
  header,
  placeholder,
  setOnChange,
  secondaryHeader = undefined,
  width = 250,
}: InputProps) {
  return (
    <View style={{ width: width }}>
      <Text>
        <Text style={styles.header}>{header}</Text>
        {secondaryHeader && (
          <Text
            style={[styles.header, { color: "#AAAAAA", fontStyle: "italic" }]}
          >
            {` ${secondaryHeader}`}
          </Text>
        )}
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={setOnChange}
        keyboardType="numeric"
        placeholder={placeholder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontWeight: "bold",
    color: "#212121",
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    marginTop: 5,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#FFF",
    borderColor: "#599BD9",
    fontSize: 22,
  },
});
