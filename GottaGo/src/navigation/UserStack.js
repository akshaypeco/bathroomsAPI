import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AccountScreen from "../pages/AccountScreen";
import { HomeScreenNavigator } from "./StackNavigators";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import ListScreen from "../pages/ListScreen";

const Tab = createBottomTabNavigator();

export default function UserStack() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: "white" },
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "#afafaf",
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreenNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Entypo name="home" size={size} color={color} />
            ),
            tabBarLabel: "",
          }}
        />
        {/* <Tab.Screen
          name="List"
          component={ListScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Foundation name="list" size={size} color={color} />
            ),
            tabBarLabel: "",
          }}
        /> */}
        <Tab.Screen
          name="Account"
          component={AccountScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account"
                size={size}
                color={color}
              />
            ),
            tabBarLabel: "",
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
