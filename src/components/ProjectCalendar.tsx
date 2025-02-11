import React from 'react';
import { useTaskStore } from '../store/taskStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import clsx from 'clsx';

export function ProjectCalendar() {
  const { tasks } = useTaskStore();
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDay = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.due_date);
      return isSameDay(taskDate, date);
    });
  };

  return (
    <div className="h-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentDate(date => new Date(date.getFullYear(), date.getMonth() - 1))}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(date => new Date(date.getFullYear(), date.getMonth() + 1))}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              Next
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-white py-2">
              <div className="text-center text-sm font-semibold text-gray-700">{day}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map(day => {
            const dayTasks = getTasksForDay(day);
            return (
              <div
                key={day.toISOString()}
                className={clsx(
                  'bg-white min-h-[120px] p-2',
                  isToday(day) && 'bg-blue-50'
                )}
              >
                <div className="text-right text-sm text-gray-500">
                  {format(day, 'd')}
                </div>
                <div className="mt-2 space-y-1">
                  {dayTasks.map(task => (
                    <div
                      key={task.id}
                      className={clsx(
                        'text-xs p-1 rounded truncate',
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      )}
                    >
                      {task.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}