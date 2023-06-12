import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

const RatingNumberInput = ({ title }) => {
  const [oneStar, setOneStar] = useState(false);
  const [twoStar, setTwoStar] = useState(false);
  const [threeStar, setThreeStar] = useState(false);
  const [fourStar, setFourStar] = useState(false);
  const [fiveStar, setFiveStar] = useState(false);

  return (
    <View>
      <Text style={styles.ratingTypeText}>{title}</Text>
      <View style={styles.ratingOptionsContainer}>
        <TouchableOpacity
          onPress={() => {
            setOneStar(!oneStar);
            if (!oneStar) {
              setTwoStar(false);
              setThreeStar(false);
              setFourStar(false);
              setFiveStar(false);
            }
          }}
          style={[
            styles.ratingNumberContainer,
            styles.boxWithShadow,
            oneStar
              ? { backgroundColor: "#0077b6" }
              : { backgroundColor: "white" },
          ]}
        >
          <Text
            style={[
              styles.ratingNumber,
              oneStar ? { color: "white" } : { color: "black" },
            ]}
          >
            1
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setTwoStar(!twoStar);
            if (!twoStar) {
              setOneStar(false);
              setThreeStar(false);
              setFourStar(false);
              setFiveStar(false);
            }
          }}
          style={[
            styles.ratingNumberContainer,
            styles.boxWithShadow,
            twoStar
              ? { backgroundColor: "#0077b6" }
              : { backgroundColor: "white" },
          ]}
        >
          <Text
            style={[
              styles.ratingNumber,
              twoStar ? { color: "white" } : { color: "black" },
            ]}
          >
            2
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setThreeStar(!threeStar);
            if (!threeStar) {
              setOneStar(false);
              setTwoStar(false);
              setFourStar(false);
              setFiveStar(false);
            }
          }}
          style={[
            styles.ratingNumberContainer,
            styles.boxWithShadow,
            threeStar
              ? { backgroundColor: "#0077b6" }
              : { backgroundColor: "white" },
          ]}
        >
          <Text
            style={[
              styles.ratingNumber,
              threeStar ? { color: "white" } : { color: "black" },
            ]}
          >
            3
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setFourStar(!fourStar);
            if (!fourStar) {
              setOneStar(false);
              setTwoStar(false);
              setThreeStar(false);
              setFiveStar(false);
            }
          }}
          style={[
            styles.ratingNumberContainer,
            styles.boxWithShadow,
            fourStar
              ? { backgroundColor: "#0077b6" }
              : { backgroundColor: "white" },
          ]}
        >
          <Text
            style={[
              styles.ratingNumber,
              fourStar ? { color: "white" } : { color: "black" },
            ]}
          >
            4
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setFiveStar(!fiveStar);
            if (!fiveStar) {
              setOneStar(false);
              setTwoStar(false);
              setThreeStar(false);
              setFourStar(false);
            }
          }}
          style={[
            styles.ratingNumberContainer,
            styles.boxWithShadow,
            fiveStar
              ? { backgroundColor: "#0077b6" }
              : { backgroundColor: "white" },
          ]}
        >
          <Text
            style={[
              styles.ratingNumber,
              fiveStar ? { color: "white" } : { color: "black" },
            ]}
          >
            5
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RatingNumberInput;

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
