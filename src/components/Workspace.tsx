
import React, { useState } from 'react';

const defaultRoadmap = [
  'Define project goals',
  'Set up project structure',
  'Implement authentication',
  'Build chat interface',
  'Integrate AI agent',
  'Test and deploy'
];

const defaultChecklist = [
  { task: 'Create README', done: false },
  { task: 'Set up backend', done: false },
  { task: 'Set up frontend', done: false },
  { task: 'Connect frontend & backend', done: false },
  { task: 'Write tests', done: false }
];

export default function Workspace() {
  const [roadmap, setRoadmap] = useState(defaultRoadmap);
  const [checklist, setChecklist] = useState(defaultChecklist);
  const [search, setSearch] = useState('');
  const [newRoadmapStep, setNewRoadmapStep] = useState('');
  const [newChecklistTask, setNewChecklistTask] = useState('');

  // Filter roadmap and checklist by search
  const filteredRoadmap = roadmap.filter(step => step.toLowerCase().includes(search.toLowerCase()));
  const filteredChecklist = checklist.filter(item => item.task.toLowerCase().includes(search.toLowerCase()));

  // Toggle checklist task
  const toggleTask = idx => {
    setChecklist(checklist =>
      checklist.map((item, i) =>
        i === idx ? { ...item, done: !item.done } : item
      )
    );
  };

  // Add roadmap step
  const addRoadmapStep = () => {
    if (newRoadmapStep.trim()) {
      setRoadmap([...roadmap, newRoadmapStep.trim()]);
      setNewRoadmapStep('');
    }
  };

  // Remove roadmap step
  const removeRoadmapStep = idx => {
    setRoadmap(roadmap => roadmap.filter((_, i) => i !== idx));
  };

  // Add checklist task
  const addChecklistTask = () => {
    if (newChecklistTask.trim()) {
      setChecklist([...checklist, { task: newChecklistTask.trim(), done: false }]);
      setNewChecklistTask('');
    }
  };

  // Remove checklist task
  const removeChecklistTask = idx => {
    setChecklist(checklist => checklist.filter((_, i) => i !== idx));
  };

  return (
    <div className="p-4 h-full flex flex-col gap-6 bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
        <input
          type="text"
          placeholder="Search roadmap or checklist..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-blue-200 rounded px-3 py-2 w-full md:w-1/2 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Roadmap Section */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-2 text-blue-700">Project Roadmap</h2>
          <ol className="list-decimal ml-6 mb-4">
            {filteredRoadmap.map((step, i) => (
              <li key={i} className="flex items-center justify-between group hover:bg-blue-50 rounded px-2 py-1 transition">
                <span>{step}</span>
                <button
                  onClick={() => removeRoadmapStep(roadmap.indexOf(step))}
                  className="ml-2 text-red-400 opacity-0 group-hover:opacity-100 transition"
                  title="Remove step"
                >
                  ✕
                </button>
              </li>
            ))}
          </ol>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Add roadmap step..."
              value={newRoadmapStep}
              onChange={e => setNewRoadmapStep(e.target.value)}
              className="border border-purple-200 rounded px-2 py-1 w-full focus:outline-none focus:ring focus:ring-purple-300"
            />
            <button
              onClick={addRoadmapStep}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* Checklist Section */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-2 text-purple-700">Checklist</h2>
          <ul className="ml-2 mb-4">
            {filteredChecklist.map((item, i) => (
              <li key={i} className="mb-2 flex items-center justify-between group hover:bg-purple-50 rounded px-2 py-1 transition">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleTask(checklist.indexOf(item))}
                    className="mr-2 accent-purple-600"
                  />
                  <span className={item.done ? 'line-through text-gray-500' : ''}>{item.task}</span>
                </div>
                <button
                  onClick={() => removeChecklistTask(checklist.indexOf(item))}
                  className="ml-2 text-red-400 opacity-0 group-hover:opacity-100 transition"
                  title="Remove task"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Add checklist task..."
              value={newChecklistTask}
              onChange={e => setNewChecklistTask(e.target.value)}
              className="border border-blue-200 rounded px-2 py-1 w-full focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button
              onClick={addChecklistTask}
              className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
