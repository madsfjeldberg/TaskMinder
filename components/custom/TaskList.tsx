import React from "react";
import { FlatList } from "react-native";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { TaskListProps } from "@/types/types";


export default function TaskList({
  tasks,
  editingTaskId,
  saveTaskTitle,
  createNewTask,
  renderTask,
}: TaskListProps) {
  return (
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
});
