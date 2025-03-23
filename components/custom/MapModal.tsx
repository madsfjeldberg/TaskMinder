import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MapModalProps } from "@/types/types";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export default function MapModal({
  isMapModalVisible,
  setIsMapModalVisible,
  userLocation,
  taskLocation,
  onLocationSelect,
}: MapModalProps) {
  const insets = useSafeAreaInsets();

  // Handles changing task location
  const onMapPress = (e: any) => {
  const { latitude, longitude } = e.nativeEvent.coordinate;
  const newMarker = {
    coordinate: { latitude, longitude },
  };
  onLocationSelect?.(newMarker);
};

  return (
    <Modal
      visible={isMapModalVisible}
      animationType="slide"
      onRequestClose={() => setIsMapModalVisible(false)}
      presentationStyle="fullScreen"
    >
      <View style={[
        styles.container,
        { paddingTop: Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight }
      ]}>
      <StatusBar barStyle="dark-content" />
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
            {taskLocation && (
              <Marker
                coordinate={taskLocation}
              />
            )}
          </MapView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
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

