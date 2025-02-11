import React from 'react';
import { useAuthStore } from '../store/authStore';
import {
  Home,
  Inbox,
  FileText,
  BarChart2,
  Clock,
  Calendar,
  MoreHorizontal,
  Star,
  Users,
  FolderPlus,
  LogOut,
} from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: any) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { user, signOut } = useAuthStore();

  const navigation = [
    { name: 'Home', icon: Home, view: 'board' },
    { name: 'Calendar', icon: Calendar, view: 'calendar' },
    { name: 'Timeline', icon: BarChart2, view: 'gantt' },
    { name: 'Table', icon: FileText, view: 'table' },
  ];

  const spaces = [
    { name: 'Everything', icon: Star, count: null },
    { name: 'Team Space', icon: Users, count: null },
    { name: 'Projects', icon: FolderPlus, count: null },
  ];

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <span className="text-xl font-semibold text-gray-900">Team Space</span>
          </div>
          <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => onViewChange(item.view)}
                className={clsx(
                  item.view === currentView
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md'
                )}
              >
                <item.icon
                  className={clsx(
                    item.view === currentView ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 h-5 w-5'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </button>
            ))}
          </nav>

          <div className="mt-6 px-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Spaces
            </h3>
            <nav className="mt-2 space-y-1">
              {spaces.map((space) => (
                <button
                  key={space.name}
                  className="group flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                >
                  <space.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  <span className="flex-1">{space.name}</span>
                  {space.count && (
                    <span className="bg-gray-100 text-gray-600 ml-3 inline-block py-0.5 px-2 text-xs rounded-full">
                      {space.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div>
              <img
                className="inline-block h-9 w-9 rounded-full"
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.full_name
                )}&background=random`}
                alt=""
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {user.full_name}
              </p>
              <button
                onClick={signOut}
                className="text-xs font-medium text-gray-500 group-hover:text-gray-700 flex items-center"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}