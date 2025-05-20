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

type dbTaskList = {
  id: string;
  name: string;
  createdAt: Date;
  userId: string;
  location: ListLocation | null;
};

type HorizontalScrollListProps = {
  taskLists: dbTaskList[];
  setTaskLists: (lists: dbTaskList[]) => void;
  selectedList: dbTaskList | null;
  setSelectedList: (list: dbTaskList | null) => void;
  setIsMapModalVisible: (visible: boolean) => void;
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
  listLocation: ListLocation | null;
  onLocationSelect: (marker: TaskMarker) => void;
};

type TaskMarker = {
  coordinate: {
    latitude: number;
    longitude: number;
  };
};

type ListMarker = {
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
} | undefined;

type ListLocation = {
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
  ListMarker,
};
