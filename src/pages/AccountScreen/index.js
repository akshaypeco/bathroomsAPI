import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "../../hooks/useAuth";

const AccountScreen = () => {
  const { user } = useAuth();
  const auth = getAuth();

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
            signOut(auth);
          }}
        >
          <Text style={{ fontFamily: "ARegular", fontSize: 18, color: "red" }}>
            Log out
          </Text>
        </Pressable>
      </View>
      <View>
        <Text style={styles.statsHeader}>Stats</Text>
        <Text style={styles.statsText}>Comments: 0</Text>
        <Text style={styles.statsText}>Reviews: 0</Text>
        <Text style={styles.statsText}>Account created in 2023</Text>
      </View>
      <View style={{ marginTop: 20 }}>
        <Text style={styles.statsHeader}>Your Reviews</Text>
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
});
