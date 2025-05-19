import { dbTask, dbTaskList, TaskMarker } from "@/types/types";
import { db } from "./firebase";
import {
  doc,
  query,
  updateDoc,
  where,
  collection,
  getDocs,
  orderBy,
  onSnapshot,
  deleteDoc,
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

export const fetchTaskLists = (
  setTaskLists: (lists: dbTaskList[]) => void,
  selectedListId: string | null,
  setSelectedListId: (id: string | null) => void
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

  // Set up real-time listener
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const lists: dbTaskList[] = [];
    const uniqueIds = new Set<string>();

    snapshot.forEach((doc) => {
      const docId = doc.id;

      // Only add if we haven't seen this ID before
      if (!uniqueIds.has(docId)) {
        uniqueIds.add(docId);
        const data = doc.data();
        lists.push({
          id: docId,
          name: data.name,
          createdAt: data.createdAt?.toDate() || new Date(),
          userId: data.userId,
        });
      } else {
        console.warn(`Duplicate task list ID found: ${docId}`);
      }
    });

    // Sort lists by creation date after fetching
    lists.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    setTaskLists(lists);

    // If no list is selected and we have lists, select the first one
    if (!selectedListId && lists.length > 0) {
      setSelectedListId(lists[0].id);
    }
  });

  // Return unsubscribe function
  return unsubscribe;
};

export const fetchTasks = async (
  setTasks: (tasks: dbTask[]) => void,
  selectedListId: string | null
) => {
  handleFirebaseOperation(async () => {
    // Create a query against the tasks collection, filtered by list ID
    const tasksQuery = query(
      collection(db, "tasks"),
      where("listId", "==", selectedListId)
    );

    // Execute the query
    const querySnapshot = await getDocs(tasksQuery);

    // Map the documents to our Task interface
    const tasksList: dbTask[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        completed: data.completed || false,
        location: data.location || null,
      };
    });

    setTasks(tasksList);
  }, "Error fetching tasks:");
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
