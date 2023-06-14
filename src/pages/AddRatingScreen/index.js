import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import RatingNumberInput from "../../components/RatingNumberInput";
import RatingBinaryInput from "../../components/RatingBinaryInput";
import RatingInput from "../../components/RatingInput";
import { submitReview } from "../../../firebase";
import { useAuth } from "../../hooks/useAuth";

const AddRatingScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const { hit } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const [clean, setClean] = useState(0);
  const [wait, setWait] = useState(0);
  const [stocked, setStocked] = useState(0);
  const [changing, setChanging] = useState(false);
  const [gender, setGender] = useState(false);
  const [accessible, setAccessible] = useState(false);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    setIsLoading(!isLoading);
    const data = {
      ...hit,
      is_clean: clean,
      wait_time: wait,
      is_stocked: stocked,
      changing_table: changing,
      unisex: gender,
      accessible: accessible,
      comment: comment,
      approved: false,
      uid: user.uid,
    };
    setTimeout(async function () {
      await submitReview(data)
        .catch((e) => {
          alert(e);
          return;
        })
        .finally(navigation.navigate("RatingSubmitted", { hit }));
    }, 200);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView>
        <TouchableOpacity
          onPressIn={() => {
            navigation.goBack();
          }}
        >
          <AntDesign
            name="close"
            size={24}
            color="black"
            style={{ position: "absolute", left: 20, top: 15 }}
          />
        </TouchableOpacity>
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
        <RatingInput
          title="Comment"
          placeholder={"Optional"}
          handleInput={setComment}
        />
        <RatingNumberInput title="Clean?" handleRating={setClean} />
        <RatingNumberInput title="Short wait?" handleRating={setWait} />
        <RatingNumberInput
          title="Well-stocked (toilet paper, etc.)?"
          handleRating={setStocked}
        />
        <RatingBinaryInput title="Changing table" handleRating={setChanging} />
        <RatingBinaryInput title="Unisex" handleRating={setGender} />
        <RatingBinaryInput title="Accessible" handleRating={setAccessible} />
        {/* <View style={styles.ratingOptionsContainer}>
        <TouchableOpacity style={styles.ratingNumberContainer}>
          <Feather name="thumbs-up" size={32} color="#008000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.ratingNumberContainer}>
          <Feather name="thumbs-down" size={32} color="#ad2e24" />
        </TouchableOpacity>
      </View> */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading ? true : false}
        >
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
      </ScrollView>
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
    fontSize: 18,
  },
});
