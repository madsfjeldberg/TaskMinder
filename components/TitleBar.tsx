import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

interface TitleBarProps {
  title?: string;
  onProfilePress?: () => void;
}

export function TitleBar({
  title = "TaskMinder.",
  onProfilePress = () => console.log("Profile pressed"),
}: TitleBarProps) {
  const insets = useSafeAreaInsets();

  // Calculate the total height including status bar
  const statusBarHeight =
    Platform.OS === "ios" ? insets.top : StatusBar.currentHeight || 0;
  const totalHeight = statusBarHeight + 40; // 60px for the actual title bar content

  return (
    <View style={[styles.container, { height: totalHeight }]}>
      <View
        style={[styles.statusBarPlaceholder, { height: statusBarHeight }]}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>

        <Pressable
          style={styles.profileButton}
          onPress={onProfilePress}
          android_ripple={{ color: "rgba(255,255,255,0.2)", borderless: true }}
        >
          <Feather name="user" size={28} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#3498db",
  },
  statusBarPlaceholder: {
    width: "100%",
  },
  titleContainer: {
    height: 30,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
