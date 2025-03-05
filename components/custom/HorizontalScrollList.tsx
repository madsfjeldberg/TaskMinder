import { Feather } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { HorizontalScrollListProps } from "@/types/types";
export default function HorizontalScrollList({
  taskLists,
  renderListItem,
  setIsNewListModalVisible,
}: HorizontalScrollListProps) {
  return (
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
  )
}

const styles = StyleSheet.create({
  listsContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
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
