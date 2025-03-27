import React, { useEffect, useState } from "react";
import { Redirect, router } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/tasks");
    }
  }, [isLoggedIn]);
  const onButtonPress = () => {
    router.push("/auth" as any);
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title">TaskMinder.</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        A simple task manager for your phone.
      </ThemedText>
      <TouchableOpacity style={styles.button} onPress={onButtonPress}>
        <ThemedText type="title" style={styles.buttonText}>
          Get Started
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "blue",
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
  },
  subtitle: {
    marginTop: 10,
    color: "#666",
  },
});
