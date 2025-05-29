import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  FlatList,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Task, Subtask } from "@/types/types";
import taskApi from "@/database/api/taskApi";
import subTaskApi from "@/database/api/subTaskApi";
import { Feather } from "@expo/vector-icons";

export default function TaskScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  // --- New state for subtasks & input ---
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskName, setNewSubtaskName] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const taskId = id;
        const data = await taskApi.fetchTaskById(taskId);
        setTask(data);

        // fetch subtasks for this task
        const subtasks = await subTaskApi.fetchSubtasks(Number(taskId));
        setSubtasks(subtasks ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const addSubtask = async () => {
    if (!newSubtaskName.trim() || !task) return;
    try {
      const created = await subTaskApi.createSubtask(task.id, newSubtaskName.trim());
      console.log("Created subtask:", created);

      setSubtasks((prev) => [...prev, created[0]]);
      setNewSubtaskName("");
    } catch {
      Alert.alert("Error", "Could not add subtask");
    }
  };

  // smart delete handler
  const deleteSubtask = async (subtaskId: number) => {
    try {
      await subTaskApi.deleteSubtask(subtaskId);
      setSubtasks((prev) => prev.filter((subtask) => subtask.id !== subtaskId));
    } catch {
      Alert.alert("Error", "Could not delete subtask");
    }
  };

  // toggle subtask completion
  const toggleSubtaskCompleted = async (
    subtaskId: number,
    completed: boolean
  ) => {
    try {
      await subTaskApi.updateSubtask(subtaskId, { completed });
      const updated = subtasks.map((subtask) =>
        subtask.id === subtaskId ? { ...subtask, completed } : subtask
      );
      setSubtasks(updated);

      // if all subtasks are completed, mark main task completed
      if (task && updated.every((subtask) => subtask.completed) && !task.completed) {
        const updatedTask = { ...task, completed: true };
        await taskApi.updateTask(updatedTask);
        setTask(updatedTask);
      }
    } catch {
      Alert.alert("Error", "Could not update subtask status");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }
  if (!task) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Task not found.</Text>
        <Button title="Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.name}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Status:</Text>
        <Text
          style={[
            styles.value,
            task.completed ? styles.completed : styles.pending,
          ]}
        >
          {task.completed ? "Completed ✅" : "Pending ⏳"}
        </Text>
      </View>

      {/* Subtasks Section */}
      <View style={[styles.section, { marginTop: 24 }]}>
        <Text style={styles.sectionTitle}>Subtasks</Text>
        <FlatList
          data={subtasks}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.subtaskItem}>
              <TouchableOpacity
                onPress={() => toggleSubtaskCompleted(item.id, !item.completed)}
              >
                {item.completed ? (
                  <Feather name="check-square" size={24} color="#3498db" />
                ) : (
                  <Feather name="square" size={24} color="#3498db" />
                )}
              </TouchableOpacity>
              <Text
                style={[
                  item.completed ? styles.completed : styles.value,
                  styles.subtaskText,
                ]}
              >
                {item.name}
              </Text>
              <TouchableOpacity onPress={() => deleteSubtask(item.id)}>
                <Feather name="x" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No subtasks yet</Text>}
        />

        <View style={styles.addSubtaskRow}>
          <TextInput
            value={newSubtaskName}
            onChangeText={setNewSubtaskName}
            style={styles.input}
            placeholder="New subtask"
          />
          <Button title="Add" onPress={addSubtask} />
        </View>
      </View>

      <View style={styles.footer}>
        <Button title="Back to List" onPress={() => router.back()} />
      </View>
      </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333",
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 18,
    marginTop: 4,
    color: "#222",
  },
  completed: {
    fontSize: 18,
    marginTop: 4,
    color: "#2ecc71",
  },
  pending: {
    color: "#e67e22",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    color: "#3498db",
  },
  subtaskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  empty: {
    fontStyle: "italic",
    color: "#999",
    marginVertical: 8,
  },
  addSubtaskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#3498db",
    marginRight: 8,
    paddingVertical: 4,
  },
  footer: {
    marginTop: "auto",
  },
  subtaskText: {
    flex: 1,
    marginHorizontal: 8,
  },
});
