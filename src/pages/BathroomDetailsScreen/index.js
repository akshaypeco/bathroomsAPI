import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import MapView, { Marker } from "react-native-maps";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const BathroomDetailsScreen = ({ navigation, route }) => {
  const { hit, user } = route.params;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView>
        <View style={styles.titleAndFavoritesContainer}>
          <View style={{ width: "80%" }}>
            <Text style={styles.bathroomTitle}>{hit.name}</Text>
            <Text style={styles.updatedDate}>
              Last updated in {hit.updated_at.substring(0, 4)}
            </Text>
          </View>
          <View>
            <MaterialIcons
              name="favorite-border"
              size={26}
              color="black"
              style={{ marginRight: 20 }}
            />
            {/* <MaterialIcons name="favorite" size={24} color="black" /> */}
          </View>
        </View>
        <View
          style={{ flexDirection: "row", marginHorizontal: 20, marginTop: 10 }}
        >
          {hit.upvote ? (
            <View style={styles.upvoteContainer}>
              <Text style={styles.upvote}>{hit.upvote}</Text>
              <Feather
                name="thumbs-up"
                size={22}
                color="#008000"
                style={{ paddingLeft: 5 }}
              />
            </View>
          ) : null}
          {hit.downvote ? (
            <View style={styles.downvoteContainer}>
              <Text style={styles.downvote}>{hit.downvote}</Text>
              <Feather
                name="thumbs-down"
                size={22}
                color="#ad2e24"
                style={{ paddingLeft: 5 }}
              />
            </View>
          ) : null}
          {hit.upvote == 0 && hit.downvote == 0 ? (
            <Pressable
              style={styles.rateContainer}
              onPress={() => {
                navigation.navigate("AddRating", { hit });
              }}
            >
              <Text
                style={{ fontFamily: "Bold", fontSize: 15.5, color: "#0077b6" }}
              >
                Be the first to rate this bathroom {">"}
              </Text>
            </Pressable>
          ) : null}
        </View>
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

        <View style={styles.addressContainer}>
          <Text style={{ fontFamily: "Medium", fontSize: 15 }}>
            Address {">"}
          </Text>
          <Text style={styles.address}>
            {hit.street}, {hit.city} {hit.state}
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", marginHorizontal: 20, marginTop: 10 }}
        >
          {hit.accessible ? (
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>Accessible</Text>
            </View>
          ) : (
            <View style={[styles.tagContainer, { backgroundColor: "#e9ecef" }]}>
              <Text style={[styles.tagText, { color: "grey" }]}>
                Accessible
              </Text>
            </View>
          )}
          {hit.unisex ? (
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>Unisex</Text>
            </View>
          ) : (
            <View style={[styles.tagContainer, { backgroundColor: "#e9ecef" }]}>
              <Text style={[styles.tagText, { color: "grey" }]}>Unisex</Text>
            </View>
          )}
          {hit.changing_table ? (
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>Changing table</Text>
            </View>
          ) : (
            <View style={[styles.tagContainer, { backgroundColor: "#f5f3f4" }]}>
              <Text style={[styles.tagText, { color: "grey" }]}>
                Changing table
              </Text>
            </View>
          )}
        </View>
        {hit.directions ? (
          <View style={styles.directionsContainer}>
            <Text style={{ fontFamily: "Medium", fontSize: 16, color: "grey" }}>
              Description
            </Text>
            <Text style={styles.directions}>{hit.directions}</Text>
          </View>
        ) : null}
        {hit.comment ? (
          <View style={styles.commentContainer}>
            <Text style={{ fontFamily: "Medium", fontSize: 16, color: "grey" }}>
              Comment
            </Text>
            <Text style={styles.comment}>{hit.comment}</Text>
          </View>
        ) : null}
      </ScrollView>
      <TouchableOpacity
        style={styles.rateButtonContainer}
        onPress={() => {
          navigation.navigate("AddRating", { hit });
        }}
      >
        <Text style={styles.rateButtonText}>Rate</Text>
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
    borderRadius: 15,
  },
  bathroomTitle: {
    fontFamily: "Bold",
    fontSize: 25,
    marginLeft: 20,
    marginTop: 10,
  },
  upvoteContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#cfe1b9",
    borderWidth: 2,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginRight: 10,
  },
  upvote: { fontFamily: "Medium", fontSize: 16, color: "#008000" },
  downvoteContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ffcdb2",
    borderWidth: 2,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginRight: 10,
  },
  downvote: { fontFamily: "Medium", fontSize: 16, color: "#ad2e24" },
  rateContainer: {
    // backgroundColor: "#0077b6",
    // paddingVertical: 5,
    // paddingHorizontal: 8,
    // marginRight: 10,
  },
  updatedDate: {
    fontFamily: "Medium",
    fontSize: 15.5,
    marginLeft: 20,
    color: "grey",
  },
  addressContainer: {
    backgroundColor: "#f5f3f4",
    marginTop: 10,
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 5,
  },
  address: {
    fontFamily: "Medium",
    fontSize: 17,
  },
  tagContainer: {
    backgroundColor: "#b5e48c",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginRight: 10,
  },
  tagText: { fontFamily: "Medium", fontSize: 17 },
  directionsContainer: {
    marginTop: 15,
    marginHorizontal: 20,
  },
  directions: {
    fontFamily: "Medium",
    fontSize: 16,
  },
  commentContainer: {
    marginTop: 15,
    marginHorizontal: 20,
  },
  comment: {
    fontFamily: "Medium",
    fontSize: 16,
  },
  rateButtonContainer: {
    backgroundColor: "#0077b6",
    position: "absolute",
    bottom: "1%",
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 20,
  },
  rateButtonText: {
    fontFamily: "Bold",
    color: "white",
    fontSize: 20,
  },
});
