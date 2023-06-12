import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import RatingNumberInput from "../../components/RatingNumberInput";
import RatingBinaryInput from "../../components/RatingBinaryInput";

const AddRatingScreen = ({ navigation, route }) => {
  const { hit } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const toggleLoading = async () => {
    setIsLoading(!isLoading);
    setTimeout(function () {
      navigation.navigate("RatingSubmitted", { hit });
    }, 1000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <AntDesign
        name="close"
        size={24}
        color="black"
        style={{ position: "absolute", left: 20, top: 15 }}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.headingContainer}>
        <Text
          style={{ fontFamily: "ARegular", fontSize: 17, color: "#0077b6" }}
        >
          Rate your experience at
        </Text>
      </View>
      <View>
        <Text style={styles.title}>{hit.name}</Text>
      </View>
      <RatingNumberInput title="Cleanliness" />
      <RatingNumberInput title="Short wait time" />
      <RatingNumberInput title="Well-stocked (toilet paper, etc.)" />
      <RatingBinaryInput title="Changing table" />
      <RatingBinaryInput title="Gender neutral" />
      <RatingBinaryInput title="Accessible" />

      {/* <View style={styles.ratingOptionsContainer}>
        <TouchableOpacity style={styles.ratingNumberContainer}>
          <Feather name="thumbs-up" size={32} color="#008000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.ratingNumberContainer}>
          <Feather name="thumbs-down" size={32} color="#ad2e24" />
        </TouchableOpacity>
      </View> */}
      <TouchableOpacity onPress={toggleLoading}>
        <View style={styles.rateButtonContainer}>
          {isLoading && (
            <ActivityIndicator
              size="20"
              color="white"
              style={{ marginRight: 25 }}
            />
          )}
          <Text style={styles.rateButtonText}>
            {isLoading ? "Loading..." : "Submit"}
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddRatingScreen;

const styles = StyleSheet.create({
  headingContainer: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 50,
    marginTop: 10,
    borderRadius: 20,
  },
  title: {
    fontFamily: "ARegular",
    fontSize: 23,
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    padding: 10,
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
