import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import "react-native-reanimated";
import { View } from "react-native";
import { TitleBar } from "@/components/TitleBar";
import { Feather } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import {
  DrawerItemList,
  DrawerItem,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import auth from "@/database/auth";
import { periodicLocationUpdate } from "@/util/location";


export default function MainLayout() {
  const router = useRouter();

  useEffect(() => {
    const locationUpdate = async () => {
      await periodicLocationUpdate();
    };
    locationUpdate();
  }, []);
  

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
    <>
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
    </>
  );
}
