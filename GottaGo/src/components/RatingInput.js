import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";

const RatingInput = ({ title, placeholder, handleInput }) => {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={placeholder}
          style={styles.input}
          multiline
          numberOfLines={4}
          onChangeText={(text) => {
            handleInput(text);
          }}
        />
      </View>
    </View>
  );
};

export default RatingInput;

const styles = StyleSheet.create({
  title: {
    fontFamily: "ARegular",
    fontSize: 15,
    marginLeft: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#f5f3f4",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 5,
  },
  input: {
    padding: 10,
    fontFamily: "ARegular",
    fontSize: 16,
    marginTop: 5,
  },
});
