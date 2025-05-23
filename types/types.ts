type Task = {
  id: number;
  listId: number | undefined;
  name: string;
  completed: boolean;
  location: {
    latitude: number;
    longitude: number;
  } | null;
};

type newTask = {
  name: string;
  listId: number | undefined;
  completed: boolean;
  location: {
    latitude: number;
    longitude: number;
  } | null;
}

type List = {
  id: number;
  name: string;
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
    id: number | null;
    text: string;
  };
  setEditing: (editing: {
    id: number | null;
    text: string;
  }) => void;
  createNewTask: () => void;
};

type NewListModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreateList: () => void;
  newListName: string;
  setNewListName: (name: string) => void;
};

type EditListModalProps = {
  taskLists: List[];
  setTaskLists: (lists: List[]) => void;
  selectedList: List | null;
  setSelectedList: (list: List | null) => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onClose: () => void;
  setIsMapModalVisible: (visible: boolean) => void;
}

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
  newTask,
  List,
  TaskListProps,
  HorizontalScrollListProps,
  NewListModalProps,
  EditListModalProps,
  MapModalProps,
  TaskMarker,
  UserLocation,
  ListMarker,
};
