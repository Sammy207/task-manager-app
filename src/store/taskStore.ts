import { create } from 'zustand';
import { Task } from '../types';
import { supabase } from '../lib/supabase';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  filter: 'all' | 'todo' | 'in_progress' | 'completed';
  search: string;
  sortBy: 'due_date' | 'priority' | 'created_at';
  sortOrder: 'asc' | 'desc';
  createTask: (task: Omit<Task, 'id' | 'created_at'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  fetchTasks: () => Promise<void>;
  setFilter: (filter: 'all' | 'todo' | 'in_progress' | 'completed') => void;
  setSearch: (search: string) => void;
  setSortBy: (sortBy: 'due_date' | 'priority' | 'created_at') => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  filter: 'all',
  search: '',
  sortBy: 'created_at',
  sortOrder: 'desc',

  fetchTasks: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    set({ tasks: data as Task[], loading: false });
  },

  createTask: async (task) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();

    if (error) throw error;
    set({ tasks: [data as Task, ...get().tasks] });
  },

  updateTask: async (id, updates) => {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    set({
      tasks: get().tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    });
  },

  deleteTask: async (id) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    set({
      tasks: get().tasks.filter((task) => task.id !== id),
    });
  },

  setFilter: (filter) => set({ filter }),
  setSearch: (search) => set({ search }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
}));