import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import { MapModalProps } from "@/types/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export default function MapModal({
  isMapModalVisible,
  setIsMapModalVisible,
  userLocation,
  listLocation,
  onLocationSelect,
}: MapModalProps) {
  const insets = useSafeAreaInsets();

  // State for current marker
  const [currentMarker, setCurrentMarker] = useState(listLocation);
  
  // Update current marker when task location changes
  useEffect(() => {
    setCurrentMarker(listLocation);
  }, [listLocation]);

  // Handles changing task location
  const onMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const newLocation = {
      latitude,
      longitude,
      latitudeDelta: listLocation?.latitudeDelta ?? 0.01,
      longitudeDelta: listLocation?.longitudeDelta ?? 0.01,
    };

    setCurrentMarker(newLocation);

    const newMarker = {
      coordinate: newLocation,
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
            <Feather name="x" size={24} />
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
            {currentMarker && (
              <>
              <Marker
                coordinate={{
                  latitude: currentMarker.latitude,
                  longitude: currentMarker.longitude,
                }}
              />
              <Circle
                center={{
                  latitude: currentMarker.latitude,
                  longitude: currentMarker.longitude,
                }}
                radius={200}
                strokeWidth={1}
                strokeColor="rgba(0, 122, 255, 0.5)"
                fillColor="rgba(0, 122, 255, 0.2)"
                />
                </>
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

