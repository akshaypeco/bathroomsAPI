import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";

const ListScreen = () => {
  return (
    <SafeAreaView>
      <Text style={styles.header}>Bathrooms near you</Text>
    </SafeAreaView>
  );
};

export default ListScreen;

const styles = StyleSheet.create({
  header: {
    fontFamily: "ABold",
    fontSize: 24,
    marginLeft: 15,
    marginTop: 5,
  },
});
