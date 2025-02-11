import React from 'react';
import { useTaskStore } from '../store/taskStore';
import { format, addDays, eachDayOfInterval, isSameDay } from 'date-fns';
import clsx from 'clsx';

export function ProjectGantt() {
  const { tasks } = useTaskStore();
  const [startDate] = React.useState(new Date());
  
  // Show 14 days by default
  const days = eachDayOfInterval({
    start: startDate,
    end: addDays(startDate, 13)
  });

  return (
    <div className="h-full px-4 py-6 sm:px-6 lg:px-8 overflow-x-auto">
      <div className="bg-white rounded-lg shadow min-w-[800px]">
        <div className="grid grid-cols-[200px_1fr]">
          {/* Header */}
          <div className="p-4 font-semibold text-gray-700 border-b">
            Task
          </div>
          <div className="grid grid-cols-14 border-b">
            {days.map(day => (
              <div
                key={day.toISOString()}
                className="p-4 text-center text-sm font-medium text-gray-500 border-l"
              >
                {format(day, 'MMM d')}
              </div>
            ))}
          </div>

          {/* Tasks */}
          {tasks.map(task => (
            <React.Fragment key={task.id}>
              <div className="p-4 border-b">
                <div className="text-sm font-medium text-gray-900">{task.title}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {task.status} • {task.priority}
                </div>
              </div>
              <div className="grid grid-cols-14 border-b">
                {days.map(day => {
                  const isTaskDay = task.due_date && isSameDay(new Date(task.due_date), day);
                  return (
                    <div
                      key={day.toISOString()}
                      className={clsx(
                        'border-l p-2',
                        isTaskDay && 'bg-indigo-50'
                      )}
                    >
                      {isTaskDay && (
                        <div className="h-full w-full bg-indigo-600 rounded-sm" />
                      )}
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}