import { dbTask, dbTaskList, TaskMarker } from "@/types/types";
import { db } from "./firebase";
import { doc, query, updateDoc, where } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";

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
  setTaskLists: (lists: dbTaskList[]) => void,
  selectedListId: string | null,
  setSelectedListId: (id: string | null) => void
) => {
  handleFirebaseOperation(
    async () => {

      // Create a query against the taskLists collection
      const listQuery = query(collection(db, "task_lists"));

      // Execute the query
      const querySnapshot = await getDocs(listQuery);

      // Map the documents to our TaskList interface
      const listData: dbTaskList[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          createdAt: new Date(data.createdAt?.seconds * 1000 || Date.now()),
        };
      });

      setTaskLists(listData);

      // Set the first list as selected by default if there's at least one list
      if (listData.length > 0 && !selectedListId) {
        setSelectedListId(listData[0].id);
      }
    },
    "Error fetching task lists:"
  );
};

export const fetchTasks = async (
  setTasks: (tasks: dbTask[]) => void,
  selectedListId: string | null,
) => {
  handleFirebaseOperation(
    async () => {

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
    },
    "Error fetching tasks:"
  );
};

export const updateTaskCompletion = async (taskId: string, currentStatus: boolean) => {
  handleFirebaseOperation(
    async () => {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        completed: !currentStatus,
      });
  },
  "Error updating task:"
);
};

export const updateTaskLocation = async (taskId: string, marker: TaskMarker) => {
  handleFirebaseOperation(
    async () => {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        location: marker,
      });
    },
    "Error updating task location:"
  );
};

