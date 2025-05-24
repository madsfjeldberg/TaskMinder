import React, { useState } from "react";
import '@expo/metro-runtime';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { getErrorMessage } from "@/util/utils";
import CustomAlert from "@/components/custom/CustomAlert";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import auth from "@/database/auth";
import { AppState } from "react-native";
import { supabase } from "@/database/supabase";

const TOGGLE_WIDTH = 300;
const TOGGLE_HEIGHT = 44;

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const [email, setEmail] = useState("madsfjelle@gmail.com");
  const [password, setPassword] = useState("jvuhnhfr");
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertBody, setAlertBody] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [buttonText, setButtonText] = useState("Login");

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const togglePosition = useSharedValue(0);
  const buttonTextOpacity = useSharedValue(1);

  const showAlert = (title: string, body: string) => {
    setAlertTitle(title);
    setAlertBody(body);
    setAlertVisible(true);
  };

  const toggleAuth = () => {
    setIsLogin(!isLogin);
    // Fade out
    buttonTextOpacity.value = withTiming(0, { duration: 150 }, () => {
      // Update text
      runOnJS(setButtonText)(isLogin ? "Create Account" : "Login");
      // Fade in
      buttonTextOpacity.value = withTiming(1, { duration: 150 });
    });
    // slide login / signup button
    togglePosition.value = withSpring(isLogin ? (TOGGLE_WIDTH - 8) / 2 : 0, {
      damping: 15,
      stiffness: 100,
    });
  };

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isLogin) {
        await auth.login(email, password);
        router.replace("/tasks");
      } else {
        await auth.register(email, password);
        router.replace("/tasks");
        showAlert("Success", "You have successfully created an account!");
      }
    } catch (e: any) {
      const err = e;
      console.log(err);
      showAlert(
        isLogin ? "Sign in failed" : "Registration Failed",
        getErrorMessage(err)
      );
    } finally {
      setLoading(false);
    }
  };

  const loginStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
      position: "absolute",
      width: "100%",
    };
  });

  const registerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
      position: "absolute",
      width: "100%",
    };
  });

  const toggleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: togglePosition.value }],
    };
  });

  const buttonTextStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonTextOpacity.value,
    };
  });

  return (
    <>
        <View style={styles.content}>
          <ThemedText type="title">
            <Text style={styles.title}>TaskMinder.</Text>
          </ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Organize your tasks, one at a time.
          </ThemedText>

          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={styles.toggleBackground}
              onPress={toggleAuth}
              activeOpacity={1}
            >
              <Animated.View style={[styles.toggleSlider, toggleStyle]} />
              <View style={styles.toggleLabels}>
                <Text
                  style={[
                    styles.toggleLabel,
                    isLogin && styles.toggleLabelActive,
                  ]}
                >
                  Login
                </Text>
                <Text
                  style={[
                    styles.toggleLabel,
                    !isLogin && styles.toggleLabelActive,
                  ]}
                >
                  Sign Up
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.formContainer, { height: 300 }]}>
            <Animated.View style={[styles.form, loginStyle]}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Email"
                placeholderTextColor="#666"
              />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Password"
                placeholderTextColor="#666"
              />

              {loading ? (
                <ActivityIndicator
                  size="large"
                  color="#007AFF"
                  style={styles.loader}
                />
              ) : (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleAuth}
                  >
                    <Animated.Text
                      style={[styles.primaryButtonText, buttonTextStyle]}
                    >
                      {buttonText}
                    </Animated.Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>

            <Animated.View style={[styles.form, registerStyle]}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Email"
              />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Password"
              />

              {loading ? (
                <ActivityIndicator
                  size="large"
                  color="#007AFF"
                  style={styles.loader}
                />
              ) : (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleAuth}
                  >
                    <Animated.Text
                      style={[styles.primaryButtonText, buttonTextStyle]}
                    >
                      {buttonText}
                    </Animated.Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          </View>
        </View>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        body={alertBody}
        onClose={() => setAlertVisible(false)}
      />
      </>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    color: "#007AFF",
    marginBottom: 8,
    lineHeight: 50,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    color: "#666",
  },
  formContainer: {
    width: "100%",
    overflow: "hidden",
    position: "relative",
  },
  form: {
    width: "100%",
  },
  input: {
    marginVertical: 8,
    height: 56,
    borderWidth: 1,
    borderColor: "#E1E1E1",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#000",
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    position: "absolute",
    width: "100%",
    textAlign: "center",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loader: {
    marginTop: 24,
  },
  toggleContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  toggleBackground: {
    width: TOGGLE_WIDTH,
    height: TOGGLE_HEIGHT,
    backgroundColor: "#F2F2F7",
    borderRadius: TOGGLE_HEIGHT / 2,
    padding: 4,
    position: "relative",
    overflow: "hidden",
  },
  toggleSlider: {
    width: (TOGGLE_WIDTH - 8) / 2,
    height: TOGGLE_HEIGHT - 8,
    backgroundColor: "#fff",
    borderRadius: (TOGGLE_HEIGHT - 8) / 2,
    position: "absolute",
    top: 4,
    left: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  toggleLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    height: "100%",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    paddingTop: 6,
  },
  toggleLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    width: (TOGGLE_WIDTH - 8) / 2,
    textAlign: "center",
    paddingHorizontal: 4,
  },
  toggleLabelActive: {
    color: "#007AFF",
    fontWeight: "600",
  },
});
