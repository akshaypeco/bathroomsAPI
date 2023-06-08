import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const AddRatingScreen = ({ navigation, route }) => {
  const { hit, user } = route.params;

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.headingContainer}>
        <Text style={{ fontFamily: "Medium", fontSize: 18, color: "#0077b6" }}>
          Rate your experience at
        </Text>
      </View>
      <View>
        <Text style={styles.title}>{hit.name}</Text>
      </View>
      <View style={styles.ratingOptionsContainer}>
        <Pressable style={[styles.ratingNumberContainer, styles.boxWithShadow]}>
          <Text style={styles.ratingNumber}>1</Text>
        </Pressable>
        <Pressable style={[styles.ratingNumberContainer, styles.boxWithShadow]}>
          <Text style={styles.ratingNumber}>2</Text>
        </Pressable>
        <Pressable style={[styles.ratingNumberContainer, styles.boxWithShadow]}>
          <Text style={styles.ratingNumber}>3</Text>
        </Pressable>
        <Pressable style={[styles.ratingNumberContainer, styles.boxWithShadow]}>
          <Text style={styles.ratingNumber}>4</Text>
        </Pressable>
        <Pressable style={[styles.ratingNumberContainer, styles.boxWithShadow]}>
          <Text style={styles.ratingNumber}>5</Text>
        </Pressable>
      </View>
      <View style={styles.ratingOptionsContainer}>
        <Pressable style={[styles.ratingNumberContainer, styles.boxWithShadow]}>
          <Text style={styles.ratingNumber}>1</Text>
        </Pressable>
        <Pressable style={[styles.ratingNumberContainer, styles.boxWithShadow]}>
          <Text style={styles.ratingNumber}>2</Text>
        </Pressable>
        <Pressable style={[styles.ratingNumberContainer, styles.boxWithShadow]}>
          <Text style={styles.ratingNumber}>3</Text>
        </Pressable>
        <Pressable style={[styles.ratingNumberContainer, styles.boxWithShadow]}>
          <Text style={styles.ratingNumber}>4</Text>
        </Pressable>
        <Pressable style={[styles.ratingNumberContainer, styles.boxWithShadow]}>
          <Text style={styles.ratingNumber}>5</Text>
        </Pressable>
      </View>
      <View style={styles.ratingOptionsContainer}>
        <Pressable style={[styles.ratingNumberContainer, styles.boxWithShadow]}>
          <Text style={styles.ratingNumber}>1</Text>
        </Pressable>
        <Pressable style={[styles.ratingNumberContainer, styles.boxWithShadow]}>
          <Text style={styles.ratingNumber}>2</Text>
        </Pressable>
        <Pressable style={[styles.ratingNumberContainer, styles.boxWithShadow]}>
          <Text style={styles.ratingNumber}>3</Text>
        </Pressable>
        <Pressable style={[styles.ratingNumberContainer, styles.boxWithShadow]}>
          <Text style={styles.ratingNumber}>4</Text>
        </Pressable>
        <Pressable style={[styles.ratingNumberContainer, styles.boxWithShadow]}>
          <Text style={styles.ratingNumber}>5</Text>
        </Pressable>
      </View>
      {/* <View style={styles.ratingOptionsContainer}>
        <Pressable style={styles.ratingNumberContainer}>
          <Feather name="thumbs-up" size={32} color="#008000" />
        </Pressable>
        <Pressable style={styles.ratingNumberContainer}>
          <Feather name="thumbs-down" size={32} color="#ad2e24" />
        </Pressable>
      </View> */}
      <TouchableOpacity
        style={styles.rateButtonContainer}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Text style={styles.rateButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddRatingScreen;

const styles = StyleSheet.create({
  headingContainer: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    // borderColor: "#0077b6",
    // borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 50,
    marginTop: 10,
    borderRadius: 20,
  },
  title: {
    fontFamily: "Bold",
    fontSize: 24,
    marginTop: 5,
    textAlign: "center",
  },
  ratingNumberContainer: {
    justifyContent: "center",
    alignItems: "center",
    // borderColor: "lightgrey",
    // borderWidth: 2,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  ratingNumber: { fontFamily: "Medium", fontSize: 19 },
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
  },
  rateButtonText: {
    fontFamily: "Bold",
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
