import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  StatusBar,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Callout, Marker } from "react-native-maps";
import axios from "axios";

export default function HomeScreen({ navigation }) {
  const mapRef = useRef(null);
  const [currLoc, setCurrLoc] = useState();
  const [currMarkerLoc, setcurrMarkerLoc] = useState(null);
  const [currRegion, setCurrRegion] = useState([]);
  const [icon, setIcon] = useState("black");
  const [markerData, setMarkerData] = useState([]);

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
      });
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
    setIcon("#5588ff");
  };

  const onRegionChangeComplete = (region) => {
    setCurrRegion(region);
    if (region.latitudeDelta <= 0.18 && region.longitudeDelta <= 0.18) {
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
        onRegionChangeComplete={(region) => {
          onRegionChangeComplete(region);
        }}
        onRegionChange={() => {
          setIcon("black");
        }}
      >
        {markerData.map((hit) => (
          <Marker
            coordinate={{
              longitude: parseFloat(hit.longitude),
              latitude: parseFloat(hit.latitude),
            }}
            key={hit._id}
          >
            <Foundation name="marker" size={24} color="#0077b6" />
            <Callout
              onPress={() => {
                navigation.navigate("BathroomDetails", { hit });
              }}
              style={styles.calloutContainer}
            >
              <View style={styles.calloutViewContainer}>
                <View>
                  <Text style={styles.title}>{hit.name}</Text>
                  <Text style={styles.street}>{hit.street}</Text>
                  {/* <View>
                    {(hit.upvote > 0 || hit.downvote > 0) &&
                    hit.upvote / (hit.upvote + hit.downvote) < 0.5 ? (
                      <View style={styles.lowRatingContainer}>
                        <Text style={styles.rating}>
                          {Math.round(
                            (hit.upvote / (hit.upvote + hit.downvote)) * 100
                          )}
                          %
                        </Text>
                      </View>
                    ) : null}
                  </View> */}
                  {/* <View>
                    {(hit.upvote > 0 || hit.downvote > 0) &&
                    hit.upvote / (hit.upvote + hit.downvote) >= 0.5 &&
                    hit.upvote / (hit.upvote + hit.downvote) < 0.75 ? (
                      <View style={styles.midRatingContainer}>
                        <Text style={styles.rating}>
                          {Math.round(
                            (hit.upvote / (hit.upvote + hit.downvote)) * 100
                          )}
                          %
                        </Text>
                      </View>
                    ) : null}
                  </View> */}
                  {/* <View>
                    {(hit.upvote > 0 || hit.downvote > 0) &&
                    hit.upvote / (hit.upvote + hit.downvote) > 0.75 ? (
                      <View style={styles.bestRatingContainer}>
                        <Text style={styles.rating}>
                          {Math.round(
                            (hit.upvote / (hit.upvote + hit.downvote)) * 100
                          )}
                          %
                        </Text>
                      </View>
                    ) : null}
                  </View> */}
                  {/* <View>
                    {hit.upvote == 0 && hit.downvote == 0 ? (
                      <Text style={styles.rating}>No ratings yet</Text>
                    ) : null}
                  </View> */}
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
                            <Text style={styles.attributes}>Accessible</Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
        {currMarkerLoc ? (
          <Marker
            coordinate={{
              longitude: currMarkerLoc.longitude,
              latitude: currMarkerLoc.latitude,
            }}
          >
            <View style={styles.currentLocationBlueDot}></View>
          </Marker>
        ) : null}
      </MapView>
      <Pressable
        style={styles.currentLocationButton}
        onPressIn={() => {
          snapToUser();
        }}
      >
        <FontAwesome name="location-arrow" size={35} color={icon} />
      </Pressable>
      {currRegion.longitudeDelta > 0.18 || currRegion.latitudeDelta > 0.18 ? (
        <View style={[styles.searchAreaButton]}>
          <Text style={{ fontSize: 17, color: "#e63946" }}>
            Zoom in to search
          </Text>
        </View>
      ) : null}
      {/* {isLoading ? (
        <View style={[styles.searchAreaButton]}>
          <Text style={{ fontSize: 17, color: "#e63946" }}>Loading</Text>
        </View>
      ) : null} */}
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
  currentLocationButton: {
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.02,
    left: Dimensions.get("window").width * 0.8,
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
  title: { fontFamily: "ABold", fontSize: 16 },
  street: { fontFamily: "Medium", fontSize: 14, color: "grey" },
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
