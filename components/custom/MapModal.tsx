import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MapModalProps } from "@/types/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export default function MapModal({
  isMapModalVisible,
  setIsMapModalVisible,
  userLocation,
  taskMarker,
  setTaskMarker,
  onLocationSelect,
}: MapModalProps) {

  // Handles changing task location
  const onMapPress = (e: any) => {
  const { latitude, longitude } = e.nativeEvent.coordinate;
  const newMarker = {
    coordinate: { latitude, longitude },
  };
  setTaskMarker(newMarker);
  onLocationSelect?.(newMarker);
};

  return (
    <Modal
      visible={isMapModalVisible}
      animationType="slide"
      onRequestClose={() => setIsMapModalVisible(false)}
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.modalContainer} edges={['top']}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => setIsMapModalVisible(false)}
            style={styles.closeButton}
          >
            <Feather name="x" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Select Location</Text>
        </View>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={userLocation}
            showsUserLocation={true}
            followsUserLocation={true}
            showsMyLocationButton={true}
            showsScale={true}
            showsBuildings={true}
            showsPointsOfInterest={true}
            onPress={onMapPress}
          >
            {/* Show the task marker if it exists */}
            {taskMarker && (
              <Marker
                coordinate={taskMarker.coordinate}
              />
            )}
          </MapView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
  },
  mapContainer: {
    flex: 1,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

