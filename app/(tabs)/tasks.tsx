import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Feather } from "@expo/vector-icons";

// Task interface
interface Task {
  id: string;
  title: string;
  completed: boolean;
}

// List interface
interface TaskList {
  id: string;
  name: string;
  createdAt: Date;
}

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [listsLoading, setListsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState("");

  // New list creation state
  const [isNewListModalVisible, setIsNewListModalVisible] = useState(false);
  const [newListName, setNewListName] = useState("");

  // Fetch task lists from Firestore
  useEffect(() => {
    const fetchTaskLists = async () => {
      try {
        setListsLoading(true);
        console.log("Fetching task lists...");

        // Create a query against the taskLists collection
        const listQuery = query(collection(db, "task_lists"));

        // Execute the query
        const querySnapshot = await getDocs(listQuery);
        console.log(`Found ${querySnapshot.docs.length} task lists`);

        // Map the documents to our TaskList interface
        const listData: TaskList[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            createdAt: new Date(data.createdAt?.seconds * 1000 || Date.now()),
          };
        });

        setTaskLists(listData);

        // Set the first list as selected by default if there's at least one list
        if (listData.length > 0 && !selectedListId) {
          setSelectedListId(listData[0].id);
        }
      } catch (err) {
        console.error("Error fetching task lists:", err);
      } finally {
        // Always set loading to false, even if there was an error
        setListsLoading(false);
      }
    };

    fetchTaskLists();

    // Set a timeout to force loading to complete even if Firestore is unreachable
    const timeout = setTimeout(() => {
      setListsLoading(false);
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, []);

  // Fetch tasks from Firestore, filtered by selected list
  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedListId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(`Fetching tasks for list ID: ${selectedListId}`);

        // Create a query against the tasks collection, filtered by list ID
        const tasksQuery = query(
          collection(db, "tasks"),
          where("listId", "==", selectedListId)
        );

        // Execute the query
        const querySnapshot = await getDocs(tasksQuery);
        console.log(`Found ${querySnapshot.docs.length} tasks`);

        // Map the documents to our Task interface
        const tasksList: Task[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            completed: data.completed || false,
          };
        });

        setTasks(tasksList);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    // Set a timeout to force loading to complete
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [selectedListId]);

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
      const newList: TaskList = {
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
    if (!selectedListId) {
      Alert.alert("Error", "Please select a list first");
      return;
    }

    try {
      // Create an empty task
      const newTask = {
        title: "",
        completed: false,
        createdAt: serverTimestamp(),
        listId: selectedListId,
      };

      // Add new task to Firestore
      const docRef = await addDoc(collection(db, "tasks"), newTask);

      // Add to local state
      const taskWithId: Task = {
        id: docRef.id,
        title: newTask.title,
        completed: newTask.completed,
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
  const renderListItem = (list: TaskList) => {
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

  // Render each task item
  const renderTask = ({ item }: { item: Task }) => {
    const isEditing = item.id === editingTaskId;

    return (
      <TouchableOpacity
        style={styles.taskItem}
        onPress={() => {
          if (!isEditing) {
            toggleTaskCompletion(item.id, item.completed);
          }
        }}
        onLongPress={() => {
          setEditingTaskId(item.id);
          setEditingTaskText(item.title);
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
    );
  };

  // New List Modal
  const renderNewListModal = () => (
    <Modal
      isVisible={isNewListModalVisible}
      onBackdropPress={() => setIsNewListModalVisible(false)}
      onBackButtonPress={() => setIsNewListModalVisible(false)}
      backdropOpacity={0.4}
      backdropTransitionOutTiming={0}
      animationIn="slideInUp"
      animationOut="fadeOut"
      useNativeDriver={true}
      avoidKeyboard={true}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Create New List</Text>

        <TextInput
          style={styles.input}
          placeholder="List Name (e.g., Work, Home, Vacation)"
          placeholderTextColor="#999"
          value={newListName}
          onChangeText={setNewListName}
          autoFocus
        />

        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => {
              setNewListName("");
              setIsNewListModalVisible(false);
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, styles.createButton]}
            onPress={createNewTaskList}
          >
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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

  return (
    <View style={styles.container}>
      {/* Task Lists Horizontal Scroll */}
      <View style={styles.listsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listsScrollContent}
        >
          {taskLists.map((list) => renderListItem(list))}

          <TouchableOpacity
            style={styles.addListButton}
            onPress={() => setIsNewListModalVisible(true)}
          >
            <Feather name="plus" size={24} color="#3498db" />
          </TouchableOpacity>
        </ScrollView>
      </View>

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
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => {
            if (editingTaskId) {
              saveTaskTitle(editingTaskId);
            }
          }}
        >
          <FlatList
            data={tasks}
            renderItem={renderTask}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
          <TouchableOpacity
            style={[
              styles.addTaskButton,
              editingTaskId && styles.addTaskButtonDisabled,
            ]}
            onPress={createNewTask}
            disabled={editingTaskId !== null}
          >
            <Feather name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {renderNewListModal()}
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
  listsContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  listsScrollContent: {
    paddingHorizontal: 16,
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
  addListButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  listContainer: {
    padding: 16,
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
  modal: {
    margin: 0,
    justifyContent: "flex-start",
    paddingTop: 150,
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
  },
  createButton: {
    backgroundColor: "#3498db",
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  addTaskButton: {
    position: "absolute",
    right: 20,
    bottom: 100,
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "#2ecc71",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 999,
  },
  addTaskButtonDisabled: {
    backgroundColor: "#bdc3c7",
    elevation: 0,
    shadowOpacity: 0,
  },
});
