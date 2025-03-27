import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { View, StyleSheet } from "react-native";
import LoginScreen from "react-native-login-screen";

export default function Auth() {
  return (
    <View style={styles.container}>
      <LoginScreen
        logoImageSource={require("@/assets/images/logo.png")}
        onLoginPress={() => {}}
        onSignupPress={() => {}}
        onEmailChange={() => {}}
        onPasswordChange={() => { }}
        enablePasswordValidation
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
