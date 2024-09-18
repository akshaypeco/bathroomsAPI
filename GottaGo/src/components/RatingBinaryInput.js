import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

const RatingBinaryInput = ({ title, handleRating }) => {
  const [binary, setBinary] = useState(true);

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.ratingOptionsContainer}>
        <TouchableOpacity
          onPress={() => {
            setBinary(true);
            handleRating(true);
          }}
          style={[
            styles.ratingNumberContainer,
            styles.boxWithShadow,
            binary
              ? { backgroundColor: "black" }
              : { backgroundColor: "white" },
          ]}
        >
          <Text
            style={[
              styles.ratingNumber,
              binary ? { color: "white" } : { color: "black" },
            ]}
          >
            Yes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setBinary(false);
            handleRating(false);
          }}
          style={[
            styles.ratingNumberContainer,
            styles.boxWithShadow,
            !binary
              ? { backgroundColor: "black" }
              : { backgroundColor: "white" },
          ]}
        >
          <Text
            style={[
              styles.ratingNumber,
              !binary ? { color: "white" } : { color: "black" },
            ]}
          >
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RatingBinaryInput;

const styles = StyleSheet.create({
  ratingNumberContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  title: {
    fontFamily: "ARegular",
    fontSize: 17,
    marginLeft: 20,
  },
  ratingNumber: { fontFamily: "ARegular", fontSize: 15 },
  ratingOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
  rateButtonContainer: {
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
  boxWithShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.075,
    shadowRadius: 3,
  },
});
