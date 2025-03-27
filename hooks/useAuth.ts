import { useState, useEffect } from "react";
import { auth } from "@/database/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface StoredUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Store user data in AsyncStorage
        try {
          const userData: StoredUser = {
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
          };
          await AsyncStorage.setItem("user", JSON.stringify(userData));
          setUser(user);
        } catch (error) {
          console.error("Error storing user:", error);
        }
      } else {
        // Check AsyncStorage for stored user
        try {
          const storedUser = await AsyncStorage.getItem("user");
          if (storedUser) {
            const userData: StoredUser = JSON.parse(storedUser);
            // If we have stored user data, try to restore the session
            if (userData.uid) {
              // The user should be automatically restored by Firebase
              // If not, we'll wait for the next auth state change
              setUser(auth.currentUser);
            }
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error reading stored user:", error);
          setUser(null);
        }
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  return { user, loading };
}
