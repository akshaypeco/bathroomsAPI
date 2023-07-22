import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { getBathroomReviews } from "../../../firebase";
import { convertDistance, getDistance } from "geolib";

const BathroomDetailsScreen = ({ navigation, route }) => {
  const { hit } = route.params;
  const latitude = route.params.latitude;
  const longitude = route.params.longitude;
  const [reviews, setReviews] = useState();
  const [averageRating, setAverageRating] = useState();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      await getBathroomReviews(hit.id).then((res) => {
        setReviews(res);
        var rating = 0;
        for (let i = 0; i < res.length; i++) {
          let thisUser = res[i];
          let thisRating =
            (thisUser.is_clean + thisUser.is_stocked + thisUser.wait_time) / 3;
          rating += thisRating;
          console.log();
        }
        setAverageRating((rating / res.length).toFixed(1));
        setRefreshing(false);
      });
    }
    fetchData().catch((e) => {
      console.log(e);
    });
  }, [hit, refreshing]);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(
      hit.street + ", " + hit.city + " " + hit.state
    ).then(Alert.alert("Address copied!"));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
            }}
          />
        }
      >
        <View style={styles.titleAndFavoritesContainer}>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "70%" }}>
                <Text style={styles.bathroomTitle}>{hit.name}</Text>
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
                        latitude: latitude,
                        longitude: longitude,
                      }
                    ),
                    "mi"
                  ).toFixed(1)}{" "}
                  miles away
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.updatedDate}>
                Edited in {hit.updated_at.substring(0, 4)}
              </Text>
              <Text style={styles.reportProblem}>Report a problem</Text>
            </View>
          </View>
        </View>

        {reviews?.length > 0 ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 20,
              marginTop: 5,
            }}
          >
            <FontAwesome name="star" size={18} color="black" />
            <Text
              style={{ fontFamily: "ARegular", fontSize: 14, marginLeft: 3 }}
            >
              {averageRating}
            </Text>
            <Text
              style={{ fontFamily: "ARegular", fontSize: 14, marginLeft: 2 }}
            >
              ({reviews?.length})
            </Text>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 20,
              marginTop: 5,
            }}
          >
            <FontAwesome name="star" size={18} color="black" />
            <Text
              style={{ fontFamily: "ARegular", fontSize: 14, marginLeft: 3 }}
            >
              0
            </Text>
            <Text
              style={{ fontFamily: "ARegular", fontSize: 14, marginLeft: 2 }}
            >
              (No reviews)
            </Text>
          </View>
        )}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={{
              latitude: hit.latitude,
              longitude: hit.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled="False"
            zoomEnabled="False"
          >
            <Marker
              coordinate={{ latitude: hit.latitude, longitude: hit.longitude }}
            />
          </MapView>
        </View>

        <View>
          <Text style={styles.headers}>Bathrooms details</Text>
          <View>
            {/* <Text style={styles.headers}>Address</Text> */}
            <Pressable
              style={styles.addressContainer}
              onPress={copyToClipboard}
            >
              <Text style={styles.address}>
                {hit.street}, {hit.city} {hit.state}
              </Text>
              <View style={{ marginTop: 5 }}>
                <Text
                  style={{
                    fontFamily: "ABold",
                    fontSize: 12,
                  }}
                >
                  Click to copy
                </Text>
              </View>
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 20,
              marginTop: 10,
            }}
          >
            {hit.unisex ? (
              <View style={styles.tagContainer}>
                <Text style={styles.tagText}>Unisex</Text>
              </View>
            ) : (
              <View
                style={[styles.tagContainer, { backgroundColor: "#f5f3f4" }]}
              >
                <Text style={[styles.tagText, { color: "grey" }]}>Unisex</Text>
              </View>
            )}
            {hit.accessible ? (
              <View style={styles.tagContainer}>
                <Text style={styles.tagText}>Accessible</Text>
              </View>
            ) : (
              <View
                style={[styles.tagContainer, { backgroundColor: "#f5f3f4" }]}
              >
                <Text style={[styles.tagText, { color: "grey" }]}>
                  Accessible
                </Text>
              </View>
            )}
            {hit.changing_table ? (
              <View style={styles.tagContainer}>
                <Text style={styles.tagText}>Changing table</Text>
              </View>
            ) : (
              <View
                style={[styles.tagContainer, { backgroundColor: "#f5f3f4" }]}
              >
                <Text style={[styles.tagText, { color: "grey" }]}>
                  Changing table
                </Text>
              </View>
            )}
          </View>
        </View>

        {hit.directions ? (
          <View>
            <Text style={styles.headers}>Description</Text>
            <View style={styles.directionsContainer}>
              <Text style={styles.directions}>{hit.directions}</Text>
            </View>
          </View>
        ) : null}
        {hit.comment ? (
          <View>
            <Text style={styles.headers}>Comment</Text>
            <View style={styles.commentContainer}>
              <Text style={styles.comment}>{hit.comment}</Text>
            </View>
          </View>
        ) : null}
        <View>
          <Text style={styles.headers}>Reviews</Text>
          {reviews?.length > 0 && (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 20,
                  marginTop: 5,
                  paddingBottom: 7,
                  borderBottomWidth: 1,
                  borderColor: "lightgrey",
                }}
              >
                <Text
                  style={{
                    fontFamily: "ARegular",
                    fontSize: 35,
                    marginLeft: 3,
                  }}
                >
                  {averageRating}{" "}
                  <Text style={{ fontSize: 18 }}>/ 5 ({reviews.length})</Text>
                </Text>
              </View>
            </View>
          )}
          <View style={styles.reviewContainer}>
            {reviews?.map(function (item, index) {
              if (item.approved) {
                return (
                  <View style={styles.reviews} key={index}>
                    <Text>Hello</Text>
                  </View>
                  // <View style={styles.reviews} key={index}>
                  //   <View
                  //     style={{
                  //       flexDirection: "row",
                  //       justifyContent: "space-evenly",
                  //       marginVertical: 5,
                  //       alignItems: "center",
                  //     }}
                  //   >
                  //     <View
                  //       style={{
                  //         backgroundColor: "white",
                  //         padding: 5,
                  //         borderRadius: 10,
                  //       }}
                  //     >
                  //       <Text
                  //         style={{ fontFamily: "ABold", textAlign: "center" }}
                  //       >
                  //         {item.created_at.substring(5, 7)}
                  //         {" / "}
                  //         {item.created_at.substring(0, 4)}
                  //       </Text>
                  //     </View>
                  //     <View>
                  //       <Text
                  //         style={{
                  //           fontFamily: "ABold",
                  //           fontSize: 14,
                  //         }}
                  //       >
                  //         Clean
                  //       </Text>
                  //       <Text
                  //         style={{ fontFamily: "ARegular", textAlign: "center" }}
                  //       >
                  //         <Text style={{ fontSize: 18 }}>{item.is_clean}</Text>/5
                  //       </Text>
                  //     </View>
                  //     <View>
                  //       <Text
                  //         style={{
                  //           fontFamily: "ABold",
                  //           fontSize: 14,
                  //         }}
                  //       >
                  //         Short wait
                  //       </Text>
                  //       <Text
                  //         style={{ fontFamily: "ARegular", textAlign: "center" }}
                  //       >
                  //         <Text style={{ fontSize: 18 }}>{item.wait_time}</Text>/5
                  //       </Text>
                  //     </View>
                  //     <View>
                  //       <Text
                  //         style={{
                  //           fontFamily: "ABold",
                  //           fontSize: 14,
                  //         }}
                  //       >
                  //         Stocked
                  //       </Text>
                  //       <Text
                  //         style={{ fontFamily: "ARegular", textAlign: "center" }}
                  //       >
                  //         <Text style={{ fontSize: 18 }}>{item.is_stocked}</Text>
                  //         /5
                  //       </Text>
                  //     </View>
                  //   </View>
                  //   <Text
                  //     style={{
                  //       fontFamily: "ABold",
                  //       color: "grey",
                  //       paddingLeft: 10,
                  //     }}
                  //   >
                  //     Comment
                  //   </Text>
                  //   <Text
                  //     style={{
                  //       fontFamily: "ARegular",
                  //       paddingHorizontal: 10,
                  //       paddingBottom: 10,
                  //     }}
                  //   >
                  //     {item.comment}
                  //   </Text>
                  // </View>
                );
              }
            })}
            {reviews?.length == 0 && (
              <Pressable
                onPress={() => {
                  navigation.navigate("AddRating", { hit });
                }}
              >
                <Text
                  style={{
                    fontFamily: "ARegular",
                    fontSize: 30,
                  }}
                >
                  0
                </Text>
                <Text
                  style={{
                    fontFamily: "ARegular",
                    fontSize: 16.5,
                    color: "grey",
                  }}
                >
                  Add a review
                </Text>
              </Pressable>
            )}
          </View>
        </View>
        <View style={{ paddingBottom: 100 }}></View>
      </ScrollView>
      <TouchableOpacity
        style={styles.reviewButtonContainer}
        onPress={() => {
          Haptics.selectionAsync();
          navigation.navigate("AddRating", { hit });
        }}
      >
        <Text style={styles.reviewButtonText}>Review</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default BathroomDetailsScreen;

const styles = StyleSheet.create({
  titleAndFavoritesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mapContainer: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "90%",
    height: 200,
    borderRadius: 5,
  },
  bathroomTitle: {
    fontFamily: "ABold",
    fontSize: 21,
    marginLeft: 20,
  },
  headers: {
    fontFamily: "ABold",
    fontSize: 18,
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 4,
  },
  reportProblem: {
    fontFamily: "ABold",
    color: "grey",
    textDecorationLine: "underline",
    marginLeft: 10,
    marginTop: 3,
  },
  upvoteContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  upvote: { fontFamily: "Medium", fontSize: 16, color: "#008000" },
  downvoteContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  downvote: { fontFamily: "Medium", fontSize: 16, color: "#ad2e24" },

  updatedDate: {
    fontFamily: "ARegular",
    fontSize: 15,
    marginLeft: 20,
    marginTop: 3,
    color: "grey",
  },
  addressContainer: {
    backgroundColor: "#f5f3f4",
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 5,
  },
  address: {
    fontFamily: "ARegular",
    fontSize: 15.5,
  },
  distance: {
    fontFamily: "ARegular",
    fontSize: 15,
    marginTop: 3,
    color: "grey",
  },
  tagContainer: {
    backgroundColor: "#b5e48c",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  tagText: { fontFamily: "ARegular", fontSize: 15 },
  directionsContainer: {
    marginHorizontal: 20,
  },
  directions: {
    fontFamily: "ARegular",
    fontSize: 15,
  },
  commentContainer: {
    marginHorizontal: 20,
  },
  comment: {
    fontFamily: "ARegular",
    fontSize: 15.5,
  },
  reviewContainer: { marginHorizontal: 20 },
  reviews: {
    // borderColor: "#e5e5e5",
    // borderBottomWidth: 1,
    // borderTopWidth: 1,
    marginTop: 6,
    padding: 6,
    borderRadius: 5,
  },
  reviewButtonContainer: {
    backgroundColor: "black",
    position: "absolute",
    bottom: "1%",
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 20,
  },
  reviewButtonText: {
    fontFamily: "ABold",
    color: "white",
    fontSize: 18,
  },
});
