import React from "react";
import Auth from "@/components/custom/Auth";
import { SafeAreaView, KeyboardAvoidingView, StyleSheet, Platform } from "react-native";

export default function Index() { 
  return (
  <SafeAreaView style={styles.safeArea}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Auth />
    </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  container: {
    flex: 1
  }
})