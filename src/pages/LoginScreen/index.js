import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import app from "../../../firebase";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = () => {
    createUserWithEmailAndPassword(getAuth(app), email, "password")
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Registered with: ", user.email);
      })
      .catch((e) => {
        if (e.code == "auth/invalid-email") {
          setError("Please register with a valid email.");
        }
        if (e.code == "auth/missing-email") {
          setError("Please enter an email.");
        }
      });
  };

  const handleLogIn = () => {
    signInWithEmailAndPassword(getAuth(app), email, "password")
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with: ", user.email);
      })
      .catch((e) => {
        if (e.code == "auth/invalid-email") {
          setError("Invalid email.");
        }
        if (e.code == "auth/user-not-found") {
          setError("Email not found. Please try again or register.");
        }
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.titleText}>GottaGo</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={(email) => {
            setEmail(email);
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 8,
            marginTop: 3,
          }}
        >
          <Ionicons name="information-circle-outline" size={17} color="grey" />
          <Text style={styles.disclaimerText}>Your email is confidential.</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogIn}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
          onPress={handleSignUp}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
      {error ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 8,
            marginTop: 5,
          }}
        >
          <Ionicons name="information-circle-outline" size={17} color="red" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  titleText: {
    fontFamily: "ABold",
    fontSize: 30,
    marginBottom: 100,
  },
  inputContainer: { width: "80%" },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 5,
    fontFamily: "ARegular",
    fontSize: 16,
  },
  disclaimerText: {
    fontFamily: "ARegular",
    color: "grey",
    fontSize: 13,
    paddingHorizontal: 4,
  },
  errorText: {
    fontFamily: "ARegular",
    color: "red",
    fontSize: 14.5,
    paddingHorizontal: 4,
  },
  buttonContainer: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  button: {
    backgroundColor: "black",
    width: "100%",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonOutline: { backgroundColor: "white", marginTop: 5 },
  buttonText: { fontFamily: "ABold", color: "white", fontSize: 15 },
  buttonOutlineText: { fontFamily: "ABold", fontSize: 15 },
});
