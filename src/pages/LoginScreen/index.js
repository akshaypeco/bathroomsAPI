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
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import app from "../../../firebase";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), (user) => {
      if (user) {
        navigation.navigate("Main Stage", { user: user.toJSON() });
      }
    });

    return unsubscribe;
  }, []);

  const handleSignUp = () => {
    createUserWithEmailAndPassword(getAuth(app), email, "password")
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Registered with: ", user.email);
      })
      .catch((e) => {
        alert(e.message);
      });
  };

  const handleLogIn = () => {
    signInWithEmailAndPassword(getAuth(app), email, "password").then(
      (userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with: ", user.email);
      }
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.titleText}>Bathrooms</Text>
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
          <Text style={styles.disclaimerText}>
            Your email is not shared with anyone, and is used for accurate and
            editable data.
          </Text>
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
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  titleText: {
    fontFamily: "Bold",
    fontSize: 30,
    marginBottom: 100,
  },
  inputContainer: { width: "80%" },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    fontFamily: "Medium",
    fontSize: 15,
  },
  disclaimerText: {
    fontFamily: "Medium",
    color: "grey",
    fontSize: 13,
    paddingHorizontal: 4,
  },
  buttonContainer: {
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  button: {
    backgroundColor: "#52796f",
    width: "100%",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonOutline: { backgroundColor: "white", marginTop: 5 },
  buttonText: { fontFamily: "Bold", color: "white", fontSize: 15 },
  buttonOutlineText: { fontFamily: "Bold", fontSize: 15 },
});
