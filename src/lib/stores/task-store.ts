import { create } from 'zustand'

export interface Task {
  id: string
  title: string
  description?: string
  createdAt: string
  status: 'pending' | 'completed'
}

interface TaskState {
  tasks: Task[]
}

interface TaskActions {
  addTask: (task: { title: string; description?: string }) => void
  toggleTask: (id: string) => void
}

type TaskStore = TaskState & TaskActions

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  addTask: ({ title, description }) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id: crypto.randomUUID(),
          title,
          description,
          createdAt: new Date().toISOString(),
          status: 'pending',
        },
      ],
    })),
  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === 'completed' ? 'pending' : 'completed',
            }
          : task
      ),
    })),
}))

export const useTasks = () => useTaskStore((state) => state.tasks)
