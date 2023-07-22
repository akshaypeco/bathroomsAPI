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
} from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "../../hooks/useAuth";
import { addUsername, getUser, getUserReviews } from "../../../firebase";
import Modal from "react-native-modal";

const AccountScreen = () => {
  const auth = getAuth();
  const { user } = useAuth();

  const [reviews, setReviews] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [changeUsernameLoading, setChangeUsernameLoading] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState();

  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log("User UID: ", user.uid);
      await getUserReviews(user.uid).then((res) => {
        setReviews(res);
      });
      await getUser(user.uid).then((res) => {
        setUserData(res);
      });
    };
    fetchData().catch((e) => console.log(e));
    setRefreshing(false);
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

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
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
              {userData.username != ""
                ? userData.username
                : user?.uid.substring(0, 8)}
            </Text>
          ) : (
            <Text style={styles.username}>
              Logged in anonymously as {user?.uid.substring(0, 8)}
            </Text>
          )}
          {userData.username == "" ? (
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
          <Text style={styles.statsHeader}>Your Reviews</Text>
          {reviews && (
            <View>
              <View>
                {reviews?.map(function (item) {
                  return (
                    <View key={item.id} style={styles.reviewContainer}></View>
                  );
                })}
              </View>
            </View>
          )}
          {!user?.email && (
            <View style={{ marginHorizontal: 20 }}>
              <Text style={{ fontFamily: "ARegular", fontSize: 15.5 }}>
                Register to add and review bathrooms. Create an account by
                logging out.
              </Text>
            </View>
          )}
          {reviews?.length == 0 && (
            <View style={{ marginHorizontal: 20 }}>
              <Text style={{ fontFamily: "ARegular", fontSize: 15.5 }}>
                When you review bathrooms, your history will show up here.
              </Text>
            </View>
          )}
        </View>
        <Pressable
          style={styles.logOutContainer}
          onPress={() => {
            setIsLoading(true);
            setTimeout(function () {
              signOut(auth).catch((e) => {
                alert(e);
                setIsLoading(false);
              });
            }, 200);
          }}
          disabled={isLoading ? true : false}
        >
          <Text style={{ fontFamily: "ARegular", fontSize: 16, color: "red" }}>
            {isLoading ? "Logging out..." : "Log out"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  root: { backgroundColor: "white", flex: 1 },
  header: {
    fontFamily: "ABold",
    fontSize: 24,
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
    fontSize: 18,
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 4,
  },
  statsText: {
    fontFamily: "ARegular",
    fontSize: 17,
    marginLeft: 15,
    marginTop: 6,
  },
  reviewContainer: {
    backgroundColor: "#f7f7f7",
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
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
});
