import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { EditListModalProps } from "@/types/types";
import { List } from "@/types/types";
import api from "@/database/api";


export default function EditListModal({
  taskLists,
  setTaskLists,
  selectedList,
  setSelectedList,
  visible,
  setVisible,
  onClose,
  setIsMapModalVisible
}: EditListModalProps) {

  const [newListName, setNewListName] = React.useState(selectedList?.name || "");

  const openMapModal = () => {
    setVisible(false);
    setIsMapModalVisible(true);
  };

  const handleEditList = async () => {
    if (!newListName.trim()) {
      Alert.alert("Error", "Please enter a list name");
      return;
    }
    if (!selectedList) {
      Alert.alert("Error", "No list selected");
      return;
    }
    selectedList.name = newListName.trim();

    const updatedList = await api.updateList({
      ...selectedList,
      name: newListName.trim(),
    });
    if (!updatedList) {
      Alert.alert("Error", "Failed to update list. Please try again.");
      return;
    }
  
    // Update local state
    const updatedTaskLists = taskLists.map((taskList) => {
      if (taskList.id === selectedList.id) {
        return { ...taskList, name: newListName.trim() };
      }
      return taskList;
    });
  
    setTaskLists(updatedTaskLists);
    setSelectedList(selectedList);
    setNewListName("");
    setVisible(false);

  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
    <KeyboardAvoidingView style={styles.modal}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Edit List</Text>

        <TextInput
          style={styles.input}
          placeholder="List Name (e.g., Work, Home)"
          placeholderTextColor="#999"
          value={newListName}
          onChangeText={setNewListName}
          autoFocus
        />

          <View style={styles.modalButtons}>
            {/* Cancel Button */}
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

            {/* Open Map Modal */}
          <TouchableOpacity
            style={[styles.modalButton, styles.createButton]}
            onPress={() => openMapModal()}
          >
            <Text style={styles.createButtonText}>Location</Text>
            </TouchableOpacity>
            {/* Update List */}
            <TouchableOpacity
            style={[styles.modalButton, styles.createButton]}
            onPress={handleEditList}
          >
            <Text style={styles.createButtonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
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
    minWidth: 60,
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
});