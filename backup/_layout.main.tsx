import React from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";
import { TitleBar } from "@/components/TitleBar";
import { Feather } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import {
  DrawerItemList,
  DrawerItem,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { auth } from "@/database/auth";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function MainLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });
  const router = useRouter();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  function CustomDrawerContent(props: any) {
    return (
      <View style={{ flex: 1 }}>
        <DrawerContentScrollView {...props} style={{ flex: 1 }}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
        <View style={{ padding: 16 }}>
          <DrawerItem
            label="Log Out"
            icon={() => <Feather name="log-out" size={24} color="#e74c3c" />}
            onPress={async () => {
              await auth.logout();
              props.navigation.closeDrawer();
              router.replace("/");
            }}
            labelStyle={{ color: "#e74c3c" }}
          />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Drawer
          screenOptions={{
            headerShown: true,
            header: () => <TitleBar />,
            drawerPosition: "right",
            drawerStyle: {
              width: 250,
            },
          }}
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen
            name="tasks"
            options={{
              drawerLabel: "Tasks",
              drawerIcon: ({ color }) => (
                <Feather name="list" size={24} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="settings"
            options={{
              drawerLabel: "Settings",
              drawerIcon: ({ color }) => (
                <Feather name="settings" size={24} color={color} />
              ),
            }}
          />
        </Drawer>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
