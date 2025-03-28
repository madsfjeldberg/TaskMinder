import { ListRenderItem } from "react-native";

type dbTask = {
  id: string;
  title: string;
  completed: boolean;
  location: {
    latitude: number;
    longitude: number;
  } | null;
};

// List interface
type dbTaskList = {
  id: string;
  name: string;
  createdAt: Date;
  userId: string;
};

type HorizontalScrollListProps = {
  taskLists: dbTaskList[];
  renderListItem: (list: dbTaskList) => React.ReactNode;
  setIsNewListModalVisible: (visible: boolean) => void;
  onRenameList: (list: dbTaskList) => void;
  onDeleteList: (listId: string) => void;
};

type TaskListProps = {
  tasks: dbTask[];
  editing: {
    taskId: string | null;
    text: string;
  };
  saveTaskTitle: (id: string) => void;
  createNewTask: () => void;
  renderTask: ListRenderItem<dbTask>;
};

type NewListModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onCreateList: () => void;
  newListName: string;
  setNewListName: (name: string) => void;
};

type MapModalProps = {
  isMapModalVisible: boolean;
  setIsMapModalVisible: (visible: boolean) => void;
  userLocation: UserLocation;
  taskLocation:
    | {
        latitude: number;
        longitude: number;
      }
    | null
    | undefined;
  onLocationSelect: (marker: TaskMarker) => void;
};

type TaskMarker = {
  coordinate: {
    latitude: number;
    longitude: number;
  };
};

type UserLocation = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export type {
  dbTask,
  dbTaskList,
  TaskListProps,
  HorizontalScrollListProps,
  NewListModalProps,
  MapModalProps,
  TaskMarker,
  UserLocation,
};
