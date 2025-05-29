import { supabase } from "../supabase";
import auth from "../auth";
import { TaskMarker, List } from "@/types/types";

const createList = async (
  name: string,
) => {
  const currentUser = await auth.getCurrentUser();
  let userId = currentUser?.id;
  if (!userId) {
    return;
  }

  const { data, error } = await supabase
    .from("task_lists")
    .insert({
      name,
      userId,
      location: null,
    })
    .select();
  if (error) {
    console.error("Error creating list:", error);
    throw error;
  }
  return data;
};

const fetchTaskLists = async () => {
  const currentUser = await auth.getCurrentUser();
  let userId = currentUser?.id;
  if (!userId) {
    return;
  }

  let { data: task_lists, error } = await supabase
    .from("task_lists")
    .select("*")
    .eq("userId", userId);

  if (error) {
    console.error("Error fetching task lists:", error);
    throw error;
  }
  return task_lists;
};

const updateList = async (list: List) => {
  console.log("Updating list:", list);
  const { data, error } = await supabase
    .from("task_lists")
    .update({
      name: list.name,
      location: {
        latitude: list.location?.latitude,
        longitude: list.location?.longitude,
      },
    })
    .eq("id", list.id)
    .select();

  if (error) {
    console.error("Error updating task list:", error);
    throw error;
  }
  return data;
};


const updateListLocation = async (listId: string, marker: TaskMarker) => {
  const { error } = await supabase
    .from("task_lists")
    .update({
      location: {
        latitude: marker.coordinate.latitude,
        longitude: marker.coordinate.longitude,
      },
    })
    .eq("id", listId);
  if (error) {
    console.error("Error updating list location:", error);
    throw error;
  }
};

const deleteTaskList = async (listId: number) => {
  const { error } = await supabase.from("task_lists").delete().eq("id", listId);
  if (error) {
    console.error("Error deleting task list:", error);
    throw error;
  }
  return true;
};

const listApi = {
  createList,
  fetchTaskLists,
  updateList,
  updateListLocation,
  deleteTaskList,
}

export default listApi;