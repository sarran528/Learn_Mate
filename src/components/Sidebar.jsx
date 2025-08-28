import React from 'react';

export default function Sidebar({ onSelect }) {
  const items = ['Overview', 'Checklist', 'Roadmap', 'Schedule', 'Resources', 'Chat'];
  return (
    <aside className="w-64 bg-gray-50 h-full border-r p-4">
      <nav className="space-y-2">
        {items.map(i => (
          <div key={i} className="p-2 rounded hover:bg-gray-100 cursor-pointer" onClick={() => onSelect(i)}>{i}</div>
        ))}
      </nav>
    </aside>
  );
}
