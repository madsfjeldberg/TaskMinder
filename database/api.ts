import { dbTask, dbTaskList } from "@/types/types";
import { db } from "./firebase";
import { query, where } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";




export const fetchTaskLists = async (
  setTaskLists: (lists: dbTaskList[]) => void,
  selectedListId: string | null,
  setSelectedListId: (id: string | null) => void
) => {
  try {
    console.log("Fetching task lists...");

    // Create a query against the taskLists collection
    const listQuery = query(collection(db, "task_lists"));

    // Execute the query
    const querySnapshot = await getDocs(listQuery);
    console.log(`Found ${querySnapshot.docs.length} task lists`);

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
  } catch (err) {
    console.error("Error fetching task lists:", err);
  }
};

export const fetchTasks = async (
  setTasks: (tasks: dbTask[]) => void,
  selectedListId: string | null,
  setError: (error: string) => void
) => {
  

  try {
    console.log(`Fetching tasks for list ID: ${selectedListId}`);

    // Create a query against the tasks collection, filtered by list ID
    const tasksQuery = query(
      collection(db, "tasks"),
      where("listId", "==", selectedListId)
    );

    // Execute the query
    const querySnapshot = await getDocs(tasksQuery);
    console.log(`Found ${querySnapshot.docs.length} tasks`);

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
  } catch (err) {
    console.error("Error fetching tasks:", err);
    setError("Failed to load tasks. Please try again later.");
  }
};