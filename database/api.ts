import { Task, List, TaskMarker, newTask } from "@/types/types";
import auth from "./auth";

import { supabase } from "./supabase";

const createList = async (
  name: string,
  userId: string | undefined,
  location: TaskMarker | null
) => {
  const { data, error } = await supabase.from("task_lists").insert({
    name,
    userId,
    location: location
      ? {
          latitude: location.coordinate.latitude,
          longitude: location.coordinate.longitude,
        }
      : null,
  }).select();
  if (error) {
    console.error("Error creating list:", error);
    throw error;
  }
  return data;
};

const createTask = async(
  task: newTask,
) => {
  const { data, error } = await supabase.from("tasks").insert({
    name: task.name,
    listId: task.listId,
    completed: task.completed,
  }).select();
  if (error) {
    console.error("Error creating task:", error);
    throw error;
  }
  return data;
}


const fetchTaskLists = async () => {
  const currentUser = auth.getCurrentUser();
  let userId = (await currentUser).data.user?.id;
  if (!userId) {
    return;
  }

  let { data: task_lists, error } = await supabase
    .from("task_lists")
    .select("*")
    .eq("userId", userId)
  
  if (error) {
    console.error("Error fetching task lists:", error);
    throw error;
  }
  return task_lists;
}



const fetchTasks = async (
  selectedList: List | null
) => {
    
  if (!selectedList) {
    return [];
  }

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("listId", selectedList.id);
  
  if (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }

  return tasks;
};

const updateList = async ( list: List ) => {
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
}

const updateTask = async (task: Task) => { 
  const { data, error } = await supabase
    .from("tasks")
    .update({
      name: task.name,
      completed: task.completed,
    })
    .eq("id", task.id)
    .select();
  
  if (error) {
    console.error("Error updating task:", error);
    throw error;
  }
  console.log("Updated task:", data);
  return data;
}

const updateTaskCompletion = async (
  taskId: string,
  currentStatus: boolean
) => {
  const { data, error } = await supabase
    .from("tasks")
    .update({ completed: !currentStatus })
    .eq("id", taskId)
    .select();
  
  if (error) {
    console.error("Error updating task completion:", error);
    throw error;
  }
  return data;
  
};

const updateListLocation = async(
  listId: string,
  marker: TaskMarker
) => {
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

const deleteTaskList = async (listId: string) => {
  const { error } = await supabase
    .from("task_lists")
    .delete()
    .eq("id", listId);
  if (error) {
    console.error("Error deleting task list:", error);
    throw error;
  }
  return true;
};

const deleteTask = async (task: Task) => {
  console.log("Deleting task:", task);
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", task.id);

  if (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
  return true;
};

const api = {
  createList,
  createTask,
  fetchTaskLists,
  fetchTasks,
  updateList,
  updateTask,
  updateTaskCompletion,
  updateListLocation,
  deleteTaskList,
  deleteTask,
}

export default api;