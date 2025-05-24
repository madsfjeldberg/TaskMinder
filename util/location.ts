import * as Location from "expo-location";
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GeofencingEventType } from "expo-location";
import { List } from "@/types/types";


const LOCATION_TASK_NAME = 'background-location-task';
const GEOFENCE_TASK_NAME = 'geofence-task';

const requestPermission = async () => {
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus === 'granted') {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
    });
  }
};

const getLatestLocation = async () => {
  const loc = await AsyncStorage.getItem("userLocation");
  return loc ? JSON.parse(loc) : null;
};

const registerGeofences = async (lists: List[]) => {
  const geofences = lists.map((list) => ({
    identifier: list.name,
    latitude: list.location.latitude,
    longitude: list.location.longitude,
    radius: 200, // meters
  }));

  await Location.startGeofencingAsync(GEOFENCE_TASK_NAME, geofences);
}

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("Location task error:", error);
    return;
  }
  if (data) {
    const { locations } = data;
    console.log("User location update:", locations);
    if (locations && locations.length > 0) {
      await AsyncStorage.setItem('userLocation', JSON.stringify(locations[0]));
    }
  }
});

TaskManager.defineTask(GEOFENCE_TASK_NAME, ({ data: { eventType, region }, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }
  if (eventType === GeofencingEventType.Enter) {
    // Should send notification here
    // For example, using Expo Notifications
    // Notifications.scheduleNotificationAsync({
    //   content: {
    //     title: "List Alert",
    //     body: `You have entered the region for ${region.identifier}
    //          . Don't forget to check your list!`,      
    //   },
    //   trigger: null, // immediate notification
    // });
    console.log("You've entered region:", region.identifier);
  } else if (eventType === GeofencingEventType.Exit) {
    console.log("You've left region:", region.identifier);
  }
});



// function getDistance(loc1: { latitude: number; longitude: number }, loc2: { latitude: number; longitude: number }) {
//   const toRad = (value: number) => (value * Math.PI) / 180;
//   const R = 6371000; // meters
//   const dLat = toRad(loc2.latitude - loc1.latitude);
//   const dLon = toRad(loc2.longitude - loc1.longitude);
//   const lat1 = toRad(loc1.latitude);
//   const lat2 = toRad(loc2.latitude);

//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }

// const sendLocationAlert = async (userLocation: UserLocation, list: List) => {
//   if (!userLocation || !list.location) return;

//   const distance = getDistance(userLocation, list.location);
//   if (distance < 200) {
//     Alert.alert("Location Alert", `You are close to your list location: ${list.name}`);
//   }
// };

export { requestPermission, getLatestLocation, registerGeofences };