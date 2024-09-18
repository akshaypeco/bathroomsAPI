import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
  PixelRatio,
  Image,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { loadAsync } from "expo-font";
import * as Location from "expo-location";
import RootNavigation from "./src/navigation/RootNavigation";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [sliderState, setSliderState] = useState({ currentPage: 0 });
  const { width, height } = Dimensions.get("window");
  const [appIsReady, setAppIsReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const scrollViewRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [onboarding, setOnboarding] = useState(false);

  const setSliderPage = (event) => {
    const { currentPage } = sliderState;
    const { x } = event.nativeEvent.contentOffset;
    const indexOfNextScreen = Math.floor(x / width);
    if (indexOfNextScreen !== currentPage) {
      setSliderState({
        ...sliderState,
        currentPage: indexOfNextScreen,
      });
    }
  };

  const handleNextSlide = async (phrase = "") => {
    // Assuming you've already initialized the loading state using useState
    setLoading(true); // Start showing the loading indicator

    if (phrase === "") {
      if (currentPage < 3 - 1) {
        const nextPage = currentPage + 1;
        scrollViewRef.current.scrollTo({ x: nextPage * width, animated: true });
        setCurrentPage(nextPage);
      }
      setLoading(false); // Hide the loading indicator after the slide moves
    } else if (phrase === "locationServices") {
      console.log("requesting location");

      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const nextPage = currentPage + 1;

          setCurrentPage(nextPage);

          // After updating the state, use scrollTo to move to the next page
          setTimeout(() => {
            scrollViewRef.current.scrollTo({
              x: nextPage * width,
              animated: true,
            });
          }, 300); // Slight delay to ensure the state update is complete
        } else {
          setErrorMessage("Permission to access location was denied.");
        }
      } catch (error) {
        console.error("Error requesting location permission: ", error);
      } finally {
        setLoading(false); // Ensure loading is hidden whether the request was successful or failed
      }
    } else if (phrase === "completion") {
      await AsyncStorage.setItem("hasSeenWelcome", "true").then(
        setOnboarding(true)
      );
    }
  };

  const { currentPage: pageIndex } = sliderState;

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts
        await loadAsync({
          Bold: require("./src/assets/fonts/UberMoveBold.otf"),
          Medium: require("./src/assets/fonts/UberMoveMedium.otf"),
          ABold: require("./src/assets/fonts/AeonikTRIAL-Bold.otf"),
          ALight: require("./src/assets/fonts/AeonikTRIAL-Light.otf"),
          ARegular: require("./src/assets/fonts/AeonikTRIAL-Regular.otf"),
        });
        const hasSeenWelcome = await AsyncStorage.getItem("hasSeenWelcome");
        if (hasSeenWelcome) {
          setOnboarding(true);
        }

        // // location permissions
        // let { status } = await Location.requestForegroundPermissionsAsync();
        // if (status !== "granted") {
        //   setErrorMessage("Permission to access location was denied.");
        // }
      } catch (e) {
        console.warn(e);
        setErrorMessage(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <View style={styles.root} onLayout={onLayoutRootView}>
        {/* <StatusBar barStyle={"dark-content"} />
      {errorMessage ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Oops!</Text>
          <Text>
            Please allow the app to access your location while in use. To do
            this, navigate to the settings app.
          </Text>
        </View>
      ) : (
        <RootNavigation />
      )} */}
        <StatusBar barStyle="light-content" />
        {onboarding ? (
          <RootNavigation />
        ) : (
          // <View
          //   style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          // >
          //   <Text>Oops!</Text>
          //   <Text>
          //     Please allow the app to access your location while in use. To do
          //     this, navigate to the settings app.
          //   </Text>
          // </View>
          <SafeAreaView style={{ marginTop: 40 }}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false} // Disable manual scroll to handle it programmatically
              onMomentumScrollEnd={(e) => {
                const pageIndex = Math.floor(
                  e.nativeEvent.contentOffset.x / width
                );
                setCurrentPage(pageIndex);
              }}
              scrollEventThrottle={16}
              onScroll={(event) => {
                setSliderPage(event);
              }}
            >
              <View style={{ width, height }}>
                <View style={styles.wrapper}>
                  <Text style={styles.header}>Gotta go?</Text>
                  <Image
                    source={require("./assets/Toilet.png")}
                    style={styles.imageStyle}
                  />
                  <Text style={styles.paragraph}>
                    Stressless bathroom experiences on the go:
                  </Text>
                  <View style={styles.bulletsContainer}>
                    <Text style={styles.bulletPoint}>
                      • 59,000+ bathrooms across the world
                    </Text>
                    <Text style={styles.bulletPoint}>
                      • Bathrooms are added and reviewed by real people
                    </Text>
                    <Text style={styles.bulletPoint}>
                      • Filter for accessibility, changing tables, gender
                      neutrality and more
                    </Text>
                  </View>
                  <View style={styles.buttonWrapper}>
                    <TouchableOpacity
                      style={styles.buttonContainer}
                      onPress={() => {
                        handleNextSlide();
                      }}
                    >
                      <Text style={styles.buttonText}>Get started</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={{ width, height }}>
                <View style={styles.wrapper}>
                  <Text style={styles.header}>Location services</Text>
                  <FontAwesome
                    style={{ marginTop: 75, marginBottom: 50 }}
                    name="location-arrow"
                    size={125}
                    color="black"
                  />
                  <Text style={styles.paragraph}>
                    To use this app, please enable location services for:
                  </Text>
                  <View style={styles.bulletsContainer}>
                    <Text style={styles.bulletPoint}>
                      • Providing relevant bathrooms
                    </Text>
                    <Text style={styles.bulletPoint}>
                      • Adding new locations and reviews
                    </Text>
                  </View>
                  {/* Conditionally show ActivityIndicator or TouchableOpacity */}
                  <View style={styles.buttonWrapper}>
                    {loading ? (
                      <ActivityIndicator size="large" color="black" /> // Spinner
                    ) : (
                      <TouchableOpacity
                        style={styles.buttonContainer}
                        onPress={() => handleNextSlide("locationServices")}
                      >
                        <Text style={styles.buttonText}>Allow</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
              <View style={{ width, height }}>
                <View style={styles.wrapper}>
                  <Text style={styles.header}>
                    Create an account, or continue as a guest
                  </Text>
                  <MaterialCommunityIcons
                    style={{ marginTop: 75, marginBottom: 50 }}
                    name="account"
                    size={125}
                    color="black"
                  />
                  <View>
                    <Text style={styles.paragraph}>
                      Creating an account lets you
                    </Text>
                    <View
                      style={[
                        styles.bulletsContainer,
                        { marginLeft: 0, alignSelf: "center" },
                      ]}
                    >
                      <Text style={styles.bulletPoint}>
                        • Add and review bathrooms
                      </Text>
                      <Text style={styles.bulletPoint}>
                        • Save bathrooms that you like
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text style={[{ marginTop: 15 }, styles.paragraph]}>
                      As a guest, you can still
                    </Text>
                    <View
                      style={[
                        styles.bulletsContainer,
                        { marginLeft: 0, alignSelf: "center" },
                      ]}
                    >
                      <Text style={styles.bulletPoint}>
                        • Find a bathroom and view all its info
                      </Text>
                      <Text style={styles.bulletPoint}>
                        • Report problems and inaccurate locations
                      </Text>
                    </View>
                  </View>
                  <View style={styles.buttonWrapper}>
                    <TouchableOpacity
                      style={styles.buttonContainer}
                      onPress={() => {
                        handleNextSlide("completion");
                      }}
                    >
                      <Text style={styles.buttonText}>Let's go!</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
            <View style={styles.paginationWrapper}>
              {Array.from(Array(3).keys()).map((key, index) => (
                <View
                  style={[
                    styles.paginationDots,
                    { opacity: pageIndex === index ? 1 : 0.2 },
                  ]}
                  key={index}
                />
              ))}
            </View>
          </SafeAreaView>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "white",
  },
  imageStyle: {
    height: 300,
    width: 300,
    alignSelf: "center",
  },
  wrapper: {
    flex: 1, // Ensure content takes remaining space
    alignItems: "center",
    marginVertical: 30,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginHorizontal: 10,
    color: "black",
    fontFamily: "ABold",
  },
  paragraph: {
    fontSize: 20,
    color: "black",
    fontFamily: "ABold",
    marginHorizontal: 30,
    textAlign: "center",
  },
  bulletsContainer: {
    padding: 20,
    alignSelf: "flex-start",
    marginLeft: 30,
  },
  bulletPoint: {
    fontSize: 18,
    fontFamily: "ARegular",
    color: "black",
    marginBottom: 10,
  },
  buttonWrapper: {
    position: "absolute",
    bottom: 100, // Adjusted bottom value to position the button above pagination
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    backgroundColor: "#e0e1dd",
    paddingHorizontal: 35,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: "ARegular",
    color: "black",
    fontSize: 18,
  },
  paginationWrapper: {
    position: "absolute",
    bottom: 50, // Keep pagination lower than the button
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  paginationDots: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "black",
    marginLeft: 10,
  },
});
