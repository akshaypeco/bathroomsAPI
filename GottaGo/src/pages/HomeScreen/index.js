import "react-native-gesture-handler";
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
  FlatList,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Callout, Marker } from "react-native-maps";
import axios from "axios";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import getDistance from "geolib/es/getPreciseDistance";
import { convertDistance } from "geolib";
import { getBathroomReviews, getUser } from "../../../firebase";
import { useAuth } from "../../hooks/useAuth";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as Haptics from "expo-haptics";

export default function HomeScreen({ navigation }) {
  const mapRef = useRef(null);
  const user = useAuth().user;
  const [currLoc, setCurrLoc] = useState();
  const [hit, setHit] = useState();
  const [currRegion, setCurrRegion] = useState([]);
  const [markerData, setMarkerData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hitModalIsLoading, setHitModalIsLoading] = useState(false);
  const [userData, setUserData] = useState();
  const [toggleUnisex, setToggleUnisex] = useState(false);
  const [toggleChangingTable, setToggleChangingTable] = useState(false);
  const [toggleAccessible, setToggleAccessible] = useState(false);
  const [firstLoadComplete, setFirstLoadComplete] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const hitSheetModalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const coords = await getCurrLoc();
      await getUser(user.uid).then((res) => {
        setUserData(res);
      });
      getData(coords.latitude, coords.longitude, 0.04, 0.04);
    };

    fetchData();
  }, [user]);

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

    return coords;
  };

  const snapToUser = () => {
    getCurrLoc();
    mapRef.current?.animateToRegion(currLoc, 800);
  };

  const onRegionChangeComplete = (region) => {
    setFirstLoadComplete(true);
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

  const centerMapOnMarker = (hit) => {
    // Assuming you have a reference to your MapView component in mapRef
    mapRef.current.animateToRegion(
      {
        latitude: parseFloat(hit.latitude),
        longitude: parseFloat(hit.longitude),
        latitudeDelta: currRegion.latitudeDelta, // Adjust this value to set the zoom level
        longitudeDelta: currRegion.longitudeDelta, // Adjust this value to set the zoom level
      },
      400
    ); // 1000 ms is the animation duration
  };

  bottomSheetModalRef.current?.present();

  const snapPoints = ["18%", "48%", "75%"];

  const handlePresenthitSheetModal = (hit) => {
    hitSheetModalRef.current?.present();
    setHitModalIsLoading(true);
    setHit(hit);
    setHitModalIsLoading(false);
  };

  return (
    <BottomSheetModalProvider>
      <StatusBar barStyle="dark-content" />
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
              (!toggleAccessible || hit.accessible) &&
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
                  onPress={() => {
                    centerMapOnMarker(hit);
                    handlePresenthitSheetModal(hit);
                  }}
                >
                  {/* <Octicons name="dot-fill" size={18} color="black" /> */}
                  {/* <FontAwesome6 name="dot-circle" size={20} color="#1b263b" /> */}
                  <FontAwesome5 name="map-marker" size={24} color="#415a77" />
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
          <MaterialCommunityIcons
            name="gender-male-female"
            size={24}
            color={toggleUnisex ? "#e0e1dd" : "#415a77"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addBathroomButton}
          onPressIn={() => {
            Haptics.selectionAsync();
            navigation.navigate("AddBathroom", {
              latitude: currLoc.latitude,
              longitude: currLoc.longitude,
              userData: userData,
            });
          }}
        >
          <Ionicons
            name="add-outline"
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
            color={toggleAccessible ? "#e0e1dd" : "#415a77"}
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
            color={toggleChangingTable ? "#e0e1dd" : "#415a77"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPressIn={() => {
            Haptics.selectionAsync();
            snapToUser();
          }}
        >
          <FontAwesome name="location-arrow" size={28} color={"black"} />
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
          ((currRegion.longitudeDelta < 0.4 &&
            currRegion.latitudeDelta < 0.4) ||
            !firstLoadComplete) && (
            <View style={[styles.resultsIndicator]}>
              {markerData.length == 0 && (
                <Text
                  style={{
                    fontFamily: "ARegular",
                    fontSize: 14,
                    color: "#e0e1dd",
                  }}
                >
                  0 bathrooms
                </Text>
              )}
              {markerData.length == 1 && (
                <Text
                  style={{
                    fontFamily: "ARegular",
                    fontSize: 14,
                    color: "#e0e1dd",
                  }}
                >
                  {markerData.length} bathroom
                </Text>
              )}
              {markerData.length > 1 && (
                <Text
                  style={{
                    fontFamily: "ARegular",
                    fontSize: 14,
                    color: "#e0e1dd",
                  }}
                >
                  {markerData.length} bathrooms
                </Text>
              )}
            </View>
          )}

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={false} // Prevent this modal from closing
          enableDismissOnClose={false} // Ensure it stays open
          stackBehavior="push"
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Bathrooms nearby</Text>
            <View style={styles.modalFlatlistContainer}>
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
                            style={styles.FlatlistViewContainer}
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
                                  <Text style={styles.title}>
                                    {hit.name ? hit.name : "Bathroom"}
                                  </Text>
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
                                  width: "80%",
                                  paddingRight: 5,
                                  paddingTop: 5,
                                }}
                              >
                                <Text numberOfLines={1} style={styles.street}>
                                  {hit.street}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                }}
                              >
                                <View>
                                  {hit.unisex == 1 ||
                                  hit.changing_table == 1 ||
                                  hit.accessible == 1 ? (
                                    <View style={styles.attributesContainer}>
                                      <View style={{ flexDirection: "row" }}>
                                        {hit.unisex == 1 ? (
                                          <View style={styles.tagContainer}>
                                            <Text style={styles.attributes}>
                                              Unisex
                                            </Text>
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
                                {hit?.trusted_store && (
                                  <Text style={styles.hitTrustedStore}>
                                    Trusted Store
                                  </Text>
                                )}
                              </View>
                            </View>
                          </Pressable>
                        </View>
                      );
                    }
                    return null; // If conditions are not met, return null to render nothing
                  }}
                />
              )}
            </View>
          </View>
        </BottomSheetModal>
        <BottomSheetModal
          stackBehavior="push"
          ref={hitSheetModalRef}
          index={0}
          snapPoints={["30"]}
          enablePanDownToClose={true} // Enable swipe down to close
        >
          <View style={styles.hitModalContainer}>
            {hitModalIsLoading ? (
              <ActivityIndicator size="small" color="black" />
            ) : (
              <View>
                <View style={styles.titleDistanceRowContainer}>
                  <Text
                    style={styles.hitModalTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {hit?.name ? hit.name : "Bathroom"}
                  </Text>
                  <Text style={styles.hitModalDistance}>
                    {hit?.latitude &&
                    hit?.longitude &&
                    currLoc?.latitude &&
                    currLoc?.longitude
                      ? convertDistance(
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
                        ).toFixed(1)
                      : "Distance Not Available"}{" "}
                    mi
                  </Text>
                </View>
                {hit?.trusted_store ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: -5,
                    }}
                  >
                    <Text
                      style={styles.hitModalStreet}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {hit?.street}
                    </Text>
                    <Text style={styles.hitTrustedStore}>Trusted Store</Text>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={styles.hitModalStreet}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {hit?.street}
                    </Text>
                  </View>
                )}

                <View>
                  <Text
                    style={styles.hitModalCity}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {hit?.city}
                  </Text>
                </View>
                <View>
                  {hit?.unisex == 1 ||
                  hit?.changing_table == 1 ||
                  hit?.accessible == 1 ? (
                    <View
                      style={[{ marginLeft: 10 }, styles.attributesContainer]}
                    >
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
                <Pressable
                  style={styles.seeMoreButton}
                  onPress={() => {
                    navigation.navigate("BathroomDetails", {
                      hit,
                      latitude: currLoc.latitude,
                      longitude: currLoc.longitude,
                      userData: userData,
                    });
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "ABold",
                      color: "white",
                      fontSize: 20,
                    }}
                  >
                    See details
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
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
    backgroundColor: "#1b263b",
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
    backgroundColor: "#1b263b",
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
    backgroundColor: "#1b263b",
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
    bottom: Dimensions.get("window").height * 0.19,
    right: 20,
    backgroundColor: "#e0e1dd",
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
    bottom: Dimensions.get("window").height * 0.19,
    left: 20,
    backgroundColor: "#e0e1dd",
    height: Dimensions.get("window").height * 0.06,
    width: Dimensions.get("window").height * 0.06,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0d1b2a",
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
    bottom: Dimensions.get("window").height * 0.19,
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
    bottom: Dimensions.get("window").height * 0.19,
    height: 40,
    alignSelf: "center",
    borderRadius: 40,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#415a77",
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
  updated_at: {
    fontFamily: "ARegular",
    fontSize: 13,
    color: "black",
    marginTop: 5,
  },
  distance: { fontFamily: "ARegular", fontSize: 14, color: "grey" },
  rating: { fontFamily: "Medium", fontSize: 13 },
  modalContainer: { padding: 10 },
  modalTitle: { fontFamily: "ABold", fontSize: 24, marginLeft: 10 },
  modalFlatlistContainer: { marginTop: 10 },
  FlatlistViewContainer: {
    marginHorizontal: 10,
    marginVertical: 5,
    paddingBottom: 10,
    borderBottomWidth: 0.25,
    borderColor: "grey",
  },
  tagContainer: {
    padding: 5,
    backgroundColor: "#b5e48c",
    marginRight: 5,
    borderRadius: 10,
  },
  title: { fontFamily: "ABold", fontSize: 18 },
  street: { fontFamily: "ARegular", fontSize: 18, color: "grey" },
  distance: { fontFamily: "ARegular", fontSize: 18, color: "black" },
  rating: { fontFamily: "Medium", fontSize: 13 },
  attributesContainer: {
    marginTop: 10,
  },
  attributes: { fontFamily: "ARegular", fontSize: 16, padding: 4 },

  hitModalContainer: { padding: 10 },
  hitModalTitle: {
    fontFamily: "ABold",
    fontSize: 22,
    marginLeft: 10,
    width: "70%",
  },
  hitModalStreet: {
    fontFamily: "ARegular",
    fontSize: 19,
    marginLeft: 10,
    marginTop: 5,
    width: "50%",
  },
  hitTrustedStore: {
    padding: 5,
    marginTop: 2,
    fontSize: 16,
    fontFamily: "ABold",
    backgroundColor: "gold",
    textAlign: "center",
    alignSelf: "center",
  },
  hitModalCity: {
    fontFamily: "ARegular",
    fontSize: 19,
    marginLeft: 10,
    marginTop: 5,
  },
  hitModalDistance: {
    fontFamily: "ABold",
    fontSize: 19,
    color: "black",
    marginRight: 10,
  },
  titleDistanceRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  seeMoreButton: {
    backgroundColor: "#415a77",
    paddingVertical: 20,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
});
