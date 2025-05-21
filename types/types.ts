import { ListRenderItem } from "react-native";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  location: {
    latitude: number;
    longitude: number;
  } | null;
};

type List = {
  id: string;
  name: string;
  createdAt: Date;
  userId: string;
  location: ListLocation | null;
};

type HorizontalScrollListProps = {
  taskLists: List[];
  setTaskLists: (lists: List[]) => void;
  selectedList: List | null;
  setSelectedList: (list: List | null) => void;
  setIsMapModalVisible: (visible: boolean) => void;
};

type TaskListProps = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  editing: {
    taskId: string | null;
    text: string;
  };
  setEditing: (editing: {
    taskId: string | null;
    text: string;
  }) => void;
  saveTaskTitle: (id: string) => void;
  createNewTask: () => void;
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
  Task,
  List,
  TaskListProps,
  HorizontalScrollListProps,
  NewListModalProps,
  MapModalProps,
  TaskMarker,
  UserLocation,
  ListMarker,
};
