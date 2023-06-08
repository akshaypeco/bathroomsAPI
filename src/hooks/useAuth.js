import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

export function useAuth() {
  return (
    <View>
      <Text>useAuth</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
