import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "../../hooks/useAuth";
import {
  addUsername,
  getUser,
  getUserReviews,
  submitIssue,
} from "../../../firebase";
import Modal from "react-native-modal";
import ReviewCard from "../../components/ReviewCard";

const AccountScreen = () => {
  const auth = getAuth();
  const { user } = useAuth();
  const [issue, setIssue] = useState("");
  const [reviews, setReviews] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changeUsernameLoading, setChangeUsernameLoading] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState();

  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Fetch user reviews and setReviews
          const userReviews = await getUserReviews(user.uid);
          setReviews(userReviews);

          // Fetch user data and setUserData
          const userData = await getUser(user.uid);
          setUserData(userData);

          // Add a 5-second delay before setting isLoading and refreshing to false
          setTimeout(() => {
            setIsLoading(false);
            setRefreshing(false);
          }, 0);
        } catch (error) {
          console.log("Error fetching data:", error);
          setIsLoading(false);
          setRefreshing(false);
        }
      } else {
        console.log("Waiting for user to load");
        setIsLoading(true);
      }
    };

    fetchData();
  }, [user, refreshing]);

  const handleSetUsername = async () => {
    setChangeUsernameLoading(true);
    if (newUsername != "") {
      await addUsername(user.uid, newUsername);
    }
    setChangeUsernameLoading(false);
    setModalVisible(false);
    setRefreshing(true);
  };

  const handleSubmitIssue = async () => {
    setIsSubmitting(true);
    if (issue != "") {
      await submitIssue(user.uid, issue)
        .catch((e) => {
          alert(e);
        })
        .finally(() => {
          setIsSubmitting(false);
          alert("Submitted! Thank you for contributing.");
        });
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
            }}
          />
        }
      >
        <Text style={styles.header}>Account</Text>
        <View>
          {user?.email ? (
            <Text style={styles.username}>
              Username:{" "}
              {userData?.username != ""
                ? userData?.username
                : user?.uid.substring(0, 8)}
            </Text>
          ) : (
            <Text style={styles.username}>Logged in anonymously</Text>
          )}
          {userData?.username == "" ? (
            <Pressable
              style={{
                flex: 1,
                borderRadius: 10,
              }}
              onPressIn={() => {
                setModalVisible(!isModalVisible);
              }}
            >
              <Text
                style={{
                  fontFamily: "ABold",
                  alignSelf: "flex-start",
                  marginLeft: 15,
                  backgroundColor: "#EFEFEF",
                  paddingVertical: 2,
                  paddingHorizontal: 4,
                  marginTop: 5,
                }}
              >
                Set username
              </Text>
            </Pressable>
          ) : null}

          <View style={{ flex: 1 }}>
            <Modal
              isVisible={isModalVisible}
              animationIn="slideInUp"
              animationOut="slideOutDown"
              swipeDirection={["down"]}
              onSwipeComplete={() => {
                setModalVisible(false);
              }}
              onBackdropPress={() => {
                setModalVisible(false);
              }}
              style={styles.modal}
            >
              <View style={styles.modalContent}>
                <Text style={{ fontFamily: "ABold", fontSize: 18 }}>
                  Change username
                </Text>
                <Text style={{ fontFamily: "ARegular", fontSize: 15 }}>
                  You can only do this once.
                </Text>
                <View
                  style={{
                    backgroundColor: "#EFEFEF",
                    borderRadius: 5,
                    marginTop: 50,
                  }}
                >
                  <TextInput
                    placeholder="Username"
                    onChangeText={(text) => {
                      setNewUsername(text);
                    }}
                    style={{
                      fontFamily: "ARegular",
                      padding: 10,
                      fontSize: 16,
                    }}
                  />
                </View>
                {newUsername && (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 50,
                    }}
                  >
                    <Text>Change to {newUsername}</Text>
                  </View>
                )}

                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 50,
                    alignSelf: "center",
                    backgroundColor: "black",
                    paddingHorizontal: 40,
                    paddingVertical: 10,
                    borderRadius: 5,
                  }}
                >
                  <TouchableOpacity
                    onPress={handleSetUsername}
                    disabled={changeUsernameLoading}
                  >
                    <Text style={{ fontFamily: "ABold", color: "white" }}>
                      {changeUsernameLoading ? "Loading" : "Submit"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={styles.statsHeader}>Reviews</Text>
          {isLoading ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <View>
              {reviews && (
                <View>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    {reviews?.map(function (item) {
                      return (
                        <View key={item.id} style={styles.reviewContainer}>
                          <ReviewCard review={item} />
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
              {!user?.email && (
                <View style={{ marginHorizontal: 20 }}>
                  <Text style={{ fontFamily: "ARegular", fontSize: 20 }}>
                    Create an account to add and review bathrooms.
                  </Text>
                </View>
              )}
              {reviews?.length == 0 && user?.email && (
                <View style={{ marginHorizontal: 20 }}>
                  <Text style={{ fontFamily: "ARegular", fontSize: 20 }}>
                    When you review bathrooms, your history will show up here.
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
        {/* <View style={{ marginTop: 10 }}>
          <Text style={styles.statsHeader}>Report an issue </Text>
          <Text style={styles.subHeader}>
            Let us know about innapropriate reviews, malicious users, and other
            concerns.
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(issue) => {
                setIssue(issue);
              }}
              multiline
              placeholder="Enter details here."
            />
          </View>
          <Pressable
            style={[styles.logOutContainer, { width: "40%" }]}
            onPress={handleSubmitIssue}
            disabled={isSubmitting ? true : false}
          >
            <Text
              style={{ fontFamily: "ARegular", fontSize: 16, color: "black" }}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Text>
          </Pressable>
        </View> */}
        <View>
          {user?.email ? (
            <Pressable
              style={[styles.logOutContainer, { marginTop: 50, width: "80%" }]}
              onPress={() => {
                setIsLoggingOut(true);
                setTimeout(function () {
                  signOut(auth).catch((e) => {
                    alert(e);
                    setIsLoggingOut(false);
                  });
                }, 200);
              }}
              disabled={isLoggingOut ? true : false}
            >
              <Text
                style={{ fontFamily: "ARegular", fontSize: 16, color: "red" }}
              >
                {isLoggingOut ? "Logging out..." : "Log out"}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.logOutContainer, { marginTop: 50, width: "80%" }]}
              onPress={() => {
                setIsLoggingOut(true);
                setTimeout(function () {
                  signOut(auth).catch((e) => {
                    alert(e);
                    setIsLoggingOut(false);
                  });
                }, 200);
              }}
              disabled={isLoggingOut ? true : false}
            >
              <Text
                style={{ fontFamily: "ABold", fontSize: 20, color: "black" }}
              >
                {isLoggingOut ? "Logging out..." : "Create an account"}
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  root: { backgroundColor: "white", flex: 1 },
  header: {
    fontFamily: "ABold",
    fontSize: 35,
    marginLeft: 15,
    marginTop: 5,
  },
  username: {
    fontFamily: "ARegular",
    fontSize: 15.5,
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
    fontSize: 25,
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 4,
  },
  subHeader: {
    fontFamily: "ARegular",
    fontSize: 15,
    marginLeft: 20,
    marginBottom: 4,
  },
  statsText: {
    fontFamily: "ARegular",
    fontSize: 17,
    marginLeft: 15,
    marginTop: 6,
  },
  reviewContainer: {
    flexDirection: "row",
    marginLeft: 20,
  },
  name: { fontFamily: "ABold", fontSize: 16 },
  city: { fontFamily: "ARegular", fontSize: 15 },
  stocked: { fontFamily: "ARegular", marginRight: 10, fontSize: 14 },
  clean: { fontFamily: "ARegular", marginRight: 10, fontSize: 14 },
  wait: { fontFamily: "ARegular", fontSize: 14 },
  comment: { fontFamily: "ARegular", fontSize: 14, marginTop: 5 },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    height: "40%", // Set the height to make the modal take up half of the screen height
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  inputContainer: { width: "100%" },
  input: {
    backgroundColor: "#f5f3f4",
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 5,
    marginHorizontal: 15,
    fontFamily: "ARegular",
    fontSize: 16,
  },
});
