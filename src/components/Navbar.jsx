import React from 'react';

export default function Navbar({ title = 'Learn_mate', darkMode = false, onToggleDark }) {
  return (
    <header className={`w-full py-3 px-4 border-b ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-yellow-500' : 'bg-blue-500'} text-white`}></div>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        <div>
          <button onClick={onToggleDark} className="px-3 py-1 rounded-md border">
            {darkMode ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>
    </header>
  );
}
