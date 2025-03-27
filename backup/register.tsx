// import React, { useState } from "react";
// import {
//   Text,
//   View,
//   StyleSheet,
//   KeyboardAvoidingView,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   Platform,
//   SafeAreaView,
// } from "react-native";
// import { FirebaseError } from "firebase/app";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "@/database/firebase";
// import { router } from "expo-router";
// import { ThemedText } from "@/components/ThemedText";
// import CustomAlert from "@/components/custom/CustomAlert";
// import { getErrorMessage } from "@/util/utils";
// import { Feather } from "@expo/vector-icons";

// export default function Register() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [alertVisible, setAlertVisible] = useState(false);
//   const [alertTitle, setAlertTitle] = useState("");
//   const [alertBody, setAlertBody] = useState("");

//   const showAlert = (title: string, body: string) => {
//     setAlertTitle(title);
//     setAlertBody(body);
//     setAlertVisible(true);
//   };

//   const signUp = async () => {
//     setLoading(true);
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       showAlert("Success", "Check your emails!");
//     } catch (e: any) {
//       const err = e as FirebaseError;
//       showAlert("Registration Failed", getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={styles.container}
//       >
//         <View style={styles.content}>
//           <ThemedText type="title">
//             <Text style={styles.title}>Create Account</Text>
//           </ThemedText>
//           <ThemedText type="subtitle" style={styles.subtitle}>
//             We're happy to have you!
//           </ThemedText>

//           <View style={styles.form}>
//             <TextInput
//               style={styles.input}
//               value={email}
//               onChangeText={setEmail}
//               autoCapitalize="none"
//               keyboardType="email-address"
//               placeholder="Email"
//               placeholderTextColor="#666"
//             />
//             <TextInput
//               style={styles.input}
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry
//               placeholder="Password"
//               placeholderTextColor="#666"
//             />

//             {loading ? (
//               <ActivityIndicator
//                 size="large"
//                 color="#007AFF"
//                 style={styles.loader}
//               />
//             ) : (
//               <View style={styles.buttonContainer}>
//                 <TouchableOpacity style={styles.primaryButton} onPress={signUp}>
//                   <Text style={styles.primaryButtonText}>Create Account</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.secondaryButton}
//                   onPress={() => router.back()}
//                 >
//                   <Text style={styles.secondaryButtonText}>
//                     <Feather name="arrow-left" size={24} color="#007AFF" /> Back to
//                     Login
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>
//         </View>
//       </KeyboardAvoidingView>

//       <CustomAlert
//         visible={alertVisible}
//         title={alertTitle}
//         body={alertBody}
//         onClose={() => setAlertVisible(false)}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 24,
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 42,
//     fontWeight: "bold",
//     textAlign: "center",
//     color: "#007AFF",
//     marginBottom: 8,
//     lineHeight: 50,
//   },
//   subtitle: {
//     fontSize: 16,
//     textAlign: "center",
//     marginBottom: 32,
//     color: "#666",
//   },
//   form: {
//     width: "100%",
//   },
//   input: {
//     marginVertical: 8,
//     height: 56,
//     borderWidth: 1,
//     borderColor: "#E1E1E1",
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     fontSize: 16,
//     backgroundColor: "#fff",
//     color: "#000",
//   },
//   buttonContainer: {
//     marginTop: 24,
//     gap: 12,
//   },
//   primaryButton: {
//     backgroundColor: "#007AFF",
//     height: 56,
//     borderRadius: 12,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   primaryButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   secondaryButton: {
//     backgroundColor: "#fff",
//     height: 56,
//     borderRadius: 12,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#007AFF",
//   },
//   secondaryButtonText: {
//     color: "#007AFF",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   loader: {
//     marginTop: 24,
//   },
// });
