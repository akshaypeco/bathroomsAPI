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
import * as Haptics from "expo-haptics";
import { AntDesign } from "@expo/vector-icons";
import RatingNumberInput from "../../components/RatingNumberInput";
import RatingBinaryInput from "../../components/RatingBinaryInput";
import RatingInput from "../../components/RatingInput";
import { submitReview } from "../../../firebase";
import { useAuth } from "../../hooks/useAuth";

const AddRatingScreen = ({ navigation, route }) => {
  const user = useAuth();
  const { hit } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const [clean, setClean] = useState(0);
  const [wait, setWait] = useState(0);
  const [stocked, setStocked] = useState(0);
  // const [changing, setChanging] = useState(false);
  // const [gender, setGender] = useState(false);
  // const [accessible, setAccessible] = useState(false);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    setIsLoading(!isLoading);
    const data = {
      id: hit.id,
      name: hit.name,
      is_clean: clean,
      wait_time: wait,
      is_stocked: stocked,
      comment: comment,
      approved: false,
      uid: user.uid,
      review_month_created: new Date().getMonth() + 1,
      review_year_created: new Date().getFullYear(),
    };
    setTimeout(async function () {
      await submitReview(data)
        .catch((e) => {
          alert(e);
          return;
        })
        .then(() => {
          Haptics.selectionAsync();
        })
        .finally(navigation.navigate("RatingSubmitted", { hit }));
    }, 200);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {user?.email ? (
        <View>
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
                style={{
                  fontFamily: "ARegular",
                  fontSize: 17,
                  color: "#0077b6",
                }}
              >
                Rate your experience at
              </Text>
            </View>
            <View>
              <Text style={styles.title}>{hit.name}</Text>
            </View>

            <RatingNumberInput
              title="1. The toilet was clean 🧼"
              handleRating={setClean}
            />
            <RatingNumberInput
              title="2. The wait was short ⌛"
              handleRating={setWait}
            />
            <RatingNumberInput
              title="3. The restroom was stocked 🧻"
              handleRating={setStocked}
            />
            <RatingInput
              title="4. Additional comments"
              placeholder={"Optional"}
              handleInput={setComment}
            />
            {/* <RatingBinaryInput title="Changing table" handleRating={setChanging} />
        <RatingBinaryInput title="Unisex" handleRating={setGender} />
        <RatingBinaryInput title="Accessible" handleRating={setAccessible} /> */}
            {/* <View style={styles.ratingOptionsContainer}>
        <TouchableOpacity style={styles.ratingNumberContainer}>
          <Feather name="thumbs-up" size={32} color="#008000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.ratingNumberContainer}>
          <Feather name="thumbs-down" size={32} color="#ad2e24" />
        </TouchableOpacity>
      </View> */}
          </ScrollView>
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
        </View>
      ) : (
        <View>
          <TouchableOpacity
            onPressIn={() => {
              navigation.goBack();
            }}
          >
            <AntDesign
              name="close"
              size={24}
              color="black"
              style={{ marginLeft: 15, marginTop: 10 }}
            />
          </TouchableOpacity>
          <View style={{ marginHorizontal: 20, marginTop: 20 }}>
            <Text style={{ fontFamily: "ABold", fontSize: 15.5 }}>
              Register to add and review bathrooms. Create an account by logging
              out.
            </Text>
          </View>
        </View>
      )}
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
    fontFamily: "ABold",
    fontSize: 22,
    marginBottom: 10,
    textAlign: "center",
    padding: 10,
  },
  rateButtonContainer: {
    flexDirection: "row",
    backgroundColor: "black",
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 20,
  },
  rateButtonText: {
    fontFamily: "ABold",
    color: "white",
    fontSize: 18,
  },
});
