import {} from 'react';

export default function Resources({ resources }: { resources: string[] }) {
  return (
    <div className="mb-4 p-4 bg-purple-50 rounded-xl shadow">
      <h2 className="text-lg font-bold mb-2 text-purple-700">Resources</h2>
      {resources.length === 0 ? (
        <div className="text-gray-400">No resources added yet.</div>
      ) : (
        <ul className="list-disc ml-6">
          {resources.map((item, i) => (
            <li key={i}><a href={item} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{item}</a></li>
          ))}
        </ul>
      )}
    </div>
  );
}
