import { StyleSheet, Text, View } from "react-native";
import React from "react";

const ReviewCard = ({ review }) => {
  return (
    <View style={styles.container}>
      <Text>{review.comment}</Text>
    </View>
  );
};

export default ReviewCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f7f7f7",
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 15,
    width: 300,
    height: 100,
    marginTop: 10,
    borderRadius: 10,
  },
});
