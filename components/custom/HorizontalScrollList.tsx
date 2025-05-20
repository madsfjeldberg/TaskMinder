import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { HorizontalScrollListProps, dbTaskList, UserLocation, ListMarker } from "@/types/types";
import ContextMenu from "react-native-context-menu-view";
import NewListModal from "./NewListModal";
import { db, auth } from "@/database/firebase";
import { Feather } from "@expo/vector-icons";
import { getUserLocation } from "@/util/location";
import {
  collection,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import MapModal from "./MapModal";
import * as api from "@/database/api";

export default function HorizontalScrollList({
  taskLists,
  setTaskLists,
  selectedList,
  setSelectedList,
}: HorizontalScrollListProps) {

  const [userLocation, setUserLocation] = useState<UserLocation>({
    latitude: 55.676098,
    longitude: 12.568337,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });
  const [isNewListModalVisible, setIsNewListModalVisible] = React.useState(false);
  const [isMapModalVisible, setIsMapModalVisible] = React.useState(false);
  const [newListName, setNewListName] = React.useState("");

  // Ask for location permission on map modal open
  useEffect(() => {
    (async () => {
      let location = await getUserLocation();
      setUserLocation(location);
    })();
  }, [isMapModalVisible]);

  // Create a new task list
    const createNewTaskList = async () => {
      if (!newListName.trim()) {
        Alert.alert("Error", "Please enter a list name");
        return;
      }
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return;
      }
      try {
        // Add new task list to Firestore with userId
        const docRef = await addDoc(collection(db, "task_lists"), {
          name: newListName.trim(),
          createdAt: serverTimestamp(),
          userId: currentUser.uid,
        });
  
        // Add to local state
        const newList: dbTaskList = {
          id: docRef.id,
          name: newListName.trim(),
          createdAt: new Date(),
          userId: currentUser.uid,
          location: null,
        };
  
        setTaskLists([...taskLists, newList]);
        setSelectedList(newList);
        setNewListName("");
        setIsNewListModalVisible(false);
      } catch (err) {
        console.error("Error creating new task list:", err);
        Alert.alert("Error", "Failed to create new list. Please try again.");
      }
    };

  // Render task list item
    const renderListItem = (list: dbTaskList) => {
      const isSelected = selectedList?.id === list.id;
  
      return (
        <View key={list.id}>
          <TouchableOpacity
            style={[styles.listItem, isSelected && styles.isSelectedListItem]}
            onPress={() => setSelectedList(list)}
          >
            <Text
              style={[
                styles.listItemText,
                isSelected && styles.selectedListItemText,
              ]}
            >
              {list.name}
            </Text>
          </TouchableOpacity>
        </View>
      );
    };
  
  // Delete a task list
    const deleteList = async (listId: string) => {
      try {
        // Remove from Firestore
        const listRef = doc(db, "task_lists", listId);
        await deleteDoc(listRef);
  
        // Remove from local state
        const updatedList = taskLists.filter((list) => list.id !== listId);
        setTaskLists(updatedList);

        // If the deleted list was selected, select another list
        if (selectedList?.id === listId) {
          const newSelectedList = taskLists.find((list) => list.id !== listId);
          setSelectedList(newSelectedList || null);
        }
      } catch (err) {
        console.error("Error deleting task list:", err);
        Alert.alert("Error", "Could not delete task list. Please try again.");
      }
    };
  
  // Show rename dialog
    const handleRenameList = (list: dbTaskList) => {
      // Store the specific list ID we want to rename
      const listIdToRename = list.id;
      const currentListName = list.name;
  
      Alert.prompt(
        "Rename List",
        "Enter a new name for the list:",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Rename",
            onPress: (value) => {
              if (value && value.trim()) {
                // Pass the specific list ID to ensure we rename the right list
                renameTaskList(listIdToRename, value.trim());
              }
            },
          },
        ],
        "plain-text",
        currentListName
      );
    };
  
  // Rename a task list
    const renameTaskList = async (listId: string, newName: string) => {
      try {
        const listRef = doc(db, "task_lists", listId);
        await updateDoc(listRef, {
          name: newName,
        });
  
        // Update local state with the specific list ID
        let updatedList = taskLists.map((list) => {
          if (list.id === listId) {
            return { ...list, name: newName };
          }
          return list;
        });
        setTaskLists(updatedList);
      } catch (err) {
        console.error("Error renaming task list:", err);
        Alert.alert("Error", "Could not rename task list. Please try again.");
      }
    };

  const updateListLocation = async (list: dbTaskList, marker: ListMarker) => {
    let listId = list.id;
    api.updateListLocation(listId, marker);

    const newLocation = {
      latitude: marker.coordinate.latitude,
      longitude: marker.coordinate.longitude,
      latitudeDelta: 0.2,
      longitudeDelta: 0.2,
    };

    setTaskLists(
    taskLists.map((list) =>
      list.id === listId
        ? { ...list, location: newLocation }
        : list
      )
    );

    if (selectedList && selectedList.id === listId) {
      setSelectedList({ ...selectedList, location: newLocation });
    }
    
  };
  
  const LIST_MENU_ACTIONS = [
    {
      title: "Rename",
      systemIcon: Platform.OS === "ios" ? "square.and.pencil" : undefined,
      id: Platform.OS === "android" ? "edit" : undefined,
      destructive: false,
    },
    
    {
      title: "Set location",
      systemIcon: Platform.OS === "ios" ? "location" : undefined,
      id: Platform.OS === "android" ? "location" : undefined,
      destructive: false,
    },
    {
      title: "Delete",
      systemIcon: Platform.OS === "ios" ? "trash" : undefined,
      id: Platform.OS === "android" ? "delete" : undefined,
      destructive: true,
    },
  ];

  // New renderListWithContextMenu function
  const renderListWithContextMenu = (list: dbTaskList, index: number) => {
    return (
      <View key={`list_${list.id}_${index}`}>
        <ContextMenu
          actions={LIST_MENU_ACTIONS}
          onPress={(e) => {
            // Handle menu action selection
            if (e.nativeEvent.index === 0) {
              // Rename action
              handleRenameList(list);
            } else if (e.nativeEvent.index === 1) {
              // Set location action
              setIsMapModalVisible(true);
            } else if (e.nativeEvent.index === 2) { 
              // Delete action
              Alert.alert(
                "Delete List",
                `Are you sure you want to delete "${list.name}"? All tasks in this list will also be deleted.`,
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Delete",
                    onPress: () => deleteList(list.id),
                    style: "destructive",
                  },
                ]
              );
            }
          }}
          previewBackgroundColor="#f9f9f9"
        >
          {renderListItem(list)}
        </ContextMenu>
      </View>
    );
  };

  return (
    <View style={styles.listsContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listsScrollContent}
      >
        {/* Check for duplicate IDs and render uniquely */}
        {taskLists.map((list, index) => {
          // Use unique compound key with index fallback
          return renderListWithContextMenu(list, index);
        })}

        <TouchableOpacity
          style={styles.addListButton}
          onPress={() => setIsNewListModalVisible(true)}
        >
          <Feather name="plus" size={24} color="#3498db" />
        </TouchableOpacity>
      </ScrollView>

      <NewListModal
        isVisible={isNewListModalVisible}
        onClose={() => setIsNewListModalVisible(false)}
        onCreateList={createNewTaskList}
        newListName={newListName}
        setNewListName={setNewListName}
      />

      <MapModal
        isMapModalVisible={isMapModalVisible}
        setIsMapModalVisible={setIsMapModalVisible}
        userLocation={userLocation}
        listLocation={selectedList?.location ?? null}
        onLocationSelect={(marker) => {
          if (selectedList) {
            updateListLocation(selectedList, marker);
          }
        }}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  listsContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listsScrollContent: {
    paddingHorizontal: 16,
  },
  addListButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  listItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  isSelectedListItem: {
    borderWidth: 1,
    borderColor: "#3498db",
  },
  listItemText: {
    fontWeight: "600",
    fontSize: 16,
  },
  selectedListItemText: {
    fontWeight: "700",
  },
});
