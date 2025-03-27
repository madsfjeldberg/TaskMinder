import React from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";

export const unstable_settings = {
  initialRouteName: "auth",
};

export const options = {
  headerShown: false,
};
export default function AuthLayout() {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={options}
        >
          <Stack.Screen name="auth" />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}