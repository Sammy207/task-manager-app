import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Task } from '../types';
import { format } from 'date-fns';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const statusIcons = {
  todo: Clock,
  in_progress: AlertCircle,
  completed: CheckCircle,
};

export function TodosPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    async function getTasks() {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setTasks(data || []);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      getTasks();
    }
  }, [user]);

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (err) {
      console.error('Error updating task:', err);
      toast.error('Failed to update task status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">No tasks found. Create your first task!</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Tasks</h1>
      <ul className="space-y-4">
        {tasks.map((task) => {
          const StatusIcon = statusIcons[task.status];
          const dueDate = task.due_date ? new Date(task.due_date) : null;
          const isOverdue = dueDate && new Date() > dueDate && task.status !== 'completed';

          return (
            <li
              key={task.id}
              className="bg-white shadow rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                  {task.description && (
                    <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                  )}
                  <div className="mt-2 flex items-center space-x-4">
                    <span className={clsx(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      priorityColors[task.priority]
                    )}>
                      {task.priority}
                    </span>
                    {dueDate && (
                      <span className={clsx(
                        'text-sm',
                        isOverdue ? 'text-red-600' : 'text-gray-500'
                      )}>
                        Due: {format(dueDate, 'MMM d, yyyy')}
                        {isOverdue && ' (Overdue)'}
                      </span>
                    )}
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                      className="text-sm text-gray-500 border-gray-300 rounded-md"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <StatusIcon className={clsx(
                      'h-5 w-5',
                      task.status === 'completed' ? 'text-green-500' :
                      task.status === 'in_progress' ? 'text-yellow-500' :
                      'text-gray-400'
                    )} />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}