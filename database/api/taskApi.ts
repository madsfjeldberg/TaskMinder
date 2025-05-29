import { supabase } from "../supabase";
import { Task, List, newTask } from "@/types/types";

const createTask = async (task: newTask) => {
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      name: task.name,
      listId: task.listId,
      completed: task.completed,
    })
    .select();
  if (error) {
    console.error("Error creating task:", error);
    throw error;
  }
  return data;
};

const fetchTaskById = async (taskId: string | string[]) => {
  const { data: task, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId);
  if (error) {
    console.error("Error fetching task by ID:", error);
    throw error;
  }
  if (!task || task.length === 0) {
    console.warn("No task found with the given ID:", taskId);
    return null;
  }
  return task[0];
};

const fetchTasks = async (selectedList: List | null) => {
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
};

const updateTaskCompletion = async (taskId: string, currentStatus: boolean) => {
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

const deleteTask = async (task: Task) => {
  console.log("Deleting task:", task);
  const { error } = await supabase.from("tasks").delete().eq("id", task.id);

  if (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
  return true;
};

const taskApi = {
  createTask,
  fetchTaskById,
  fetchTasks,
  updateTask,
  updateTaskCompletion,
  deleteTask,
};

export default taskApi;