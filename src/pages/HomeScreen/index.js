import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  StatusBar,
  Image,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Callout, Marker } from "react-native-maps";
import axios from "axios";
import getDistance from "geolib/es/getPreciseDistance";
import { convertDistance } from "geolib";
import { getBathroomReviews } from "../../../firebase";

export default function HomeScreen({ navigation }) {
  const mapRef = useRef(null);
  const [currLoc, setCurrLoc] = useState();
  const [currMarkerLoc, setcurrMarkerLoc] = useState(null);
  const [currRegion, setCurrRegion] = useState([]);
  const [markerData, setMarkerData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [toggleUnisex, setToggleUnisex] = useState(false);
  const [toggleChangingTable, setToggleChangingTable] = useState(false);
  const [toggleAccessible, setToggleAccessible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const coords = await getCurrLoc();
      getData(coords.latitude, coords.longitude, 0.04, 0.04);
    };
    fetchData();
  }, []);

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
    setIsLoading(true);
    setTimeout(async function () {
      axios
        .get(
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
        )
        .then((res) => {
          setMarkerData(res.data);
        })
        .catch((e) => alert(e))
        .finally(() => {
          setIsLoading(false);
        });
    }, 0);
  };

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

    setcurrMarkerLoc({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });

    return coords;
  };

  const snapToUser = () => {
    getCurrLoc();
    mapRef.current.animateToRegion(currLoc, 800);
  };

  const onRegionChangeComplete = (region) => {
    setCurrRegion(region);
    if (region.latitudeDelta <= 0.4 && region.longitudeDelta <= 0.4) {
      getData(
        region.latitude,
        region.longitude,
        region.longitudeDelta,
        region.latitudeDelta
      );
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        ref={mapRef}
        initialRegion={currLoc}
        showsUserLocation={true}
        onRegionChangeComplete={(region) => {
          onRegionChangeComplete(region);
        }}
      >
        {markerData.map((hit) => {
          // Check for activated filters
          if (
            (!toggleAccessible || hit.is_accessible) &&
            (!toggleChangingTable || hit.changing_table) &&
            (!toggleUnisex || hit.unisex)
          ) {
            return (
              <Marker
                coordinate={{
                  longitude: parseFloat(hit.longitude),
                  latitude: parseFloat(hit.latitude),
                }}
                key={hit._id}
              >
                <Octicons name="dot-fill" size={18} color="black" />
                <Callout
                  onPress={() => {
                    navigation.navigate("BathroomDetails", {
                      hit,
                      latitude: currLoc.latitude,
                      longitude: currLoc.longitude,
                    });
                  }}
                  style={styles.calloutContainer}
                >
                  <View style={styles.calloutViewContainer}>
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{
                            width: 130,
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
                  </View>
                </Callout>
              </Marker>
            );
          }
          return null; // If conditions are not met, return null to render nothing
        })}
      </MapView>
      <TouchableOpacity
        style={styles.unisexButton}
        onPressIn={() => {
          setToggleUnisex(!toggleUnisex);
        }}
      >
        {/* <FontAwesome
          name="genderless"
          size={30}
          color={toggleUnisex ? "black" : "lightgrey"}
          style={{ marginLeft: 2, marginBottom: 1 }}
        /> */}
        <MaterialCommunityIcons
          name="gender-male-female"
          size={24}
          color={toggleUnisex ? "black" : "lightgrey"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.addBathroomButton}
        onPressIn={() => {
          navigation.navigate("AddBathroom", {
            latitude: currLoc.latitude,
            longitude: currLoc.longitude,
          });
        }}
      >
        <Ionicons
          name="ios-add-outline"
          size={24}
          color="black"
          style={{ marginLeft: 2 }}
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
          size={24}
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
          size={24}
          color={toggleChangingTable ? "black" : "lightgrey"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.currentLocationButton}
        onPressIn={() => {
          snapToUser();
        }}
      >
        <FontAwesome name="location-arrow" size={30} color={"black"} />
      </TouchableOpacity>
      {currRegion.longitudeDelta > 0.4 || currRegion.latitudeDelta > 0.4 ? (
        <View style={[styles.searchAreaButton]}>
          <Text style={{ fontSize: 14, color: "#e63946" }}>
            Zoom in to search
          </Text>
        </View>
      ) : null}
      {isLoading &&
        currRegion.longitudeDelta < 0.4 &&
        currRegion.latitudeDelta < 0.4 && (
          <View
            style={[
              styles.loadingIndicator,
              { flexDirection: "row", borderRadius: 100 },
            ]}
          >
            <ActivityIndicator color={"black"} size={8} />
          </View>
        )}
      {!isLoading &&
        currRegion.longitudeDelta < 0.4 &&
        currRegion.latitudeDelta < 0.4 && (
          <View style={[styles.resultsIndicator]}>
            {markerData.length == 0 && (
              <Text style={{ fontFamily: "ARegular", fontSize: 14 }}>
                0 bathrooms
              </Text>
            )}
            {markerData.length == 1 && (
              <Text style={{ fontFamily: "ARegular", fontSize: 14 }}>
                {markerData.length} bathroom
              </Text>
            )}
            {markerData.length > 1 && (
              <Text style={{ fontFamily: "ARegular", fontSize: 14 }}>
                {markerData.length} bathrooms
              </Text>
            )}
          </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  unisexButton: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.06,
    right: 20,
    backgroundColor: "white",
    height: Dimensions.get("window").height * 0.06,
    width: Dimensions.get("window").height * 0.06,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  changingTableButton: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.14,
    right: 20,
    backgroundColor: "white",
    height: Dimensions.get("window").height * 0.06,
    width: Dimensions.get("window").height * 0.06,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  accessibleButton: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.22,
    right: 20,
    backgroundColor: "white",
    height: Dimensions.get("window").height * 0.06,
    width: Dimensions.get("window").height * 0.06,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  currentLocationButton: {
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.02,
    right: 20,
    backgroundColor: "white",
    height: Dimensions.get("window").height * 0.065,
    width: Dimensions.get("window").height * 0.065,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addBathroomButton: {
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.02,
    left: 20,
    backgroundColor: "white",
    height: Dimensions.get("window").height * 0.06,
    width: Dimensions.get("window").height * 0.06,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  currentLocationBlueDot: {
    height: 17,
    width: 17,
    backgroundColor: "#4a80f5",
    borderRadius: 10,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderWidth: 2.25,
    borderColor: "white",
  },
  bathroomLocationDot: {
    backgroundColor: "#219ebc",
    padding: 5,
    borderRadius: 5,
  },
  searchAreaButton: {
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.02,
    height: Dimensions.get("window").height * 0.05,
    alignSelf: "center",
    borderRadius: 40,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  loadingIndicator: {
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.02,
    height: 40,
    width: 40,
    alignSelf: "center",
    borderRadius: 40,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  resultsIndicator: {
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.02,
    height: 40,
    alignSelf: "center",
    borderRadius: 40,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  calloutContainer: { minWidth: 150 },
  calloutViewContainer: {
    flexDirection: "column",
    alignSelf: "flex-start",
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
  lowRatingContainer: {
    backgroundColor: "#ddbea9",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    width: 45,
    paddingVertical: 3,
    borderRadius: 10,
  },
  midRatingContainer: {
    backgroundColor: "#cfe1b9",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    width: 45,
    paddingVertical: 3,
    borderRadius: 10,
  },
  bestRatingContainer: {
    backgroundColor: "#cfe1b9",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    width: 45,
    paddingVertical: 3,
    borderRadius: 10,
  },
  rating: { fontFamily: "Medium", fontSize: 13 },
  attributesContainer: {
    marginTop: 10,
  },
  attributes: { fontFamily: "ARegular", fontSize: 14 },
});
