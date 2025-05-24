import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { HorizontalScrollListProps, List, UserLocation, ListMarker } from "@/types/types";
import NewListModal from "./NewListModal";
import { Feather } from "@expo/vector-icons";
import MapModal from "./MapModal";
import api from "@/database/api";
import auth from "@/database/auth";
import EditListModal from "./EditListModal";
import { getLatestLocation } from "@/util/location";

export default function HorizontalScrollList({
  taskLists,
  setTaskLists,
  selectedList,
  setSelectedList,
}: HorizontalScrollListProps) {


  const [isNewListModalVisible, setIsNewListModalVisible] = React.useState(false);
  const [isEditListModalVisible, setIsEditListModalVisible] = React.useState(false);
  const [isMapModalVisible, setIsMapModalVisible] = React.useState(false);
  const [newListName, setNewListName] = React.useState("");
  const [userLocation, setUserLocation] = useState({
  latitude: 55.676098,
  longitude: 12.568337,
  latitudeDelta: 0.2,
  longitudeDelta: 0.2,
  });

  useEffect(() => {
    // (async () => {
    //   let location = await getLatestLocation(); 
    //   let newLocation = {
    //     latitude: location.coords.latitude,
    //     longitude: location.coords.longitude,
    //     latitudeDelta: 0.1,
    //     longitudeDelta: 0.1,
    //   }
    //   setUserLocation(newLocation);
    // })();
  }, [isMapModalVisible]);

  // Create a new task list
    const createNewTaskList = async () => {
      if (!newListName.trim()) {
        Alert.alert("Error", "Please enter a list name");
        return;
      }
      const currentUser = await auth.getCurrentUser();
      const userId = currentUser?.data.user?.id;
      if (!currentUser || !userId) {
        return;
      }
      const response = await api.createList(newListName, userId, null);
      if (!response) {
        Alert.alert("Error", "Failed to create new list. Please try again.");
        return;
      }
  
      // Add to local state
      const newList: List = {
        id: response[0].id,
        name: newListName.trim(),
        userId: userId,
        location: null,
      };
      
      setTaskLists([...taskLists, newList]);
      setSelectedList(newList);
      setNewListName("");
      setIsNewListModalVisible(false);
    };
  
  // Render task list item
    const renderListItem = (list: List) => {
      const isSelected = selectedList?.id === list.id;
  
      return (
        
        <View key={list.id}>
          <TouchableOpacity
            style={[styles.listItem, isSelected && styles.isSelectedListItem]}
            onPress={() => setSelectedList(list)}
            onLongPress={() => {
              setSelectedList(list);
              setIsEditListModalVisible(true);
              setNewListName(list.name);
            }}
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
  
  // // Delete a task list
  //   const deleteList = async (listId: string) => {
  //     try {
  //       // Remove from Firestore
  //       const listRef = doc(db, "task_lists", listId);
  //       await deleteDoc(listRef);
  
  //       // Remove from local state
  //       const updatedList = taskLists.filter((list) => list.id !== listId);
  //       setTaskLists(updatedList);

  //       // If the deleted list was selected, select another list
  //       if (selectedList?.id === listId) {
  //         const newSelectedList = taskLists.find((list) => list.id !== listId);
  //         setSelectedList(newSelectedList || null);
  //       }
  //     } catch (err) {
  //       console.error("Error deleting task list:", err);
  //       Alert.alert("Error", "Could not delete task list. Please try again.");
  //     }
  //   };

  const updateListLocation = async (list: List, marker: ListMarker) => {
    let listId = list.id;
    list.location = {
      latitude: marker.coordinate.latitude,
      longitude: marker.coordinate.longitude,
      latitudeDelta: 0.2,
      longitudeDelta: 0.2,
    };

    const updatedList = await api.updateList(list);

    let updatedTaskLists = taskLists.map((taskList) => {
      if (taskList.id === listId) {
        return {
          ...taskList,
          location: {
            latitude: marker.coordinate.latitude,
            longitude: marker.coordinate.longitude,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          },
        };
      }
      return taskList;
    });
    setTaskLists(updatedTaskLists);

    const newLocation = {
      latitude: marker.coordinate.latitude,
      longitude: marker.coordinate.longitude,
      latitudeDelta: 0.2,
      longitudeDelta: 0.2,
    };

    if (selectedList && selectedList.id === listId) {
      setSelectedList({ ...selectedList, location: newLocation });
    }
    
  };
  
  // New renderListWithContextMenu function
  const renderList = (list: List, index: number) => {
    return (
      <View key={`list_${list.id}_${index}`}>
        {renderListItem(list)}
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
          return renderList(list, index);
        })}

        <TouchableOpacity
          style={styles.addListButton}
          onPress={() => setIsNewListModalVisible(true)}
        >
          <Feather name="plus" size={24} color="#3498db" />
        </TouchableOpacity>
      </ScrollView>

      <NewListModal
        visible={isNewListModalVisible}
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

      <EditListModal
        taskLists={taskLists}
        setTaskLists={setTaskLists}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
        visible={isEditListModalVisible}
        setVisible={setIsEditListModalVisible}
        onClose={() => setIsEditListModalVisible(false)}
        setIsMapModalVisible={setIsMapModalVisible}
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
