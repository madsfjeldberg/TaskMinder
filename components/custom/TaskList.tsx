import React from "react";
import { FlatList } from "react-native";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { TaskListProps } from "@/types/types";
import { Text, View, TextInput } from "react-native";
import { Task } from "@/types/types";
import taskApi from "@/database/api/taskApi";
import { router } from "expo-router";

export default function TaskList({
  tasks,
  setTasks,
  editing,
  setEditing,
  createNewTask,
}: TaskListProps) {
  
  const updateTask = async (task: Task) => {
    if (!editing.text.trim()) {
      // If empty, delete the task
      try {
        await taskApi.deleteTask(task);
      } catch (err) {
        console.error("Error deleting empty task:", err);
      }

      // Update local state
      let updatedTasks = tasks.filter((t) => t.id !== task.id);
      setTasks(updatedTasks);
      setEditing({
        id: null,
        text: "",
      });
      return;
    }
    task.name = editing.text;

    await taskApi.updateTask(task);

    let updatedTasks = tasks.map((t) => (t.id === task.id ? task : t));
    setTasks(updatedTasks);

    setEditing({
      id: null,
      text: "",
    });
  }

  // Toggle task completion status
  const toggleTaskCompletion = async ( task: Task ) => {
    task.completed = !task.completed;
    await taskApi.updateTask(task);

    let updatedTasks = tasks.map((t) => (t.id === task.id ? task : t));
    setTasks(updatedTasks);
 
  };

  // Render each task item
    const renderTask = ({ item }: { item: Task }) => {
      const isEditing = item.id === editing.id;
  
      return (
          <TouchableOpacity
            style={styles.taskItem}
            onPress={() => {
              if (!isEditing) {
                {/* open task view */ }
                router.push(`/tasks/${item.id}`);
              }
            }}
            onLongPress={() => {
              if (!isEditing) {
                setEditing({
                  id: item.id,
                  text: item.name,
                });
              }
            }}
          >
            <View style={styles.taskContent}>
              <View style={styles.taskHeader}>
                {!isEditing && (
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => toggleTaskCompletion(item)}
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
                    onBlur={() => updateTask(item)}
                  />
                ) : (
                  <Text
                    style={[
                      styles.taskTitle,
                      item.completed && styles.completedTaskText,
                    ]}
                  >
                    {item.name}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
      );
    };

  
  return (
    <>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContainer}
      />
      {/* Add Task Button, bottom right */}
      <TouchableOpacity
        style={[
          styles.addTaskButton,
          editing.id ? styles.addTaskButtonDisabled : null,
        ]}
        onPress={createNewTask}
        disabled={editing.id !== null}
      >
        <Feather name="plus" size={30} color="#fff" />
      </TouchableOpacity>
    </> 
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
