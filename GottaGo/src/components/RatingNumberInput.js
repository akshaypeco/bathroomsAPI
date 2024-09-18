import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

const RatingNumberInput = ({ title, handleRating, size = 30 }) => {
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
          <FontAwesome
            name={stars >= 1 ? "star" : "star-o"}
            size={size}
            style={stars >= 1 ? styles.starSelected : styles.starUnselected}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setStars(2);
            handleRating(2);
          }}
        >
          <FontAwesome
            name={stars >= 2 ? "star" : "star-o"}
            size={size}
            style={stars >= 2 ? styles.starSelected : styles.starUnselected}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setStars(3);
            handleRating(3);
          }}
        >
          <FontAwesome
            name={stars >= 3 ? "star" : "star-o"}
            size={size}
            style={stars >= 3 ? styles.starSelected : styles.starUnselected}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setStars(4);
            handleRating(4);
          }}
        >
          <FontAwesome
            name={stars >= 4 ? "star" : "star-o"}
            size={size}
            style={stars >= 4 ? styles.starSelected : styles.starUnselected}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setStars(5);
            handleRating(5);
          }}
        >
          <FontAwesome
            name={stars >= 5 ? "star" : "star-o"}
            size={size}
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
    fontSize: 16,
    marginLeft: 20,
  },
  ratingNumber: { fontFamily: "ARegular", fontSize: 17 },
  stars: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 30,
    marginTop: 10,
  },
  starUnselected: {
    color: "#aaaa",
  },
  starSelected: {
    color: "#ffb300",
  },
});
