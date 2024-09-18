import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { convertDistance, getDistance } from "geolib";
import { getUser } from "../../../firebase";
import { useAuth } from "../../hooks/useAuth";

const ListScreen = ({ navigation }) => {
  const user = useAuth().user;
  const [toggleUnisex, setToggleUnisex] = useState(false);
  const [toggleChangingTable, setToggleChangingTable] = useState(false);
  const [toggleAccessible, setToggleAccessible] = useState(false);
  const [currLoc, setCurrLoc] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [markerData, setMarkerData] = useState();
  const [userData, setUserData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        await getCurrLoc().then((coords) => {
          getData(coords.latitude, coords.longitude, 0.04, 0.04);
        });
        await getUser(user.uid)
          .then((res) => {
            setUserData(res);
          })
          .then(() => {
            setTimeout(() => {
              setIsLoading(false);
            }, 0);
          });
      } else {
        console.log("waiting for user to load");
        setIsLoading(true);
      }
    };
    fetchData();
  }, [user]);

  const getCurrLoc = async () => {
    let { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    setCurrLoc({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });

    return coords;
  };

  const getData = async (
    latitude,
    longitude,
    longitudeDelta,
    latitudeDelta
  ) => {
    const minLat = latitude - latitudeDelta / 2;
    const maxLat = latitude + latitudeDelta / 2;
    const minLong = longitude - longitudeDelta / 2;
    const maxLong = longitude + longitudeDelta / 2;
    setTimeout(async function () {
      try {
        const res = await axios.get(
          "https://westus.azure.data.mongodb-api.com/app/bathrooms-cgofs/endpoint/by_location",
          {
            params: {
              secret: "bathrooms_secret",
              latmin: minLat,
              latmax: maxLat,
              longmin: minLong,
              longmax: maxLong,
            },
          }
        );

        const arrayWithDistances = res.data.map((item) => ({
          ...item,
          distance: convertDistance(
            getDistance(
              {
                latitude: item.latitude,
                longitude: item.longitude,
              },
              {
                latitude: latitude,
                longitude: longitude,
              }
            ),
            "mi"
          ).toFixed(1),
        }));

        // Step 3: Sort the array by ascending distance
        arrayWithDistances.sort((a, b) => a.distance - b.distance);
        setMarkerData(arrayWithDistances);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    }, 0);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Text style={styles.header}>Bathrooms near you</Text>
      <View style={{ flexDirection: "row", marginTop: 8, marginBottom: 15 }}>
        <TouchableOpacity
          style={styles.unisexButton}
          onPressIn={() => {
            setToggleUnisex(!toggleUnisex);
          }}
        >
          <MaterialCommunityIcons
            name="gender-male-female"
            size={22}
            color={toggleUnisex ? "black" : "lightgrey"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.accessibleButton}
          onPressIn={() => {
            setToggleAccessible(!toggleAccessible);
          }}
        >
          <MaterialIcons
            name="accessible-forward"
            size={22}
            color={toggleAccessible ? "black" : "lightgrey"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.changingTableButton}
          onPressIn={() => {
            setToggleChangingTable(!toggleChangingTable);
          }}
        >
          <MaterialIcons
            name="baby-changing-station"
            size={22}
            color={toggleChangingTable ? "black" : "lightgrey"}
          />
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <ActivityIndicator size="small" color="black" />
      ) : (
        <FlatList
          data={markerData}
          keyExtractor={(item) => item._id} // Use the unique identifier for each item (assuming "_id" is the unique identifier)
          renderItem={({ item: hit }) => {
            // Check for activated filters
            if (
              (!toggleAccessible || hit.accessible) &&
              (!toggleChangingTable || hit.changing_table) &&
              (!toggleUnisex || hit.unisex)
            ) {
              return (
                <View key={hit._id}>
                  <Pressable
                    style={styles.calloutViewContainer}
                    onPress={() => {
                      navigation.navigate("BathroomDetails", {
                        hit,
                        latitude: currLoc.latitude,
                        longitude: currLoc.longitude,
                        userData: userData,
                      });
                    }}
                  >
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{
                            width: "80%",
                            paddingRight: 5,
                          }}
                        >
                          <Text style={styles.title}>{hit.name}</Text>
                        </View>
                        <View>
                          <Text style={styles.distance}>
                            {convertDistance(
                              getDistance(
                                {
                                  latitude: hit.latitude,
                                  longitude: hit.longitude,
                                },
                                {
                                  latitude: currLoc.latitude,
                                  longitude: currLoc.longitude,
                                }
                              ),
                              "mi"
                            ).toFixed(1)}{" "}
                            mi
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          width: 160,
                          paddingRight: 5,
                        }}
                      >
                        <Text style={styles.street}>{hit.street}</Text>
                      </View>

                      {hit.unisex == 1 ||
                      hit.changing_table == 1 ||
                      hit.accessible == 1 ? (
                        <View style={styles.attributesContainer}>
                          <View style={{ flexDirection: "row" }}>
                            {hit.unisex == 1 ? (
                              <View style={styles.tagContainer}>
                                <Text style={styles.attributes}>Unisex</Text>
                              </View>
                            ) : null}
                            {hit.changing_table == 1 ? (
                              <View style={styles.tagContainer}>
                                <Text style={styles.attributes}>
                                  Changing table
                                </Text>
                              </View>
                            ) : null}
                            {hit.accessible == 1 ? (
                              <View style={styles.tagContainer}>
                                <Text style={styles.attributes}>
                                  Accessible
                                </Text>
                              </View>
                            ) : null}
                          </View>
                        </View>
                      ) : null}
                    </View>
                  </Pressable>
                </View>
              );
            }
            return null; // If conditions are not met, return null to render nothing
          }}
        />
      )}
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
  unisexButton: {
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
    marginRight: 5,
    marginLeft: 20,
  },

  accessibleButton: {
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
    marginRight: 5,
    marginLeft: 20,
  },
  changingTableButton: {
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
    marginLeft: 20,
  },
  calloutViewContainer: {
    marginHorizontal: 20,
    marginVertical: 5,
    paddingBottom: 10,
    borderBottomWidth: 0.25,
    borderColor: "grey",
  },
  tagContainer: {
    padding: 5,
    backgroundColor: "#b5e48c",
    marginRight: 5,
    borderRadius: 5,
  },
  title: { fontFamily: "ABold", fontSize: 15.5 },
  street: { fontFamily: "ARegular", fontSize: 13, color: "grey" },
  distance: { fontFamily: "ARegular", fontSize: 14, color: "grey" },
  rating: { fontFamily: "Medium", fontSize: 13 },
  attributesContainer: {
    marginTop: 10,
  },
  attributes: { fontFamily: "ARegular", fontSize: 14 },
});
