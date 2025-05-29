import * as Location from "expo-location";
import * as TaskManager from 'expo-task-manager';
import { GeofencingEventType } from "expo-location";
import { List } from "@/types/types";
import { Alert } from "react-native";

const GEOFENCE_TASK_NAME = 'geofence-task';

const requestPermission = async () => {
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  return foregroundStatus === 'granted';
};

const getLatestLocation = async () => {
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  if (location) {
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }
  }
};


const registerGeofences = async (lists: List[]) => {
  // only register geofences for lists that have a location
  let listsWithLocation = lists.filter((list) => {
    return (
      list.location &&
      typeof list.location.latitude === "number" &&
      typeof list.location.longitude === "number"
    );
  });
  const geofences = listsWithLocation.map((list) => ({
    identifier: list.name,
    latitude: list.location!.latitude,
    longitude: list.location!.longitude,
    radius: 200, // meters
  }));

  await Location.startGeofencingAsync(GEOFENCE_TASK_NAME, geofences);
}

TaskManager.defineTask(
  GEOFENCE_TASK_NAME,
  ({ data: { eventType, region }, error }) => {
    if (error) {
      console.error('Geofence error', error);
      return;
    }
    if (eventType === GeofencingEventType.Enter) {
      console.log('Entered', region.identifier);
      // should send a notification here
    }
  }
);

export { requestPermission, getLatestLocation, registerGeofences };