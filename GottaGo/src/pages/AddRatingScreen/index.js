import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { AntDesign } from "@expo/vector-icons";
import RatingNumberInput from "../../components/RatingNumberInput";
import RatingBinaryInput from "../../components/RatingBinaryInput";
import RatingInput from "../../components/RatingInput";
import { getUser, submitReview } from "../../../firebase";
import { useAuth } from "../../hooks/useAuth";

const AddRatingScreen = ({ navigation, route }) => {
  const user = useAuth().user;
  const { hit } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState();
  const [clean, setClean] = useState(0);
  const [wait, setWait] = useState(0);
  const [stocked, setStocked] = useState(0);
  const [parentRating, setParentRating] = useState();
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      console.log("User UID: ", user.uid);
      await getUser(user.uid).then((res) => {
        setUserData(res);
      });
    };
    fetchData().catch((e) => console.log("Error AddRating: ", e));
  }, [user]);

  const handleSubmit = () => {
    setIsLoading(!isLoading);
    const data = {
      id: hit.id,
      name: hit.name,
      is_clean: clean,
      wait_time: wait,
      is_stocked: stocked,
      parentRating: parentRating,
      comment: comment,
      approved: false,
      uid: user.uid,
      username: userData.username,
      review_month_created: new Date().getMonth(),
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
            <View>
              <Text style={styles.title}>{hit.name}</Text>
            </View>
            <RatingNumberInput handleRating={setParentRating} />
            <Text
              style={{
                fontFamily: "ABold",
                fontSize: 16,
                marginLeft: 20,
                marginBottom: 10,
              }}
            >
              Add more optional info
            </Text>
            <RatingNumberInput
              title="Cleanliness"
              handleRating={setClean}
              size={25}
            />
            <RatingNumberInput
              title="Wait time"
              handleRating={setWait}
              size={25}
            />
            <RatingNumberInput
              title="Stocked essentials"
              handleRating={setStocked}
              size={25}
            />
            <RatingInput
              title="Additional comments"
              placeholder={"Optional"}
              handleInput={setComment}
              size={25}
            />
          </ScrollView>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading || parentRating == null ? true : false}
            style={[
              styles.rateButtonContainer,
              isLoading || parentRating == null
                ? { backgroundColor: "grey" }
                : null,
            ]}
          >
            <View>
              <Text style={styles.rateButtonText}>
                {isLoading ? "Loading..." : "Submit review"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
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
    fontSize: 18,
    marginTop: 15,
    textAlign: "center",
  },
  rateButtonContainer: {
    flexDirection: "row",
    backgroundColor: "black",
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 20,
    marginTop: 30,
  },
  rateButtonText: {
    fontFamily: "ABold",
    color: "white",
    fontSize: 16,
  },
});
