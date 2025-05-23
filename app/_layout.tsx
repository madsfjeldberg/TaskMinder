import React from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useRootNavigation, Slot } from "expo-router";
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

import { Session } from "@supabase/supabase-js";
import { supabase } from "@/database/supabase";
import Auth from "@/components/custom/Auth";
import { HoldMenuProvider } from "react-native-hold-menu";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const { user, loading } = useAuth();
  const router = useRouter();
  const rootNavigation = useRootNavigation();
  const [session, setSession] = React.useState<Session | null>(null);
  

  useEffect(() => {
      if (loaded) {
        SplashScreen.hideAsync();
  
        supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
      })
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
      }
    }, [loaded]);

  useEffect(() => {
    if (loading || !rootNavigation?.isReady()) return;

    // If we can't go back, we're at the root
    const isRoot = !router.canGoBack();

    if (!user && !isRoot) {
      // Redirect to the sign-in page.
      router.replace("/");
    } else if (user && isRoot) {
      // Redirect away from the sign-in page.
      router.replace("/tasks");
    }
  }, [user, loading, router, rootNavigation]);

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
          <HoldMenuProvider theme="light" safeAreaInsets={{ top: 50, bottom: 50, left: 50, right: 50 }}>
            <Slot />
            </HoldMenuProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
      </SafeAreaProvider>
      </GestureHandlerRootView>
  );
}
