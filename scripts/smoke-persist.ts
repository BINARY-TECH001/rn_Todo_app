import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Minimal Task type matching app
interface Task {
  id: number;
  title: string;
  category: 'note' | 'event' | 'goal';
  date: string;
  time: string;
  notes: string;
  completed: boolean;
}

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
}

// In-memory storage shim that mimics AsyncStorage's string-based API but
// works synchronously for this smoke test. createJSONStorage expects
// an object with getItem/setItem/removeItem which return Promises.
function createMemoryStorage() {
  const store: Record<string, string> = {};
  return {
    getItem: async (key: string) => {
      return store[key] ?? null;
    },
    setItem: async (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: async (key: string) => {
      delete store[key];
    },
    // expose for inspection
    _store: store,
  } as const;
}

async function run() {
  const memoryStorage = createMemoryStorage();

  // create a persist-enabled store using the in-memory storage
  const useStore = create<TaskState>()(
    persist(
      (set) => ({
        tasks: [],
        addTask: (t) =>
          set((s) => ({
            tasks: [...s.tasks, { ...t, id: s.tasks.length + 1, completed: false }],
          })),
      }),
      {
        name: 'test-task-storage',
        storage: createJSONStorage(() => memoryStorage as unknown as Storage),
      }
    )
  );

  // add a task and allow persist to write
  useStore.getState().addTask({ title: 'Test', category: 'note', date: '', time: '', notes: '' });

  // read serialized value directly from memory to assert it was written
  const raw = memoryStorage._store['test-task-storage'];
  if (!raw) {
    console.error('FAIL: no raw entry in storage');
    process.exit(1);
  }

  // now simulate reload by creating a fresh store with the same storage
  const useStore2 = create<TaskState>()(
    persist(
      (set) => ({
        tasks: [],
        addTask: (t) =>
          set((s) => ({
            tasks: [...s.tasks, { ...t, id: s.tasks.length + 1, completed: false }],
          })),
      }),
      {
        name: 'test-task-storage',
        storage: createJSONStorage(() => memoryStorage as unknown as Storage),
      }
    )
  );

  // small delay to let async storage settle (shouldn't be needed but safe)
  await new Promise((r) => setTimeout(r, 50));

  const tasksAfterReload = useStore2.getState().tasks;

  if (tasksAfterReload.length === 1 && tasksAfterReload[0].title === 'Test') {
    console.log('PASS: persistence smoke test succeeded');
    process.exit(0);
  }

  console.error('FAIL: task not persisted after reload', tasksAfterReload);
  process.exit(1);
}

run().catch((err) => {
  console.error('ERROR', err);
  process.exit(2);
});
