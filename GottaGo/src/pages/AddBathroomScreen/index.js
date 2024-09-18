import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { AntDesign } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { reverseGeocodeAsync } from "expo-location";
import { useAuth } from "../../hooks/useAuth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import axios from "axios";

const AddBathroomScreen = ({ navigation, route }) => {
  const { latitude, longitude } = route.params;
  const [currLat, setCurrLat] = useState(latitude);
  const [currLon, setCurrLon] = useState(longitude);
  const { userData } = route.params;
  const { user } = useAuth();
  const [address, setAddress] = useState();
  const [description, setDescription] = useState();
  const [comment, setComment] = useState();
  const [directions, setDirections] = useState();
  const [name, setName] = useState("");
  const [toggleUnisex, setToggleUnisex] = useState(false);
  const [toggleChangingTable, setToggleChangingTable] = useState(false);
  const [toggleAccessible, setToggleAccessible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bathroomSubmitted, setBathroomSubmitted] = useState(false);

  useEffect(() => {
    async function fetchData() {
      await reverseGeocodeAsync({
        latitude: latitude,
        longitude: longitude,
      }).then((res) => {
        setAddress(res[0]);
        setName(res.name);
      });
    }

    fetchData().catch((e) => console.log(e));
  }, []);

  const setRegionChange = async (latitude, longitude) => {
    const newLoc = await reverseGeocodeAsync({
      latitude: latitude,
      longitude: longitude,
    }).then((res) => {
      setAddress(res[0]);
      setName(res[0].name);
      setCurrLat(latitude);
      setCurrLon(longitude);
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    // Ensure variables have valid values before using them in the data object
    const commentValue = comment ? comment : "";
    const directionsValue = directions ? directions : "";
    const descriptionValue = description ? description : "";
    const nameUsed = name ? name : address.name;

    // Create the data object directly without stringifying it
    const data = {
      accessible: toggleAccessible,
      changing_table: toggleChangingTable,
      unisex: toggleUnisex,
      comment: commentValue,
      directions: directionsValue,
      description: descriptionValue,
      name: nameUsed,
      street: address.streetNumber + " " + address.street,
      city: address.city,
      state: address.region,
      country: address.country,
      edit_id: "",
      latitude: currLat,
      longitude: currLon,
      created_at_month: new Date().getMonth(),
      created_at_year: new Date().getFullYear(),
      created_at: new Date().toISOString(),
      updated_at: "",
      username: userData.username,
      approved: false,
    };

    try {
      const response = await axios.post(
        "https://westus.azure.data.mongodb-api.com/app/bathrooms-cgofs/endpoint/addBathroom",
        data,
        {
          headers: {
            // Overwrite Axios's automatically set Content-Type
            "Content-Type": "application/json",
          },
        }
      );

      // Add any additional handling for successful response here

      // Example: Display a success message
      Haptics.selectionAsync();
      console.log("Bathroom successfully uploaded");
      setIsLoading(false);
      setBathroomSubmitted(true);
    } catch (error) {
      console.error("Error:", error.message);
      // Add any additional error handling here
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {bathroomSubmitted ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <Text style={{ fontFamily: "ABold", fontSize: 22 }}>Submitted!</Text>
          <Text
            style={{
              fontFamily: "ARegular",
              fontSize: 15.5,
              textAlign: "center",
              marginTop: 3,
              marginHorizontal: 20,
            }}
          >
            Bathroom added successfully. We will review your submission and
            approve it shortly.
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={[styles.rateButtonContainer]}
          >
            <View>
              <Text style={styles.rateButtonText}>Finish</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <ScrollView>
            <TouchableOpacity
              onPressIn={() => {
                navigation.goBack();
              }}
            >
              <AntDesign
                name="close"
                size={24}
                color="black"
                style={{ marginLeft: 15, marginTop: 10 }}
              />
            </TouchableOpacity>
            {user?.email ? (
              <View>
                <Text style={styles.header}>Add a bathroom</Text>
                <Text style={styles.instructions}>
                  Drag on map to add an address.
                </Text>
                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    region={{
                      latitude: latitude,
                      longitude: longitude,
                      latitudeDelta: 0.0015,
                      longitudeDelta: 0.0015,
                    }}
                    onRegionChangeComplete={(region) => {
                      setRegionChange(region.latitude, region.longitude);
                    }}
                    showsUserLocation={true}
                  ></MapView>
                  <View style={styles.markerFixed}>
                    <Foundation name="marker" size={30} color="black" />
                  </View>
                </View>
                <View style={styles.addressContainer}>
                  <Text style={styles.address}>
                    {address?.streetNumber} {address?.street}, {address?.city}{" "}
                    {address?.region} {address?.postalCode}
                  </Text>
                </View>
                <View>
                  <Text style={styles.subheader}>Name</Text>
                  <View>
                    <KeyboardAvoidingView style={styles.inputContainer}>
                      <TextInput
                        placeholder={address?.name}
                        placeholderTextColor={"grey"}
                        style={styles.input}
                        onChangeText={(text) => {
                          setName(text);
                        }}
                      />
                    </KeyboardAvoidingView>
                  </View>
                </View>
                <View>
                  <Text style={styles.subheader}>Description</Text>
                  <View>
                    <KeyboardAvoidingView style={styles.inputContainer}>
                      <TextInput
                        multiline
                        placeholder="Optional"
                        placeholderTextColor={"grey"}
                        maxLength={250}
                        style={styles.input}
                        onChangeText={(text) => {
                          setDescription(text);
                        }}
                      />
                    </KeyboardAvoidingView>
                  </View>
                </View>
                <View>
                  <Text style={styles.subheader}>Directions</Text>
                  <View>
                    <KeyboardAvoidingView style={styles.inputContainer}>
                      <TextInput
                        multiline
                        placeholder="Optional"
                        placeholderTextColor={"grey"}
                        style={styles.input}
                        onChangeText={(text) => {
                          setDirections(text);
                        }}
                      />
                    </KeyboardAvoidingView>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 8,
                    marginBottom: 15,
                    justifyContent: "space-evenly",
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: 100,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "ARegular",
                        fontSize: 14,
                        marginBottom: 5,
                      }}
                    >
                      Unisex
                    </Text>
                    <TouchableOpacity
                      style={styles.toggleButton}
                      onPressIn={() => {
                        setToggleUnisex(!toggleUnisex);
                      }}
                    >
                      <MaterialCommunityIcons
                        name="gender-male-female"
                        size={22}
                        color={toggleUnisex ? "#43A121" : "lightgrey"}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: 100,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "ARegular",
                        fontSize: 14,
                        marginBottom: 5,
                      }}
                    >
                      Accessible
                    </Text>
                    <TouchableOpacity
                      style={styles.toggleButton}
                      onPressIn={() => {
                        setToggleAccessible(!toggleAccessible);
                      }}
                    >
                      <MaterialIcons
                        name="accessible-forward"
                        size={22}
                        color={toggleAccessible ? "#43A121" : "lightgrey"}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: 100,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "ARegular",
                        fontSize: 14,
                        marginBottom: 5,
                      }}
                    >
                      Changing table
                    </Text>
                    <TouchableOpacity
                      style={styles.toggleButton}
                      onPressIn={() => {
                        setToggleChangingTable(!toggleChangingTable);
                      }}
                    >
                      <MaterialIcons
                        name="baby-changing-station"
                        size={22}
                        color={toggleChangingTable ? "#43A121" : "lightgrey"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={isLoading ? true : false}
                  style={[
                    styles.rateButtonContainer,
                    isLoading ? { backgroundColor: "grey" } : null,
                  ]}
                >
                  <View>
                    <Text style={styles.rateButtonText}>
                      {isLoading ? "Loading..." : "Add bathroom"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                <Text style={{ fontFamily: "ABold", fontSize: 15.5 }}>
                  Register to add and review bathrooms. Create an account by
                  logging out.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AddBathroomScreen;

const styles = StyleSheet.create({
  header: {
    fontFamily: "ABold",
    fontSize: 22,
    marginLeft: 15,
    marginTop: 10,
  },
  subheader: {
    fontFamily: "ARegular",
    fontSize: 16,
    marginLeft: 15,
    marginTop: 10,
  },
  instructions: {
    fontFamily: "ARegular",
    fontSize: 16,
    marginLeft: 15,
    marginRight: 20,
    marginTop: 3,
    color: "grey",
  },
  mapContainer: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "90%",
    height: 275,
    borderRadius: 5,
  },
  markerFixed: {
    position: "absolute",
  },
  addressContainer: {
    marginTop: 10,
    padding: 5,
    alignItems: "center",
    marginHorizontal: 30,
    borderRadius: 5,
  },
  address: { fontFamily: "ARegular", fontSize: 15.5 },
  inputContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    paddingTop: 10,
    fontFamily: "ARegular",
    backgroundColor: "#f5f3f4",
    fontSize: 14,
  },
  toggleButton: {
    backgroundColor: "white",
    height: 40,
    width: 40,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  rateButtonContainer: {
    flexDirection: "row",
    backgroundColor: "black",
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 20,
    marginTop: 10,
  },
  rateButtonText: {
    fontFamily: "ABold",
    color: "white",
    fontSize: 16,
  },
});
