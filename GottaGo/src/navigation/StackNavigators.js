import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../pages/HomeScreen";
import BathroomDetailsScreen from "../pages/BathroomDetailsScreen";
import AddRatingScreen from "../pages/AddRatingScreen";
import RatingSubmittedScreen from "../pages/RatingSubmittedScreen";
import AddBathroomScreen from "../pages/AddBathroomScreen";

const HomeStack = createNativeStackNavigator();

const HomeScreenNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Group>
        <HomeStack.Screen name="Homescreen" component={HomeScreen} />
        <HomeStack.Screen
          name="AddBathroom"
          component={AddBathroomScreen}
          options={{ presentation: "fullScreenModal" }}
        />
        <HomeStack.Screen
          name="BathroomDetails"
          component={BathroomDetailsScreen}
        />
      </HomeStack.Group>
      <HomeStack.Screen
        name="AddRating"
        component={AddRatingScreen}
        options={{ presentation: "modal" }}
      />
      <HomeStack.Screen
        name="RatingSubmitted"
        component={RatingSubmittedScreen}
        options={{ presentation: "fullScreenModal" }}
      />
    </HomeStack.Navigator>
  );
};

export { HomeScreenNavigator };
