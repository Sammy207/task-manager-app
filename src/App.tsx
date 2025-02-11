import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useTaskStore } from './store/taskStore';
import { Auth } from './components/Auth';
import { Sidebar } from './components/Sidebar';
import { ProjectBoard } from './components/ProjectBoard';
import { ProjectCalendar } from './components/ProjectCalendar';
import { ProjectGantt } from './components/ProjectGantt';
import { ProjectTable } from './components/ProjectTable';
import { CreateTask } from './components/CreateTask';
import { Search } from 'lucide-react';

type ViewType = 'board' | 'list' | 'calendar' | 'gantt' | 'table';

function App() {
  const { user } = useAuthStore();
  const { fetchTasks, setSearch } = useTaskStore();
  const [currentView, setCurrentView] = useState<ViewType>('board');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  if (!user) {
    return <Auth />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'board':
        return <ProjectBoard />;
      case 'calendar':
        return <ProjectCalendar />;
      case 'gantt':
        return <ProjectGantt />;
      case 'table':
        return <ProjectTable />;
      default:
        return <ProjectBoard />;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Toaster position="top-right" />
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentView('board')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'board'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Board
                </button>
                <button
                  onClick={() => setCurrentView('calendar')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'calendar'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Calendar
                </button>
                <button
                  onClick={() => setCurrentView('gantt')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'gantt'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Gantt
                </button>
                <button
                  onClick={() => setCurrentView('table')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'table'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Table
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>

        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Task</h2>
                <CreateTask onClose={() => setIsCreateModalOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;