import React from "react";
import { FlatList } from "react-native";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { TaskListProps } from "@/types/types";
import ContextMenu from "react-native-context-menu-view";
import { Alert, Text, View, TextInput } from "react-native";
import { Task } from "@/types/types";
import { Platform } from "react-native";
import { db } from "@/database/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import api from "@/database/api";

export default function TaskList({
  tasks,
  setTasks,
  editing,
  setEditing,
  saveTaskTitle,
  createNewTask,
}: TaskListProps) {

  // Delete a task
    const deleteTask = async (taskId: string) => {
      try {
        // Remove from Firestore
        const taskRef = doc(db, "tasks", taskId);
        await deleteDoc(taskRef);
  
        // Remove from local state
        setTasks([...tasks.filter((task) => task.id !== taskId)]);
  
        // Reset editing state if needed
        if (editing.taskId === taskId) {
          setEditing({
            taskId: null,
            text: "",
          });
        }
      } catch (err) {
        console.error("Error deleting task:", err);
        Alert.alert("Error", "Could not delete task. Please try again.");
      }
    };
  
  // Toggle task completion status
    const toggleTaskCompletion = async (
      taskId: string,
      currentStatus: boolean
    ) => {
      // Update task completion status in Firestore
      api.updateTaskCompletion(taskId, currentStatus);
  
      // Update local state
      setTasks([...tasks.filter((task) => task.id !== taskId)]);
    };


  const TASK_MENU_ACTIONS = [
      {
        title: "Edit",
        systemIcon: Platform.OS === "ios" ? "square.and.pencil" : undefined,
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

  // Render each task item
    const renderTask = ({ item }: { item: Task }) => {
      const isEditing = item.id === editing.taskId;
  
      // Define menu actions
      const menuActions = TASK_MENU_ACTIONS;
  
      return (
        <ContextMenu
          actions={menuActions}
          onPress={(e) => {
            // Handle menu action selection
            if (e.nativeEvent.index === 0) {
              // Edit action
              setEditing({
                taskId: item.id,
                text: item.title,
              });
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
                    value={editing.text}
                    onChangeText={(text) => setEditing({ ...editing, text })}
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

  return (
    <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => {
            if (editing.taskId) {
              saveTaskTitle(editing.taskId);
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
              editing.taskId && styles.addTaskButtonDisabled,
            ]}
            onPress={createNewTask}
            disabled={editing.taskId !== null}
          >
            <Feather name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
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

});
