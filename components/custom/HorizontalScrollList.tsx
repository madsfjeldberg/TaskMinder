import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { HorizontalScrollListProps, List, ListMarker } from "@/types/types";
import NewListModal from "./NewListModal";
import { Feather } from "@expo/vector-icons";
import MapModal from "./MapModal";
import listApi from "@/database/api/listApi";
import { useAuth } from "@/hooks/useAuth";
import EditListModal from "./EditListModal";

export default function HorizontalScrollList({
  taskLists,
  setTaskLists,
  selectedList,
  setSelectedList,
}: HorizontalScrollListProps) {

  const [isNewListModalVisible, setIsNewListModalVisible] = useState(false);
  const [isEditListModalVisible, setIsEditListModalVisible] = useState(false);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [newListName, setNewListName] = useState("");

  const { user } = useAuth();

  // Create a new task list
  const createNewTaskList = async () => {
      if (!user) {
        Alert.alert("Error", "User not found. Please log in again.");
        return;
      }
      if (!newListName.trim()) {
        Alert.alert("Error", "Please enter a list name");
        return;
      }
      
      const response = await listApi.createList(newListName);
      if (!response) {
        Alert.alert("Error", "Failed to create new list. Please try again.");
        return;
      }
  
      const userId = user.id;

      // Add to local state
      const newList: List = {
        id: response[0].id,
        name: newListName.trim(),
        userId: userId,
        location: null,
      };
      setTaskLists([...taskLists, newList]);
      setSelectedList(newList);

      // Reset states
      setNewListName("");
      setIsNewListModalVisible(false);
    };
  
  const updateListLocation = async (list: List, marker: ListMarker) => {
    let listId = list.id;
    list.location = {
      latitude: marker.coordinate.latitude,
      longitude: marker.coordinate.longitude,
      latitudeDelta: 0.2,
      longitudeDelta: 0.2,
    };

    await listApi.updateList(list);

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
  
  // New renderListWithContextMenu function
  const renderList = (list: List, index: number) => {
    return (
      <View key={index}>
        {renderListItem(list)}
      </View>
    );
  };

  return (
  <>
    <View style={styles.listsContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listsScrollContent}
      >
        {taskLists.map((list, index) => {
          return renderList(list, index);
        })}

        <TouchableOpacity
          style={styles.addListButton}
          onPress={() => setIsNewListModalVisible(true)}
        >
          <Feather name="plus" size={24} color="#3498db" />
        </TouchableOpacity>
      </ScrollView>
    </View>

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
  </>
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
    backgroundColor: "#3498db",
  },
  listItemText: {
    fontWeight: "600",
    fontSize: 16,
  },
  selectedListItemText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#fff",
  },
});
