import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from "expo-location";
import { Alert } from "react-native";
import { UserLocation } from "@/types/types";

/**
 * Get the user's current location.
 * Requests permission to access location and returns the coordinates.
 * @returns {Promise<UserLocation>} The user's location or undefined if not available.
 */
const getUserLocation = async (): Promise<UserLocation> => {
  let { status } = await requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Location permission denied");
  }
  try {
    let location = await getCurrentPositionAsync();
    let coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
    return coords;
  } catch (error) {
    console.error("Error getting location:", error);
  }
};

const periodicLocationUpdate = async () => {
  const location = await getUserLocation();
  if (location) {
    // Handle the location update (e.g., send to server, update state, etc.)
  } else {
    console.error("Failed to get location");
  }
  // Schedule the next update
  setTimeout(periodicLocationUpdate, 60000); // Update every minute
};

export { getUserLocation, periodicLocationUpdate };