import React from 'react';
import { useTaskStore } from '../store/taskStore';
import { Search, SortAsc, SortDesc } from 'lucide-react';
import clsx from 'clsx';

export function TaskFilters() {
  const { 
    filter, 
    setFilter, 
    search, 
    setSearch, 
    sortBy, 
    setSortBy,
    sortOrder,
    setSortOrder
  } = useTaskStore();

  const filters = [
    { value: 'all', label: 'All Tasks' },
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const sortOptions = [
    { value: 'due_date', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'created_at', label: 'Created Date' },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex space-x-2">
          {filters.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value as any)}
              className={clsx(
                'px-3 py-2 text-sm font-medium rounded-md',
                filter === value
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {sortOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                Sort by {label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 text-gray-400 hover:text-gray-500"
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="h-5 w-5" />
            ) : (
              <SortDesc className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}