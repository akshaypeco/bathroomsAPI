import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { AntDesign } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { reverseGeocodeAsync } from "expo-location";
import { useAuth } from "../../hooks/useAuth";

const AddBathroomScreen = ({ navigation, route }) => {
  const { latitude, longitude } = route.params;
  const { user } = useAuth();
  const [address, setAddress] = useState();

  useEffect(() => {
    async function fetchData() {
      const startingLoc = await reverseGeocodeAsync({
        latitude: latitude,
        longitude: longitude,
      }).then((res) => setAddress(res[0]));
    }

    fetchData()
      .catch((e) => console.log(e))
      .finally(() => {
        console.log("Fetched original address successfully.");
      });
  }, []);

  const handleRegionChange = async (latitude, longitude) => {
    const newLoc = await reverseGeocodeAsync({
      latitude: latitude,
      longitude: longitude,
    }).then((res) => {
      setAddress(res[0]);
    });
  };

  return (
    <SafeAreaView>
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
                handleRegionChange(region.latitude, region.longitude);
              }}
              showsUserLocation={true}
            ></MapView>
            <View style={styles.markerFixed}>
              <Foundation name="marker" size={30} color="#d2482d" />
            </View>
          </View>
          <View style={styles.addressContainer}>
            <Text style={styles.address}>
              {address?.streetNumber} {address?.street}, {address?.city}{" "}
              {address?.region} {address?.postalCode}
            </Text>
          </View>
          <View>
            <Text>Title</Text>
          </View>
          <View>
            <Text>Description</Text>
          </View>
          <View>
            <Text>Comment</Text>
          </View>
          <View>
            <Text>Details</Text>
          </View>
        </View>
      ) : (
        <View style={{ marginHorizontal: 20, marginTop: 20 }}>
          <Text style={{ fontFamily: "ABold", fontSize: 15.5 }}>
            Register to add and review bathrooms. Create an account by logging
            out.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AddBathroomScreen;

const styles = StyleSheet.create({
  header: {
    fontFamily: "ABold",
    fontSize: 24,
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
    borderWidth: 1,
    borderColor: "grey",
    marginHorizontal: 30,
    borderRadius: 5,
  },
  address: { fontFamily: "ARegular", fontSize: 15.5 },
});
