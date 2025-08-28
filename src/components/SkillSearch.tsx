import React from 'react';

export default function SkillSearch({ onSelect }: { onSelect: (skill: string) => void }) {
  const [query, setQuery] = React.useState('');
  const skills = ['React', 'Python', 'Node.js', 'Data Science', 'Docker', 'TypeScript'];
  const filtered = skills.filter(s => s.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="mb-4">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search a skill to learn..."
        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
      />
      {query && (
        <div className="bg-white shadow rounded mt-2">
          {filtered.length === 0 ? (
            <div className="p-2 text-gray-400">No skills found</div>
          ) : (
            filtered.map(skill => (
              <div
                key={skill}
                className="cursor-pointer px-4 py-2 hover:bg-blue-100"
                onClick={() => onSelect(skill)}
              >
                {skill}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
