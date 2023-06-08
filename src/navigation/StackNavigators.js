import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../pages/HomeScreen";
import LoginScreen from "../pages/LoginScreen";
import BathroomDetailsScreen from "../pages/BathroomDetailsScreen";
import AddRatingScreen from "../pages/AddRatingScreen";

const AuthStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

const LoginStackNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
};

const HomeScreenNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Group>
        <HomeStack.Screen name="Homescreen" component={HomeScreen} />
        <HomeStack.Screen
          name="BathroomDetails"
          component={BathroomDetailsScreen}
        />
      </HomeStack.Group>
      <HomeStack.Group screenOptions={{ presentation: "modal" }}>
        <HomeStack.Screen name="AddRating" component={AddRatingScreen} />
      </HomeStack.Group>
    </HomeStack.Navigator>
  );
};

export { LoginStackNavigator, HomeScreenNavigator };
