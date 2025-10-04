import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../types/tasks";

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "completed">) => void;
  toggleComplete: (id: number) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (newTask) => {
        const tasks = get().tasks;
        const id = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
        set({ tasks: [...tasks, { ...newTask, id, completed: false }] });
      },
      toggleComplete: (id) =>
        set({
          tasks: get().tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        }),
    }),
    {
      name: "task-storage",
      // createJSONStorage wraps AsyncStorage and provides the correct
      // types for zustand's persist storage while handling JSON
      // serialization/deserialization automatically.
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
