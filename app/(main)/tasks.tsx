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
import { db } from "@/database/firebase";
import { Feather } from "@expo/vector-icons";
import TaskList from "@/components/custom/TaskList";
import { Task, List, newTask } from "@/types/types";
import HorizontalListScroll from "@/components/custom/HorizontalScrollList";
import api from "@/database/api";

export default function TasksScreen() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
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

  // Fetch task lists from Firestore
  useEffect(() => {
    const fetchTaskLists = async () => {
      let lists = await api.fetchTaskLists() || [];

      try {
        setListsLoading(true);
        setTaskLists(lists);
        // Set the first list as selected if none is selected
        if (!selectedList) {
          setSelectedList(lists[0] || null);
        }
      } catch (err) {
        console.error("Error fetching task lists:", err);
    } finally {
      setListsLoading(false);
      setLoading(false);
    }
    };
    fetchTaskLists();
  }, []);

  // // Fetch tasks from Firestore, filtered by selected list
  useEffect(() => {
    if (!selectedList) {
      return;
    }

    const fetchTasks = async () => {
      let tasks = await api.fetchTasks(selectedList);

      try {
        setLoading(true);
        setTasks(tasks ?? []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to fetch tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [selectedList]);

  

  

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

      const createdTask = await api.createTask(newTask);

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

  {/* MAIN RENDER */}
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
