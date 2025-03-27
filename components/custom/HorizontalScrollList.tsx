import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { HorizontalScrollListProps, dbTaskList } from "@/types/types";
import ContextMenu from "react-native-context-menu-view";
export default function HorizontalScrollList({
  taskLists,
  renderListItem,
  setIsNewListModalVisible,
  onRenameList,
  onDeleteList,
}: HorizontalScrollListProps) {
  const LIST_MENU_ACTIONS = [
    {
      title: "Rename",
      systemIcon: Platform.OS === "ios" ? "square.and.pencil" : undefined,
      id: Platform.OS === "android" ? "edit" : undefined,
      destructive: false,
    },
    {
      title: "Delete",
      systemIcon: Platform.OS === "ios" ? "trash" : undefined,
      id: Platform.OS === "android" ? "delete" : undefined,
      destructive: true,
    },
  ];

  // New renderListWithContextMenu function
  const renderListWithContextMenu = (list: dbTaskList, index: number) => {
    return (
      <View key={`list_${list.id}_${index}`}>
        <ContextMenu
          actions={LIST_MENU_ACTIONS}
          onPress={(e) => {
            // Handle menu action selection
            if (e.nativeEvent.index === 0) {
              // Rename action
              onRenameList && onRenameList(list);
            } else if (e.nativeEvent.index === 1) {
              // Delete action
              Alert.alert(
                "Delete List",
                `Are you sure you want to delete "${list.name}"? All tasks in this list will also be deleted.`,
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Delete",
                    onPress: () => onDeleteList && onDeleteList(list.id),
                    style: "destructive",
                  },
                ]
              );
            }
          }}
          previewBackgroundColor="#f9f9f9"
        >
          {renderListItem(list)}
        </ContextMenu>
      </View>
    );
  };

  return (
    <View style={styles.listsContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listsScrollContent}
      >
        {/* Check for duplicate IDs and render uniquely */}
        {taskLists.map((list, index) => {
          // Use unique compound key with index fallback
          return renderListWithContextMenu(list, index);
        })}

        <TouchableOpacity
          style={styles.addListButton}
          onPress={() => setIsNewListModalVisible(true)}
        >
          <Feather name="plus" size={24} color="#3498db" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  listsContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listsScrollContent: {
    paddingHorizontal: 16,
  },
  addListButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
});
