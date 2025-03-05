import { ListRenderItem } from "react-native";

interface dbTask {
  id: string;
  title: string;
  completed: boolean;
}

// List interface
interface dbTaskList {
  id: string;
  name: string;
  createdAt: Date;
}

interface HorizontalScrollListProps {
  taskLists: dbTaskList[];
  renderListItem: (list: dbTaskList) => React.ReactNode;
  setIsNewListModalVisible: (visible: boolean) => void;
}

interface TaskListProps {
  tasks: dbTask[];
  editingTaskId: string | null;
  saveTaskTitle: (id: string) => void;
  createNewTask: () => void;
  renderTask: ListRenderItem<dbTask>;
}

export type { dbTask, dbTaskList, TaskListProps, HorizontalScrollListProps };