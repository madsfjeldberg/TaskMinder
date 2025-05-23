import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { initializeAuth } from "firebase/auth";
import * as firebaseAuth from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

const firebaseConfig = {
  apiKey: "AIzaSyAi1zrcnk1CBZkywdi2Cng3ZdKJImlgwq4",
  authDomain: "taskminder-94f45.firebaseapp.com",
  projectId: "taskminder-94f45",
  storageBucket: "taskminder-94f45.firebasestorage.app",
  messagingSenderId: "492162730706",
  appId: "1:492162730706:web:c248e39aa028f594e73b0b",
  measurementId: "G-B89CPCMBL5"
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});
export const auth = initializeAuth(app, {
  persistence: reactNativePersistence(ReactNativeAsyncStorage)
});
