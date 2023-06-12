import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

const RatingBinaryInput = ({ title }) => {
  const [binaryYes, setBinaryYes] = useState(false);
  const [binaryNo, setBinaryNo] = useState(false);
  return (
    <View>
      <Text style={styles.ratingTypeText}>{title}</Text>
      <View style={styles.ratingOptionsContainer}>
        <TouchableOpacity
          onPress={() => {
            setBinaryYes(!binaryYes);
            if (!binaryYes) {
              setBinaryNo(false);
            }
          }}
          style={[
            styles.ratingNumberContainer,
            styles.boxWithShadow,
            binaryYes
              ? { backgroundColor: "#0077b6" }
              : { backgroundColor: "white" },
          ]}
        >
          <Text
            style={[
              styles.ratingNumber,
              binaryYes ? { color: "white" } : { color: "black" },
            ]}
          >
            Yes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setBinaryNo(!binaryNo);
            if (!binaryNo) {
              setBinaryYes(false);
            }
          }}
          style={[
            styles.ratingNumberContainer,
            styles.boxWithShadow,
            binaryNo
              ? { backgroundColor: "#0077b6" }
              : { backgroundColor: "white" },
          ]}
        >
          <Text
            style={[
              styles.ratingNumber,
              binaryNo ? { color: "white" } : { color: "black" },
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  ratingTypeText: {
    fontFamily: "ABold",
    fontSize: 17,
    marginLeft: 20,
  },
  ratingNumber: { fontFamily: "ARegular", fontSize: 17 },
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
