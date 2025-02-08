import React, { useMemo } from 'react';
import { useTaskStore } from '../store/taskStore';
import { format, isPast, isToday } from 'date-fns';
import { CheckCircle, Clock, AlertCircle, Trash2, Edit2 } from 'lucide-react';
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

export function TaskList() {
  const { tasks, updateTask, deleteTask, filter, search, sortBy, sortOrder } = useTaskStore();

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Apply status filter
    if (filter !== 'all') {
      result = result.filter((task) => task.status === filter);
    }

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'due_date':
          comparison = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
          break;
        case 'priority': {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        }
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [tasks, filter, search, sortBy, sortOrder]);

  const handleStatusChange = (taskId: string, newStatus: string) => {
    updateTask(taskId, { status: newStatus as 'todo' | 'in_progress' | 'completed' });
  };

  if (filteredAndSortedTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flow-root">
        <ul className="-my-5 divide-y divide-gray-200">
          {filteredAndSortedTasks.map((task) => {
            const StatusIcon = statusIcons[task.status];
            const dueDate = new Date(task.due_date);
            const isOverdue = isPast(dueDate) && !isToday(dueDate) && task.status !== 'completed';

            return (
              <li key={task.id} className="py-5">
                <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {task.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{task.description}</p>
                      <div className="mt-2 flex items-center flex-wrap gap-2">
                        <span className={clsx(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          priorityColors[task.priority]
                        )}>
                          {task.priority}
                        </span>
                        <span className={clsx(
                          'text-sm',
                          isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'
                        )}>
                          Due: {format(dueDate, 'MMM d, yyyy')}
                          {isOverdue && ' (Overdue)'}
                        </span>
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
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
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => {}} // TODO: Implement edit functionality
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}