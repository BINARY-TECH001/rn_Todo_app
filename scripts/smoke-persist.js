(async function(){
  // Minimal smoke test in plain JS to validate zustand persist with an in-memory storage
  const { create } = require('zustand');
  const { persist, createJSONStorage } = require('zustand/middleware');

  function createMemoryStorage() {
    const store = {};
    return {
      getItem: async (key) => store.hasOwnProperty(key) ? store[key] : null,
      setItem: async (key, value) => { store[key] = value; },
      removeItem: async (key) => { delete store[key]; },
      _store: store,
    };
  }

  const memoryStorage = createMemoryStorage();

  const useStore = create(
    persist(
      (set) => ({
        tasks: [],
        addTask: (t) => set((s) => ({ tasks: [...s.tasks, { ...t, id: s.tasks.length + 1, completed: false }] })),
      }),
      {
        name: 'test-task-storage',
        storage: createJSONStorage(() => memoryStorage),
      }
    )
  );

  useStore.getState().addTask({ title: 'Test', category: 'note', date: '', time: '', notes: '' });

  const raw = memoryStorage._store['test-task-storage'];
  if (!raw) {
    console.error('FAIL: no raw entry in storage');
    process.exit(1);
  }

  const useStore2 = create(
    persist(
      (set) => ({
        tasks: [],
        addTask: (t) => set((s) => ({ tasks: [...s.tasks, { ...t, id: s.tasks.length + 1, completed: false }] })),
      }),
      {
        name: 'test-task-storage',
        storage: createJSONStorage(() => memoryStorage),
      }
    )
  );

  // small delay
  await new Promise((r) => setTimeout(r, 50));

  const tasksAfterReload = useStore2.getState().tasks;
  if (tasksAfterReload.length === 1 && tasksAfterReload[0].title === 'Test') {
    console.log('PASS: persistence smoke test succeeded');
    process.exit(0);
  }

  console.error('FAIL: task not persisted after reload', tasksAfterReload);
  process.exit(1);
})();
