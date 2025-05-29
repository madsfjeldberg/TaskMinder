import auth from "../auth";
import { supabase } from "../supabase";

const createSubtask = async (taskId: number, name: string) => {
  const { data, error } = await supabase
    .from("sub_tasks")
    .insert({
      taskId,
      name,
    })
    .select();
  if (error) {
    console.error("Error creating subtask:", error);
    throw error;
  }
  return data;
};

const fetchSubtasks = async (taskId: number) => {
  const { data: subtasks, error } = await supabase
    .from("sub_tasks")
    .select("*")
    .eq("taskId", taskId);

  if (error) {
    console.error("Error fetching subtasks:", error);
    throw error;
  }

  return subtasks;
};

const updateSubtask = async (
  subtaskId: number,
  data: Partial<{ name: string; completed: boolean }>
) => {
  const { data: res, error } = await supabase
    .from("sub_tasks")
    .update(data)
    .eq("id", subtaskId)
    .select();
  if (error) {
    console.error("Error updating subtask:", error);
    throw error;
  }
  return res;
};

const deleteSubtask = async (subtaskId: number) => {
  const { error } = await supabase
    .from("sub_tasks")
    .delete()
    .eq("id", subtaskId);

  if (error) {
    console.error("Error deleting subtask:", error);
    throw error;
  }
  return true;
};

const subTaskApi = {
  createSubtask,
  fetchSubtasks,
  deleteSubtask,
  updateSubtask,
};

export default subTaskApi;
