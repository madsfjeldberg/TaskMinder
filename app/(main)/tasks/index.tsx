import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import TaskList from "@/components/custom/TaskList";
import { Task, List, newTask } from "@/types/types";
import HorizontalListScroll from "@/components/custom/HorizontalScrollList";
import taskApi from "@/database/api/taskApi";
import listApi from "@/database/api/listApi";
import { registerGeofences } from "@/util/location";

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLists, setTaskLists] = useState<List[]>([]);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [loading, setLoading] = useState(true);
  const [listsLoading, setListsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [editing, setEditing] = useState<{
    id: number | null;
    text: string;
  }>({
    id: null,
    text: "",
  });

// 1. Load the list of task‐lists once, on mount
useEffect(() => {
  const fetchLists = async () => {
    setListsLoading(true)
    try {
      const lists = (await listApi.fetchTaskLists()) || []
      setTaskLists(lists)
      // pick the first list if none is selected yet
      if (!selectedList) setSelectedList(lists[0] || null)
      // start geofencing for every list
      registerGeofences(lists)
    } catch (err) {
      console.error('Error fetching lists:', err)
    } finally {
      setListsLoading(false)
      setLoading(false)
    }
  }
  fetchLists()
}, [])


// 2. Fetch tasks for the currently selected list
const fetchTasks = useCallback(async () => {
  if (!selectedList) { 
    setTasks([])                  // clear tasks if no list is selected
    setLoading(false)          // stop loading state
    return
  }             // nothing to do if no list
  setLoading(true)
  try {
    const data = (await taskApi.fetchTasks(selectedList)) || []
    setTasks(data)                     // store fetched tasks
  } catch (err) {
    console.error('Error fetching tasks:', err)
    setError('Failed to fetch tasks.')
  } finally {
    setLoading(false)
  }
}, [selectedList])


// 3. Run fetchTasks once after selection changes
useEffect(() => {
  fetchTasks()
}, [fetchTasks])


// 4. Also re‐run fetchTasks whenever this screen comes back into focus
useFocusEffect(
  useCallback(() => {
    fetchTasks()
  }, [fetchTasks])
)

  // Create a new task
  const createNewTask = async () => {
    try {
      // Create an empty task
      const newTask: newTask = {
        name: "",
        listId: selectedList?.id,
        completed: false,
        location: null,
      };

      const createdTask = await taskApi.createTask(newTask);

      setTasks([...tasks, createdTask[0]]);

      // Set as editing
      setEditing({
        id: createdTask[0].id,
        text: "",
      });
    } catch (err) {
      console.error("Error creating new task:", err);
      Alert.alert("Error", "Failed to create new task. Please try again.");
    }
  };

  // Loading state during initial list fetch
  if (listsLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading task lists...</Text>
      </View>
    );
  }

  {
    /* MAIN RENDER */
  }
  return (
    <View style={styles.container}>
      {/* Task Lists Horizontal Scroll */}
      <HorizontalListScroll
        taskLists={taskLists}
        setTaskLists={setTaskLists}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
        setIsMapModalVisible={setIsMapModalVisible}
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
          setTasks={setTasks}
          editing={editing}
          setEditing={setEditing}
          createNewTask={createNewTask}
        />
      )}
    </View>
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
});
