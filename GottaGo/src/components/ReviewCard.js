import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";

const ReviewCard = ({ review }) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ width: "60%" }}>
          <Text style={{ fontFamily: "ABold", fontSize: 15 }}>
            {review.name}
          </Text>
        </View>
        {review.approved ? (
          <Text style={{ fontFamily: "ABold", fontSize: 13, color: "green" }}>
            Approved
          </Text>
        ) : (
          <Text style={{ fontFamily: "ABold", fontSize: 13, color: "#AC8D40" }}>
            Approving
          </Text>
        )}
      </View>
      <Text style={{ fontFamily: "ARegular", fontSize: 13, color: "grey" }}>
        {months[review.review_month_created - 1]} {review.review_year_created}
      </Text>
      <View style={styles.stars}>
        <View>
          <FontAwesome
            name={review.parentRating >= 1 ? "star" : "star-o"}
            size={13}
            style={
              review.parentRating >= 1
                ? styles.starSelected
                : styles.starUnselected
            }
          />
        </View>
        <View>
          <FontAwesome
            name={review.parentRating >= 2 ? "star" : "star-o"}
            size={13}
            style={
              review.parentRating >= 2
                ? styles.starSelected
                : styles.starUnselected
            }
          />
        </View>
        <View>
          <FontAwesome
            name={review.parentRating >= 3 ? "star" : "star-o"}
            size={13}
            style={
              review.parentRating >= 3
                ? styles.starSelected
                : styles.starUnselected
            }
          />
        </View>
        <View>
          <FontAwesome
            name={review.parentRating >= 4 ? "star" : "star-o"}
            size={13}
            style={
              review.parentRating >= 4
                ? styles.starSelected
                : styles.starUnselected
            }
          />
        </View>
        <View>
          <FontAwesome
            name={review.parentRating >= 5 ? "star" : "star-o"}
            size={13}
            style={
              review.parentRating >= 5
                ? styles.starSelected
                : styles.starUnselected
            }
          />
        </View>
      </View>
      <Text style={{ fontFamily: "ARegular", fontSize: 13, marginTop: 3.5 }}>
        {review.comment}
      </Text>
    </View>
  );
};

export default ReviewCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f7f7f7",
    marginRight: 10,
    marginBottom: 10,
    padding: 15,
    width: 300,
    height: 100,
    marginTop: 10,
    borderRadius: 10,
  },
  stars: {
    flexDirection: "row",
    marginTop: 3,
  },
});
