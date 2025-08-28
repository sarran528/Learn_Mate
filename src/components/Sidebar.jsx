import React from 'react';

export default function Sidebar({ onSelect, active, darkMode }) {
  const items = [
    { name: 'Overview', icon: '🏠' },
    { name: 'Checklist', icon: '📋' },
    { name: 'Roadmap', icon: '🗺️' },
    { name: 'Schedule', icon: '📅' },
    { name: 'Resources', icon: '📚' }
  ];
  
  return (
    <aside className={`w-64 h-full border-r ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-gray-50 border-gray-200'} backdrop-blur-sm`}>
      <div className="p-6">
        <h2 className={`text-lg font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Navigation</h2>
        <nav className="space-y-2">
          {items.map(item => (
            <div 
              key={item.name} 
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center space-x-3 ${
                active === item.name 
                  ? (darkMode ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-500 text-white shadow-lg')
                  : (darkMode ? 'hover:bg-gray-700/50 text-gray-300' : 'hover:bg-gray-100 text-gray-700')
              }`}
              onClick={() => onSelect(item.name)}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
