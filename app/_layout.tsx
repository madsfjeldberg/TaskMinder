import React from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { useRouter, Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, ActivityIndicator } from "react-native";
import "react-native-gesture-handler";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/hooks/useAuth";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
    }, [loaded]);

  useEffect(() => {
    // If we can't go back, we're at the root
    const isRoot = !router.canGoBack();

    if (!user && !isRoot) {
      // Redirect to the sign-in page.
      router.replace("/");
    } else if (user && isRoot) {
      // Redirect away from the sign-in page.
      router.replace("/tasks");
    }
  }, [user, loading, router]);

  if (!loaded || loading) {
    return (
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
          <StatusBar style="auto" />
          </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Slot />
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
