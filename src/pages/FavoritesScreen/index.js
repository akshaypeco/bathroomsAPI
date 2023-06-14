import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";

const FavoritesScreen = () => {
  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Favorites</Text>
    </SafeAreaView>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  root: { backgroundColor: "white", flex: 1 },
  title: {
    fontFamily: "ABold",
    fontSize: 24,
    marginLeft: 15,
    marginTop: 5,
  },
});
