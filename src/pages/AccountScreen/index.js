import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "../../hooks/useAuth";
import { getUserReviews } from "../../../firebase";

const AccountScreen = () => {
  const auth = getAuth();
  const { user } = useAuth();

  const [reviews, setReviews] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserReviews(user.uid).catch((e) => alert(e));
      setReviews(data);
      console.log("Successfully retrieved user reviews.");
    };
    fetchData().catch((e) => alert(e));
  }, [user]);

  return (
    <SafeAreaView style={styles.root}>
      <Text
        style={{
          fontFamily: "ABold",
          fontSize: 24,
          marginLeft: 15,
          marginTop: 5,
        }}
      >
        Account
      </Text>
      <View>
        <Text style={styles.email}>{user?.email}</Text>
        <Pressable
          style={styles.logOutContainer}
          onPress={() => {
            setIsLoading(true);
            setTimeout(function () {
              signOut(auth);
            }, 200);
          }}
          disabled={isLoading ? true : false}
        >
          <Text style={{ fontFamily: "ARegular", fontSize: 16, color: "red" }}>
            {isLoading ? "Logging out..." : "Log out"}
          </Text>
        </Pressable>
      </View>
      <View style={{ marginTop: 20 }}>
        <Text style={styles.statsHeader}>Your Reviews</Text>
        <View>
          <View>
            {reviews?.map(function (item) {
              return (
                <View key={item.id} style={styles.reviewContainer}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.city}>{item.city}</Text>
                  <View style={{ flexDirection: "row", marginTop: 5 }}>
                    <Text style={styles.stocked}>
                      Stocked: {item.is_stocked}
                    </Text>
                    <Text style={styles.clean}>Clean: {item.is_clean}</Text>
                    <Text style={styles.wait}>Wait: {item.wait_time}</Text>
                  </View>
                  <View>
                    {item.comment ? (
                      <Text
                        style={[
                          styles.comment,
                          { fontFamily: "ABold", color: "grey" },
                        ]}
                      >
                        Comment:{" "}
                        <Text style={[styles.comment, { color: "black" }]}>
                          {item.comment}
                        </Text>
                      </Text>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  root: { backgroundColor: "white", flex: 1 },
  email: {
    fontFamily: "ARegular",
    fontSize: 17,
    marginLeft: 15,
    marginTop: 6,
  },
  logOutContainer: {
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "60%",
    marginTop: 10,
  },
  statsHeader: {
    fontFamily: "ABold",
    fontSize: 18,
    marginLeft: 15,
    marginTop: 6,
  },
  statsText: {
    fontFamily: "ARegular",
    fontSize: 17,
    marginLeft: 15,
    marginTop: 6,
  },
  reviewContainer: {
    backgroundColor: "#f5f3f4",
    margin: 10,
    padding: 10,
  },
  name: { fontFamily: "ABold", fontSize: 16 },
  city: { fontFamily: "ARegular", fontSize: 15 },
  stocked: { fontFamily: "ARegular", marginRight: 10, fontSize: 14 },
  clean: { fontFamily: "ARegular", marginRight: 10, fontSize: 14 },
  wait: { fontFamily: "ARegular", fontSize: 14 },
  comment: { fontFamily: "ARegular", fontSize: 14, marginTop: 5 },
});
