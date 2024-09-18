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
import { FontAwesome } from "@expo/vector-icons";
import { getBathroomReviews, getUser } from "../../../firebase";
import { convertDistance, getDistance } from "geolib";
import { useAuth } from "../../hooks/useAuth";

const BathroomDetailsScreen = ({ navigation, route }) => {
  const user = useAuth().user;
  const { hit } = route.params;
  const { userData } = route.params;
  const latitude = route.params.latitude;
  const longitude = route.params.longitude;
  const [reviews, setReviews] = useState();
  const [averageRating, setAverageRating] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      await getBathroomReviews(hit?.id).then((res) => {
        setReviews(res);
        console.log(userData);
        if (res.find((item) => item.username === userData.username)) {
          setUserHasReviewed(true);
        }
        var rating = 0;
        for (let i = 0; i < res.length; i++) {
          let thisUser = res[i];
          rating += thisUser.parentRating;
        }
        setAverageRating((rating / res.length).toFixed(1));
        setRefreshing(false);
      });
    }
    fetchData()
      .catch((e) => {
        console.log(e);
        setReviews([]);
      })
      .finally(() => setIsLoading(false));
  }, [user, hit, refreshing]);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(
      hit.street + ", " + hit.city + " " + hit.state
    ).then(Alert.alert("Address copied!"));
  };
  if (!isLoading) {
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
                  <Text style={styles.bathroomTitle}>
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
                {/* <Text style={styles.reportProblem}>Report a problem</Text> */}
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
                coordinate={{
                  latitude: hit.latitude,
                  longitude: hit.longitude,
                }}
              />
            </MapView>
          </View>

          <View>
            <Text style={styles.headers}>Bathroom info</Text>
            <View>
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
                      color: "grey",
                    }}
                  >
                    Copy
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
                  <Text style={[styles.tagText, { color: "grey" }]}>
                    Unisex
                  </Text>
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
          <TouchableOpacity
            style={[
              styles.reviewButtonContainer,
              {
                marginHorizontal: 20,
                marginTop: 10,
                backgroundColor: "#55a630",
              },
            ]}
          >
            <Text style={[styles.reviewButtonText, { fontSize: 16 }]}>
              Does this bathroom exist?
            </Text>
          </TouchableOpacity>
          {hit.directions ? (
            <View>
              <Text style={styles.subheaders}>Description</Text>
              <View style={styles.directionsContainer}>
                <Text style={styles.directions}>{hit.directions}</Text>
              </View>
            </View>
          ) : null}
          {hit.comment ? (
            <View>
              <Text style={styles.subheaders}>Comment</Text>
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
                    borderBottomWidth: 0.5,
                    borderColor: "black",
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
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ fontFamily: "ABold", fontSize: 15 }}>
                          {item.username}
                        </Text>
                        <Text
                          style={{
                            fontFamily: "ARegular",
                            fontSize: 13,
                            color: "grey",
                          }}
                        >
                          {months[item.review_month_created - 1]}{" "}
                          {item.review_year_created}
                        </Text>
                      </View>
                      <View
                        style={[
                          { marginTop: 0 },
                          item.comment && {
                            flexDirection: "row",
                            marginTop: 10,
                          },
                        ]}
                      >
                        <Text
                          style={{
                            fontFamily: "ARegular",
                            fontSize: 13,
                            width: "40%",
                          }}
                        >
                          {item.comment}
                        </Text>
                        <View>
                          <View style={styles.stars}>
                            <Text
                              style={{
                                fontFamily: "ARegular",
                                fontSize: 14,
                                marginRight: 10,
                                color: "grey",
                                width: 60,
                              }}
                            >
                              Overall
                            </Text>
                            <View>
                              <FontAwesome
                                name={
                                  item.parentRating >= 1 ? "star" : "star-o"
                                }
                                size={18}
                                style={
                                  item.parentRating >= 1
                                    ? styles.starSelected
                                    : styles.starUnselected
                                }
                              />
                            </View>
                            <View>
                              <FontAwesome
                                name={
                                  item.parentRating >= 2 ? "star" : "star-o"
                                }
                                size={18}
                                style={
                                  item.parentRating >= 2
                                    ? styles.starSelected
                                    : styles.starUnselected
                                }
                              />
                            </View>
                            <View>
                              <FontAwesome
                                name={
                                  item.parentRating >= 3 ? "star" : "star-o"
                                }
                                size={18}
                                style={
                                  item.parentRating >= 3
                                    ? styles.starSelected
                                    : styles.starUnselected
                                }
                              />
                            </View>
                            <View>
                              <FontAwesome
                                name={
                                  item.parentRating >= 4 ? "star" : "star-o"
                                }
                                size={18}
                                style={
                                  item.parentRating >= 4
                                    ? styles.starSelected
                                    : styles.starUnselected
                                }
                              />
                            </View>
                            <View>
                              <FontAwesome
                                name={
                                  item.parentRating >= 5 ? "star" : "star-o"
                                }
                                size={18}
                                style={
                                  item.parentRating >= 5
                                    ? styles.starSelected
                                    : styles.starUnselected
                                }
                              />
                            </View>
                          </View>
                          {item.is_clean > 0 && (
                            <View style={styles.stars}>
                              <Text
                                style={{
                                  fontFamily: "ARegular",
                                  fontSize: 14,
                                  marginRight: 10,
                                  color: "grey",
                                  width: 60,
                                }}
                              >
                                Clean
                              </Text>
                              <View>
                                <FontAwesome
                                  name={item.is_clean >= 1 ? "star" : "star-o"}
                                  size={14}
                                  style={
                                    item.is_clean >= 1
                                      ? styles.starSelected
                                      : styles.starUnselected
                                  }
                                  color={"#404C4B"}
                                />
                              </View>
                              <View>
                                <FontAwesome
                                  name={item.is_clean >= 2 ? "star" : "star-o"}
                                  size={14}
                                  style={
                                    item.is_clean >= 2
                                      ? styles.starSelected
                                      : styles.starUnselected
                                  }
                                  color={"#404C4B"}
                                />
                              </View>
                              <View>
                                <FontAwesome
                                  name={item.is_clean >= 3 ? "star" : "star-o"}
                                  size={14}
                                  style={
                                    item.is_clean >= 3
                                      ? styles.starSelected
                                      : styles.starUnselected
                                  }
                                  color={"#404C4B"}
                                />
                              </View>
                              <View>
                                <FontAwesome
                                  name={item.is_clean >= 4 ? "star" : "star-o"}
                                  size={14}
                                  style={
                                    item.is_clean >= 4
                                      ? styles.starSelected
                                      : styles.starUnselected
                                  }
                                  color={"#404C4B"}
                                />
                              </View>
                              <View>
                                <FontAwesome
                                  name={item.is_clean >= 5 ? "star" : "star-o"}
                                  size={14}
                                  style={
                                    item.is_clean >= 5
                                      ? styles.starSelected
                                      : styles.starUnselected
                                  }
                                  color={"#404C4B"}
                                />
                              </View>
                            </View>
                          )}
                          {item.wait_time > 0 && (
                            <View style={styles.stars}>
                              <Text
                                style={{
                                  fontFamily: "ARegular",
                                  fontSize: 14,
                                  marginRight: 10,
                                  color: "grey",
                                  width: 60,
                                }}
                              >
                                Wait
                              </Text>
                              <View>
                                <FontAwesome
                                  name={item.wait_time >= 1 ? "star" : "star-o"}
                                  size={14}
                                  style={
                                    item.wait_time >= 1
                                      ? styles.starSelected
                                      : styles.starUnselected
                                  }
                                  color={"#404C4B"}
                                />
                              </View>
                              <View>
                                <FontAwesome
                                  name={item.wait_time >= 2 ? "star" : "star-o"}
                                  size={14}
                                  style={
                                    item.wait_time >= 2
                                      ? styles.starSelected
                                      : styles.starUnselected
                                  }
                                  color={"#404C4B"}
                                />
                              </View>
                              <View>
                                <FontAwesome
                                  name={item.wait_time >= 3 ? "star" : "star-o"}
                                  size={14}
                                  style={
                                    item.wait_time >= 3
                                      ? styles.starSelected
                                      : styles.starUnselected
                                  }
                                  color={"#404C4B"}
                                />
                              </View>
                              <View>
                                <FontAwesome
                                  name={item.wait_time >= 4 ? "star" : "star-o"}
                                  size={14}
                                  style={
                                    item.wait_time >= 4
                                      ? styles.starSelected
                                      : styles.starUnselected
                                  }
                                  color={"#404C4B"}
                                />
                              </View>
                              <View>
                                <FontAwesome
                                  name={item.wait_time >= 5 ? "star" : "star-o"}
                                  size={14}
                                  style={
                                    item.wait_time >= 5
                                      ? styles.starSelected
                                      : styles.starUnselected
                                  }
                                  color={"#404C4B"}
                                />
                              </View>
                            </View>
                          )}
                          {item.is_stocked > 0 && (
                            <View style={styles.stars}>
                              <Text
                                style={{
                                  fontFamily: "ARegular",
                                  fontSize: 14,
                                  marginRight: 10,
                                  color: "grey",
                                  width: 60,
                                }}
                              >
                                Stocked
                              </Text>
                              <View>
                                <FontAwesome
                                  name={
                                    item.is_stocked >= 1 ? "star" : "star-o"
                                  }
                                  size={14}
                                  style={
                                    item.is_stocked >= 1
                                      ? styles.starSelected
                                      : styles.starUnselected
                                  }
                                  color={"#404C4B"}
                                />
                              </View>
                              <View>
                                <FontAwesome
                                  name={
                                    item.is_stocked >= 2 ? "star" : "star-o"
                                  }
                                  size={14}
                                  style={
                                    item.is_stocked >= 2
                                      ? styles.starSelected
                                      : styles.starUnselected
                                  }
                                  color={"#404C4B"}
                                />
                              </View>
                              <View>
                                <FontAwesome
                                  name={
                                    item.is_stocked >= 3 ? "star" : "star-o"
                                  }
                                  size={14}
                                  style={
                                    item.is_stocked >= 3
                                      ? styles.starSelected
                                      : styles.starUnselected
                                  }
                                  color={"#404C4B"}
                                />
                              </View>
                              <View>
                                <FontAwesome
                                  name={
                                    item.is_stocked >= 4 ? "star" : "star-o"
                                  }
                                  size={14}
                                  style={
                                    item.is_stocked >= 4
                                      ? styles.starSelected
                                      : styles.starUnselected
                                  }
                                  color={"#404C4B"}
                                />
                              </View>
                              <View>
                                <FontAwesome
                                  name={
                                    item.is_stocked >= 5 ? "star" : "star-o"
                                  }
                                  size={14}
                                  style={
                                    item.is_stocked >= 5
                                      ? styles.starSelected
                                      : styles.starUnselected
                                  }
                                  color={"#404C4B"}
                                />
                              </View>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                }
              })}
              {reviews?.length == 0 && (
                <Pressable
                  onPress={() => {
                    navigation.navigate("AddRating", { hit });
                  }}
                  style={{
                    backgroundColor: "#f5f3f4",
                    padding: 10,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "ARegular",
                      fontSize: 15.5,
                      color: "grey",
                    }}
                  >
                    There are no reviews for this bathroom yet.
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
          <View style={{ paddingBottom: 100 }}></View>
        </ScrollView>
        {!userHasReviewed && (
          <TouchableOpacity
            style={[
              styles.reviewButtonContainer,
              { marginHorizontal: 140, marginBottom: 20, borderRadius: 20 },
            ]}
            onPress={() => {
              Haptics.impactAsync();
              navigation.navigate("AddRating", { hit });
            }}
          >
            <Text style={styles.reviewButtonText}>Review</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  }
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
    fontSize: 25,
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 4,
  },
  subheaders: {
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
    fontSize: 18,
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
    fontSize: 16,
  },
  distance: {
    fontFamily: "ARegular",
    fontSize: 16,
    marginTop: 3,
    color: "grey",
  },
  tagContainer: {
    backgroundColor: "#b5e48c",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 10,
  },
  tagText: { fontFamily: "ARegular", fontSize: 16 },
  directionsContainer: {
    marginHorizontal: 20,
  },
  directions: {
    fontFamily: "ARegular",
    fontSize: 18,
  },
  commentContainer: {
    marginHorizontal: 20,
  },
  comment: {
    fontFamily: "ARegular",
    fontSize: 18,
  },
  reviewContainer: {
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingBottom: 20,
    marginTop: 6,
  },
  reviews: {
    marginTop: 6,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f5f3f4",
  },
  reviewButtonContainer: {
    backgroundColor: "#415a77",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  reviewButtonText: {
    fontFamily: "ABold",
    color: "white",
    fontSize: 20,
  },
  stars: {
    flexDirection: "row",
    marginBottom: 8,
    marginLeft: 10,
    alignItems: "center",
  },
});
