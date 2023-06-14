import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

const RatingNumberInput = ({ title, handleRating }) => {
  const [stars, setStars] = useState();

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.stars}>
        <TouchableOpacity
          onPress={() => {
            setStars(1);
            handleRating(1);
          }}
        >
          <AntDesign
            name={stars >= 1 ? "star" : "staro"}
            size={32}
            style={stars >= 1 ? styles.starSelected : styles.starUnselected}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setStars(2);
            handleRating(2);
          }}
        >
          <AntDesign
            name={stars >= 2 ? "star" : "staro"}
            size={32}
            style={stars >= 2 ? styles.starSelected : styles.starUnselected}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setStars(3);
            handleRating(3);
          }}
        >
          <AntDesign
            name={stars >= 3 ? "star" : "staro"}
            size={32}
            style={stars >= 3 ? styles.starSelected : styles.starUnselected}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setStars(4);
            handleRating(4);
          }}
        >
          <AntDesign
            name={stars >= 4 ? "star" : "staro"}
            size={32}
            style={stars >= 4 ? styles.starSelected : styles.starUnselected}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setStars(5);
            handleRating(5);
          }}
        >
          <AntDesign
            name={stars >= 5 ? "star" : "staro"}
            size={32}
            style={stars >= 5 ? styles.starSelected : styles.starUnselected}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RatingNumberInput;

const styles = StyleSheet.create({
  title: {
    fontFamily: "ARegular",
    fontSize: 17,
    marginLeft: 20,
    marginBottom: 10,
  },
  ratingNumber: { fontFamily: "ARegular", fontSize: 17 },
  stars: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
  starUnselected: {
    color: "#aaaa",
  },
  starSelected: {
    color: "#ffb300",
  },
});
