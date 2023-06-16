import React, { useCallback, useEffect, useState } from "react";
import { Text, View, StyleSheet, StatusBar } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { loadAsync } from "expo-font";
import * as Location from "expo-location";
import RootNavigation from "./src/navigation";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

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

        // location permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status != "granted") {
          setErrorMessage("Permission to access location was denied.");
        }
      } catch (e) {
        console.warn(e);
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
    <View style={styles.root} onLayout={onLayoutRootView}>
      <RootNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
