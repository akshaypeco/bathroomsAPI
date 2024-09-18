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
  signInAnonymously,
  signInWithEmailAndPassword,
} from "firebase/auth";
import app, { addUser } from "../../../firebase";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const handleSignUp = () => {
    setIsRegistering(true);
    createUserWithEmailAndPassword(getAuth(app), email, "password")
      .then((userCredentials) => {
        const user = userCredentials.user;
        addUser(user.uid);
        console.log("Registered with: ", user.email);
      })
      .catch((e) => {
        setIsRegistering(false);
        if (e.code == "auth/invalid-email") {
          setError("Invalid email.");
        } else if (e.code == "auth/missing-email") {
          setError("Please enter an email.");
        } else if (e.code == "auth/email-already-in-use") {
          setError("Email already in use.");
        } else {
          setError("Error registering. Please try again.");
        }
      });
  };

  const handleLogIn = () => {
    setIsLoggingIn(true);
    signInWithEmailAndPassword(getAuth(app), email, "password")
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with: ", user.email);
      })
      .catch((e) => {
        setIsLoggingIn(false);
        if (e.code == "auth/invalid-email") {
          setError("Invalid email.");
        } else if (e.code == "auth/user-not-found") {
          setError("User not found. Please try again or register.");
        } else {
          setError("Error logging in. Please try again.");
        }
      });
  };

  const handleAnonymousLogin = () => {
    setIsGuest(true);
    signInAnonymously(getAuth(app))
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in anonymously: ", user.uid);
      })
      .catch((e) => {
        setIsGuest(false);
        setError("Error. Please try again.");
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.titleText}>GottaGo</Text>
      <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize="none"
          placeholder="Email"
          placeholderTextColor={"black"}
          style={styles.input}
          value={email}
          onChangeText={(email) => {
            setEmail(email);
          }}
        />
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
        {/* <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 8,
            marginTop: 3,
          }}
        >
          <Ionicons name="information-circle-outline" size={17} color="grey" />
          <Text style={styles.disclaimerText}>For authentication only.</Text>
        </View> */}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogIn}
          disabled={isLoggingIn ? true : false}
        >
          <Text style={styles.buttonText}>
            {isLoggingIn ? "Logging in..." : "Log in"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
          onPress={handleSignUp}
          disabled={isRegistering ? true : false}
        >
          <Text style={styles.buttonOutlineText}>
            {isRegistering ? "Registering..." : "Register"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 10 }}>
        <Text style={{ fontFamily: "ARegular" }}>or</Text>
      </View>
      <View style={[styles.buttonContainer, { marginTop: 10 }]}>
        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
          onPress={handleAnonymousLogin}
          disabled={isGuest ? true : false}
        >
          <Text style={styles.buttonOutlineText}>
            {isGuest ? "Loading..." : "Continue as guest"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  titleText: {
    fontFamily: "ABold",
    fontSize: 30,
    marginBottom: 100,
    color: "#415a77",
  },
  inputContainer: { width: "80%" },
  input: {
    backgroundColor: "#e0e1dd",
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
    color: "white",
  },
  errorText: {
    fontFamily: "ARegular",
    color: "red",
    fontSize: 15.5,
    paddingHorizontal: 4,
  },
  buttonContainer: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  button: {
    backgroundColor: "#e0e1dd",
    width: "100%",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: { fontFamily: "ABold", color: "black", fontSize: 15 },
  buttonOutline: { backgroundColor: "#1b263b", marginTop: 5 },
  buttonOutlineText: { fontFamily: "ABold", fontSize: 15, color: "white" },
});
