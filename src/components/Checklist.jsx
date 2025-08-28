import React from 'react';

export default function Checklist({ items = [], onRemove, onToggle }) {
  // Calculate progress percentage
  const completedItems = items.filter(item => item.completed);
  const progressPercentage = items.length > 0 
    ? Math.round((completedItems.length / items.length) * 100) 
    : 0;

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold">Learning Checklist</h2>
        <span className="text-sm text-gray-500">
          {completedItems.length} of {items.length} complete
        </span>
      </div>
      
      {/* Progress bar */}
      {items.length > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-green-500 h-2 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      )}
      
      {items.length === 0 ? (
        <p className="text-gray-400">No tasks yet</p>
      ) : (
        <ul className="space-y-2">
          {items.map((task, idx) => (
            <li 
              key={idx} 
              className={`flex items-center p-2 rounded border ${
                task.completed 
                  ? 'bg-green-50 border-green-100' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle && onToggle(idx)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span 
                className={`ml-3 flex-grow ${
                  task.completed 
                    ? 'line-through text-gray-500' 
                    : 'text-gray-700'
                }`}
              >
                {task.text || task}
              </span>
              <button 
                onClick={() => onRemove(idx)} 
                className="ml-2 text-gray-400 hover:text-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
      
      {completedItems.length === items.length && items.length > 0 && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
          🎉 You've completed all tasks! Great job on your learning journey!
        </div>
      )}
    </div>
  );
}
