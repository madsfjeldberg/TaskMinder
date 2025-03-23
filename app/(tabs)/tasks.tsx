import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import {
  collection,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../database/firebase";
import { Feather } from "@expo/vector-icons";
import TaskList from "@/components/custom/TaskList";
import { dbTask, dbTaskList, TaskMarker } from "@/types/types";
import HorizontalListScroll from "@/components/custom/HorizontalScrollList";
import NewListModal from "@/components/custom/NewListModal";
import { fetchTaskLists, fetchTasks } from "@/database/api";
import { MenuProvider } from "react-native-popup-menu";
import ContextMenu from "react-native-context-menu-view";
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from "expo-location";
import MapModal from "@/components/custom/MapModal";




export default function TasksScreen() {
  const [tasks, setTasks] = useState<dbTask[]>([]);
  const [taskLists, setTaskLists] = useState<dbTaskList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [listsLoading, setListsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [mapEditingTaskId, setMapEditingTaskId] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState("");
  const [isNewListModalVisible, setIsNewListModalVisible] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [taskMarker, setTaskMarker] = useState<TaskMarker | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }>({
    // copenhagen
    latitude: 55.676098,
    longitude: 12.568337,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });

  // Ask for location permission on map modal open
  useEffect(() => {
    getUserLocation();
  }, [isMapModalVisible]);

  // Fetch task lists from Firestore
  useEffect(() => {
    try {
      setListsLoading(true);
      fetchTaskLists(setTaskLists, selectedListId, setSelectedListId);
    } catch (err) {
      console.error("Error fetching task lists:", err);
    } finally {
      setListsLoading(false);
    }
  }, []);

  // Fetch tasks from Firestore, filtered by selected list
  useEffect(() => {
    try {
      setLoading(true);
      fetchTasks(setTasks, selectedListId, setError);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedListId]);
  

  // Function to get user location
  // Using expo-location
  const getUserLocation = async () => {
    let { status } = await requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access location was denied');
      return;
    }

    try {
      let location = await getCurrentPositionAsync();
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Could not get your current location');
    }
  };

  // Toggle task completion status
  const toggleTaskCompletion = async (
    taskId: string,
    currentStatus: boolean
  ) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        completed: !currentStatus,
      });

      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: !currentStatus } : task
        )
      );
    } catch (err) {
      console.error("Error updating task:", err);
      // Show error message to user
      Alert.alert("Error", "Could not update task. Please try again.");
    }
  };

  // Add this function to update task location
const updateTaskLocation = async (taskId: string, marker: TaskMarker) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      location: {
        latitude: marker.coordinate.latitude,
        longitude: marker.coordinate.longitude,
      }
    });

    // Update local state
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId 
          ? { 
              ...task, 
              location: {
                latitude: marker.coordinate.latitude,
                longitude: marker.coordinate.longitude,
              }
            } 
          : task
      )
    );
    
    // Show success message
    Alert.alert("Success", "Location updated successfully");
  } catch (err) {
    console.error("Error updating task location:", err);
    Alert.alert("Error", "Could not update task location. Please try again.");
  }
};

  // Create a new task list
  const createNewTaskList = async () => {
    if (!newListName.trim()) {
      Alert.alert("Error", "Please enter a list name");
      return;
    }

    try {
      // Add new task list to Firestore
      const docRef = await addDoc(collection(db, "task_lists"), {
        name: newListName.trim(),
        createdAt: serverTimestamp(),
      });

      // Add to local state
      const newList: dbTaskList = {
        id: docRef.id,
        name: newListName.trim(),
        createdAt: new Date(),
      };

      setTaskLists((prev) => [...prev, newList]);
      setSelectedListId(docRef.id);
      setNewListName("");
      setIsNewListModalVisible(false);
    } catch (err) {
      console.error("Error creating new task list:", err);
      Alert.alert("Error", "Failed to create new list. Please try again.");
    }
  };

  // Create a new task
  const createNewTask = async () => {

    try {
      // Create an empty task
      const newTask = {
        title: "",
        completed: false,
        createdAt: serverTimestamp(),
        listId: selectedListId,
        location: null,
      };

      // Add new task to Firestore
      const docRef = await addDoc(collection(db, "tasks"), newTask);

      // Add to local state
      const taskWithId: dbTask = {
        id: docRef.id,
        title: newTask.title,
        completed: newTask.completed,
        location: null,
      };

      setTasks((prev) => [taskWithId, ...prev]);

      // Set as editing
      setEditingTaskId(docRef.id);
      setEditingTaskText("");
    } catch (err) {
      console.error("Error creating new task:", err);
      Alert.alert("Error", "Failed to create new task. Please try again.");
    }
  };

  // Delete a task
  const deleteTask = async (taskId: string) => {
    try {
      // Remove from Firestore
      const taskRef = doc(db, "tasks", taskId);
      await deleteDoc(taskRef);

      // Remove from local state
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

      // Reset editing state if needed
      if (editingTaskId === taskId) {
        setEditingTaskId(null);
        setEditingTaskText("");
      }
    } catch (err) {
      console.error("Error deleting task:", err);
      Alert.alert("Error", "Could not delete task. Please try again.");
    }
  };

  // Save task after editing
  const saveTaskTitle = async (taskId: string) => {
    if (!editingTaskText.trim()) {
      // If empty, delete the task
      try {
        await deleteTask(taskId);
      } catch (err) {
        console.error("Error deleting empty task:", err);
      }
      return;
    }

    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        title: editingTaskText.trim(),
      });

      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, title: editingTaskText.trim() } : task
        )
      );

      // Exit editing mode
      setEditingTaskId(null);
      setEditingTaskText("");
    } catch (err) {
      console.error("Error updating task title:", err);
      Alert.alert("Error", "Could not update task. Please try again.");
    }
  };

  // Render task list item
  const renderListItem = (list: dbTaskList) => {
    const isSelected = selectedListId === list.id;

    return (
      <TouchableOpacity
        key={list.id}
        style={[styles.listItem, isSelected && styles.isSelectedListItem]}
        onPress={() => setSelectedListId(list.id)}
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
    );
  };


  const showMapModal = () => {
    return (
      <MapModal
        isMapModalVisible={isMapModalVisible}
        setIsMapModalVisible={(visible) => {
          if (!visible) {
            // Reset states when closing the modal
            setTaskMarker(null);
            setMapEditingTaskId(null);
          }
          setIsMapModalVisible(visible);
        }}
        userLocation={userLocation}
        taskMarker={taskMarker}
        setTaskMarker={setTaskMarker}
        onLocationSelect={(marker) => {
          if (mapEditingTaskId) {
            updateTaskLocation(mapEditingTaskId, marker);
          }
        }}
      />
    );
  };

  // Render each task item
  const renderTask = ({ item }: { item: dbTask }) => {
    const isEditing = item.id === editingTaskId;

    // Define menu actions
    const menuActions = [
      {
        title: "Edit",
        systemIcon: Platform.OS === "ios" ? "square.and.pencil" : undefined,
        // For Android, we can provide action IDs that match drawable resource names
        // or use a more generic approach
        id: Platform.OS === "android" ? "edit" : undefined,
        destructive: false,
      },
      {
        title: "Set Location",
        systemIcon: Platform.OS === "ios" ? "location" : undefined,
        id: Platform.OS === "android" ? "set_location" : undefined,
        destructive: false,
      },
      {
        title: "Delete",
        systemIcon: Platform.OS === "ios" ? "trash" : undefined,
        id: Platform.OS === "android" ? "delete" : undefined,
        destructive: true,
      },
    ];

    return (
      <ContextMenu
        actions={menuActions}
        onPress={(e) => {
          // Handle menu action selection
          if (e.nativeEvent.index === 0) {
            // Edit action
            setEditingTaskId(item.id);
            setEditingTaskText(item.title);
          } else if (e.nativeEvent.index === 1) {
            // Set Location action
            setMapEditingTaskId(item.id);

            if (item.location) {
              console.log("item.location", item.location);
              setTaskMarker({
                coordinate: {
                  latitude: item.location.latitude,
                  longitude: item.location.longitude,
                },
              });
            }
            setIsMapModalVisible(true);
          } else if (e.nativeEvent.index === 2) {
            // Delete action
            Alert.alert(
              "Delete Task",
              "Are you sure you want to delete this task?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Delete",
                  onPress: () => deleteTask(item.id),
                  style: "destructive",
                },
              ]
            );
          }
        }}
        previewBackgroundColor="#f9f9f9"
      >
        <TouchableOpacity
          style={styles.taskItem}
          onPress={() => {
            if (!isEditing) {
              toggleTaskCompletion(item.id, item.completed);
            }
          }}
        >
          <View style={styles.taskContent}>
            <View style={styles.taskHeader}>
              {!isEditing && (
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => toggleTaskCompletion(item.id, item.completed)}
                >
                  {item.completed ? (
                    <Feather name="check-square" size={24} color="#3498db" />
                  ) : (
                    <Feather name="square" size={24} color="#3498db" />
                  )}
                </TouchableOpacity>
              )}

              {isEditing ? (
                <TextInput
                  style={styles.taskTitleInput}
                  value={editingTaskText}
                  onChangeText={setEditingTaskText}
                  placeholder="Enter task name..."
                  autoFocus
                  onBlur={() => saveTaskTitle(item.id)}
                  onSubmitEditing={() => saveTaskTitle(item.id)}
                />
              ) : (
                <Text
                  style={[
                    styles.taskTitle,
                    item.completed && styles.completedTaskText,
                  ]}
                >
                  {item.title}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </ContextMenu>
    );
  };

  // New List Modal
  const renderNewListModal = () => (
    <NewListModal
      isVisible={isNewListModalVisible}
      onClose={() => setIsNewListModalVisible(false)}
      onCreateList={createNewTaskList}
      newListName={newListName}
      setNewListName={setNewListName}
    />
  );

  // Loading state during initial list fetch
  if (listsLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading task lists...</Text>
      </View>
    );
  }

  // No lists state
  if (taskLists.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.centeredContainer}>
          <Feather name="list" size={64} color="#ccc" />
          <Text style={styles.emptyStateText}>No Task Lists</Text>
          <Text style={styles.emptyStateSubText}>
            Create your first task list to get started
          </Text>

          <TouchableOpacity
            style={styles.createListButton}
            onPress={() => setIsNewListModalVisible(true)}
          >
            <Text style={styles.createListButtonText}>Create First List</Text>
          </TouchableOpacity>
        </View>

        {renderNewListModal()}
      </View>
    );
  }

  {/* MAIN RENDER */}
  return (
    <MenuProvider>
      <View style={styles.container}>
        {/* Task Lists Horizontal Scroll */}
        <HorizontalListScroll
          taskLists={taskLists}
          renderListItem={renderListItem}
          setIsNewListModalVisible={setIsNewListModalVisible}
        />

        {/* Loading state for tasks */}
        {loading ? (
          <View style={styles.tasksLoadingContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loadingText}>Loading tasks...</Text>
          </View>
        ) : error ? (
          // Error state
          <View style={styles.centeredContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setError(null);
                setLoading(true);
                // Re-trigger useEffect
                setTasks([]);
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : tasks.length === 0 ? (
          // Empty tasks state
          <View style={styles.centeredContainer}>
            <Feather name="clipboard" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No tasks yet</Text>
            <Text style={styles.emptyStateSubText}>
              Your tasks will appear here when you create them
            </Text>
            <TouchableOpacity
              style={styles.createTaskButton}
              onPress={createNewTask}
            >
              <Text style={styles.createListButtonText}>Create Task</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Task list
          <TaskList
            tasks={tasks}
            editingTaskId={editingTaskId}
            saveTaskTitle={saveTaskTitle}
            createNewTask={createNewTask}
            renderTask={renderTask}
          />
        )}

        {renderNewListModal()}
        {showMapModal()}
      </View>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  tasksLoadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 16,
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
  errorText: {
    color: "#e74c3c",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  loadingText: {
    color: "#666",
    fontSize: 16,
    marginTop: 12,
  },
  retryButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 16,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
    maxWidth: 240,
    marginBottom: 20,
  },
  createListButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createTaskButton: {
    backgroundColor: "#2ecc71",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createListButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  taskItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginLeft: 12,
  },
  taskTitleInput: {
    fontSize: 18,
    flex: 1,
    marginLeft: 12,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#3498db",
  },
  completedTaskText: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
  checkboxContainer: {
    marginRight: 0,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
