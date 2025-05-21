import { Task, List, TaskMarker } from "@/types/types";
import { db } from "./firebase";
import {
  doc,
  query,
  updateDoc,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
import { auth } from "./firebase";

const handleFirebaseOperation = async (
  operation: () => Promise<void>,
  errorMessage: string
) => {
  try {
    await operation();
  } catch (err) {
    console.error(errorMessage, err);
    throw err;
  }
};

export const fetchTaskLists = async (
  selectedList: List | null,
) => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.error("No user logged in");
    return;
  }

  // Create a query that filters by userId only
  const q = query(
    collection(db, "task_lists"),
    where("userId", "==", currentUser.uid)
  );

  // Execute the query
  const querySnapshot = await getDocs(q);
  const lists: List[] = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      createdAt: data.createdAt?.toDate() || new Date(),
      userId: data.userId,
      location: data.location || null,
    };
  });

  return lists;
};

export const fetchTasks = async (
  selectedList: List | null
) => {
    // Create a query against the tasks collection, filtered by list ID
    console.log("Fetching tasks for list ID:", selectedList?.id);
    const tasksQuery = query(
      collection(db, "tasks"),
      where("listId", "==", selectedList?.id)
    );

    // Execute the query
    const querySnapshot = await getDocs(tasksQuery);

    // Map the documents to our Task interface
    const tasksList: Task[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        completed: data.completed || false,
        location: data.location || null,
      };
    });

    return tasksList;
};

export const updateTaskCompletion = async (
  taskId: string,
  currentStatus: boolean
) => {
  handleFirebaseOperation(async () => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      completed: !currentStatus,
    });
  }, "Error updating task:");
};

export const updateTaskLocation = async (
  taskId: string,
  marker: TaskMarker
) => {
  handleFirebaseOperation(async () => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      location: {
        latitude: marker.coordinate.latitude,
        longitude: marker.coordinate.longitude,
      },
    });
  }, "Error updating task location:");
};

export const updateListLocation = async(
  listId: string,
  marker: TaskMarker
) => {
  handleFirebaseOperation(async () => {
    const listRef = doc(db, "task_lists", listId);
    await updateDoc(listRef, {
      location: {
        latitude: marker.coordinate.latitude,
        longitude: marker.coordinate.longitude,
      },
    });
  }, "Error updating list location:");
}


const api = {
  fetchTaskLists,
  fetchTasks,
  updateTaskCompletion,
  updateTaskLocation,
  updateListLocation,
}

export default api;