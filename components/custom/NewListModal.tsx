import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView
} from "react-native";
import { NewListModalProps } from "@/types/types";

export default function NewListModal({
  visible,
  onClose,
  onCreateList,
  newListName,
  setNewListName,
}: NewListModalProps) {

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
    <KeyboardAvoidingView style={styles.modal}>
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
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, styles.createButton]}
            onPress={onCreateList}
          >
            <Text style={styles.createButtonText}>Create</Text>
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
});
