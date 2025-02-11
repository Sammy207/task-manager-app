import React, { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { Task } from '../types';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

const columns = [
  { id: 'todo', title: 'To Do', icon: Clock },
  { id: 'in_progress', title: 'In Progress', icon: AlertCircle },
  { id: 'completed', title: 'Completed', icon: CheckCircle },
];

export function ProjectBoard() {
  const { tasks, updateTask } = useTaskStore();
  const [isDragging, setIsDragging] = useState(false);

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  const onDragEnd = (result: any) => {
    setIsDragging(false);
    
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    updateTask(draggableId, { status: newStatus as Task['status'] });
  };

  return (
    <div className="h-full px-4 py-6 sm:px-6 lg:px-8">
      <DragDropContext
        onDragStart={() => setIsDragging(true)}
        onDragEnd={onDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex flex-col bg-gray-50 rounded-lg"
            >
              <div className="p-4 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <column.icon className="h-5 w-5 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-900">
                    {column.title}
                  </h3>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">
                    {getTasksByStatus(column.id).length}
                  </span>
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={clsx(
                      'flex-1 p-4 space-y-4 overflow-y-auto',
                      snapshot.isDraggingOver && 'bg-gray-100'
                    )}
                  >
                    {getTasksByStatus(column.id).map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={clsx(
                              'bg-white p-4 rounded-lg shadow-sm',
                              snapshot.isDragging && 'shadow-lg'
                            )}
                          >
                            <h4 className="text-sm font-medium text-gray-900">
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                            <div className="mt-2 flex items-center space-x-2">
                              <span
                                className={clsx(
                                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                                  task.priority === 'high'
                                    ? 'bg-red-100 text-red-800'
                                    : task.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                                )}
                              >
                                {task.priority}
                              </span>
                              {task.due_date && (
                                <span className="text-xs text-gray-500">
                                  Due: {new Date(task.due_date).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}