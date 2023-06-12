import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";

const FavoritesScreen = () => {
  return (
    <SafeAreaView style={styles.root}>
      <Text>FavoritesScreen</Text>
    </SafeAreaView>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  root: { backgroundColor: "white", flex: 1 },
});
