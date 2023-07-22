import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const RatingSubmittedScreen = ({ navigation, route }) => {
  const { hit } = route.params;
  return (
    <View style={styles.root}>
      <Text style={{ fontFamily: "ABold", fontSize: "25" }}>Submitted!</Text>
      <Text
        style={{
          fontFamily: "ARegular",
          fontSize: 20,
          textAlign: "center",
          marginTop: 10,
          color: "grey",
        }}
      >
        {hit.name}
      </Text>
      <Text
        style={{
          fontFamily: "ARegular",
          fontSize: 15,
          marginTop: 17,
          textAlign: "center",
        }}
      >
        Thanks for contributing to the community 🎉. Your rating will be
        reviewed shortly. To check on its status, visit the account page.
      </Text>
      <TouchableOpacity
        style={styles.rateButtonContainer}
        onPress={() => {
          navigation.navigate("Homescreen");
        }}
      >
        <Text style={styles.rateButtonText}>Finish</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RatingSubmittedScreen;

const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  rateButtonContainer: {
    flexDirection: "row",
    backgroundColor: "#0077b6",
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 20,
    marginTop: 20,
  },
  rateButtonText: {
    fontFamily: "ABold",
    color: "white",
    fontSize: 20,
  },
});
