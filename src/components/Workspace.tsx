
import React, { useState } from 'react';

interface WorkspaceProps {
  darkMode: boolean;
  setDarkMode: (d: boolean | ((d: boolean) => boolean)) => void;
}


const roadmapTemplates: Record<string, string[]> = {
  'react': [
    'Learn JSX and components',
    'Understand state and props',
    'Explore hooks',
    'Build a sample app',
    'Learn routing',
    'Deploy the app'
  ],
  'python': [
    'Learn Python syntax',
    'Understand data structures',
    'Practice with projects',
    'Explore libraries',
    'Build a CLI tool',
    'Deploy to cloud'
  ],
  'node': [
    'Learn Node.js basics',
    'Understand modules',
    'Build REST API',
    'Connect to database',
    'Add authentication',
    'Deploy server'
  ]
};

const checklistTemplates: Record<string, { task: string; done: boolean }[]> = {
  'react': [
    { task: 'Set up React project', done: false },
    { task: 'Create components', done: false },
    { task: 'Write tests', done: false }
  ],
  'python': [
    { task: 'Install Python', done: false },
    { task: 'Write scripts', done: false },
    { task: 'Test code', done: false }
  ],
  'node': [
    { task: 'Install Node.js', done: false },
    { task: 'Set up Express', done: false },
    { task: 'Write endpoints', done: false }
  ]
};



export default function Workspace({ darkMode, setDarkMode }: WorkspaceProps) {
  const [roadmap, setRoadmap] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<{ task: string; done: boolean }[]>([]);
  const [search, setSearch] = useState('');
  const [newRoadmapStep, setNewRoadmapStep] = useState('');
  const [newChecklistTask, setNewChecklistTask] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  // Simulate topic suggestions
  const topicSuggestions = ['React', 'Python', 'Node'];
  const filteredSuggestions = topicSuggestions.filter(t => t.toLowerCase().includes(topic.toLowerCase()));

  // Filter roadmap and checklist by search
  const filteredRoadmap = roadmap.filter(step => step.toLowerCase().includes(search.toLowerCase()));
  const filteredChecklist = checklist.filter(item => item.task.toLowerCase().includes(search.toLowerCase()));

  // Toggle checklist task
  const toggleTask = (idx: number) => {
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
  const removeRoadmapStep = (idx: number) => {
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
  const removeChecklistTask = (idx: number) => {
    setChecklist(checklist => checklist.filter((_, i) => i !== idx));
  };

  // Handle topic selection
  const handleSelectTopic = (t: string) => {
    setSelectedTopic(t);
    setTopic(t);
    setRoadmap(roadmapTemplates[t.toLowerCase()] || []);
    setChecklist(checklistTemplates[t.toLowerCase()] || []);
  };

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode(d => !d);

  return (
    <div className={
      `p-0 h-full w-full flex flex-col gap-0 rounded-xl shadow-lg overflow-hidden transition-colors duration-300 ` +
      (darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-gray-100' : 'bg-gradient-to-br from-white via-blue-50 to-purple-50 text-gray-900')
    }>
      <div className={
        `flex flex-col md:flex-row md:items-center gap-4 px-6 py-4 border-b ` +
        (darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white/80 border-blue-100')
      }>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className={
              'px-3 py-2 rounded transition ' +
              (darkMode ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200')
            }
            title="Toggle dark mode"
          >
            {darkMode ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
        <div className="flex-1" />
        <input
          type="text"
          placeholder="What do you want to learn? (e.g. React, Python...)"
          value={topic}
          onChange={e => {
            setTopic(e.target.value);
            setSelectedTopic('');
            setRoadmap([]);
            setChecklist([]);
          }}
          className={
            'border rounded px-3 py-2 w-full md:w-1/2 focus:outline-none focus:ring ' +
            (darkMode ? 'border-gray-700 bg-gray-800 text-gray-100 focus:ring-yellow-300' : 'border-blue-200 focus:ring-blue-300')
          }
        />
        {topic && !selectedTopic && (
          <div className={
            'absolute mt-12 md:mt-0 md:ml-2 bg-white shadow-lg rounded z-10 w-64 ' +
            (darkMode ? 'bg-gray-900 text-gray-100 border border-gray-700' : 'bg-white text-gray-900 border border-blue-100')
          }>
            {filteredSuggestions.length === 0 ? (
              <div className="p-2">No suggestions</div>
            ) : (
              filteredSuggestions.map((t, i) => (
                <div
                  key={i}
                  className={
                    'cursor-pointer px-4 py-2 hover:bg-blue-100 ' +
                    (darkMode ? 'hover:bg-gray-800' : 'hover:bg-blue-100')
                  }
                  onClick={() => handleSelectTopic(t)}
                >
                  {t}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* If no topic selected, show empty workspace */}
      {!selectedTopic ? (
        <div className={
          'flex-1 flex items-center justify-center text-2xl font-semibold ' +
          (darkMode ? 'text-gray-400' : 'text-gray-400')
        }>
          Start by searching for a topic to learn!
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-0 h-full w-full">
          {/* Roadmap Section */}
          <div className={
            'flex-1 flex flex-col h-full min-h-0 border-r ' +
            (darkMode ? 'border-gray-700 bg-gray-900' : 'border-blue-100 bg-white/70')
          }>
            <div className="px-6 py-4 flex-shrink-0">
              <h2 className={
                'text-xl font-bold mb-2 ' +
                (darkMode ? 'text-yellow-300' : 'text-blue-700')
              }>Project Roadmap</h2>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-4">
              <ol className="list-decimal ml-6 mb-4">
                {filteredRoadmap.map((step, i) => (
                  <li key={i} className={
                    'flex items-center justify-between group rounded px-2 py-1 transition ' +
                    (darkMode ? 'hover:bg-gray-800' : 'hover:bg-blue-50')
                  }>
                    <span>{step}</span>
                    <button
                      onClick={() => removeRoadmapStep(i)}
                      className={
                        'ml-2 text-red-400 opacity-0 group-hover:opacity-100 transition ' +
                        (darkMode ? 'hover:text-red-300' : '')
                      }
                      title="Remove step"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ol>
            </div>
            <div className={
              'px-6 py-4 flex-shrink-0 border-t ' +
              (darkMode ? 'border-gray-700 bg-gray-900' : 'border-blue-100 bg-white/90')
            }>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add roadmap step..."
                  value={newRoadmapStep}
                  onChange={e => setNewRoadmapStep(e.target.value)}
                  className={
                    'border rounded px-2 py-1 w-full focus:outline-none focus:ring ' +
                    (darkMode ? 'border-gray-700 bg-gray-800 text-gray-100 focus:ring-yellow-300' : 'border-purple-200 focus:ring-purple-300')
                  }
                />
                <button
                  onClick={addRoadmapStep}
                  className={
                    'px-3 py-1 rounded transition ' +
                    (darkMode ? 'bg-yellow-300 text-gray-900 hover:bg-yellow-400' : 'bg-blue-600 text-white hover:bg-blue-700')
                  }
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Checklist Section */}
          <div className={
            'flex-1 flex flex-col h-full min-h-0 ' +
            (darkMode ? 'bg-gray-900' : 'bg-white/70')
          }>
            <div className="px-6 py-4 flex-shrink-0">
              <h2 className={
                'text-xl font-bold mb-2 ' +
                (darkMode ? 'text-yellow-300' : 'text-purple-700')
              }>Checklist</h2>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-4">
              <ul className="ml-2 mb-4">
                {filteredChecklist.map((item, i) => (
                  <li key={i} className={
                    'mb-2 flex items-center justify-between group rounded px-2 py-1 transition ' +
                    (darkMode ? 'hover:bg-gray-800' : 'hover:bg-purple-50')
                  }>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => toggleTask(i)}
                        className={
                          'mr-2 accent-purple-600 ' +
                          (darkMode ? 'accent-yellow-300' : '')
                        }
                      />
                      <span className={item.done ? 'line-through text-gray-500' : ''}>{item.task}</span>
                    </div>
                    <button
                      onClick={() => removeChecklistTask(i)}
                      className={
                        'ml-2 text-red-400 opacity-0 group-hover:opacity-100 transition ' +
                        (darkMode ? 'hover:text-red-300' : '')
                      }
                      title="Remove task"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className={
              'px-6 py-4 flex-shrink-0 border-t ' +
              (darkMode ? 'border-gray-700 bg-gray-900' : 'border-purple-100 bg-white/90')
            }>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add checklist task..."
                  value={newChecklistTask}
                  onChange={e => setNewChecklistTask(e.target.value)}
                  className={
                    'border rounded px-2 py-1 w-full focus:outline-none focus:ring ' +
                    (darkMode ? 'border-gray-700 bg-gray-800 text-gray-100 focus:ring-yellow-300' : 'border-blue-200 focus:ring-blue-300')
                  }
                />
                <button
                  onClick={addChecklistTask}
                  className={
                    'px-3 py-1 rounded transition ' +
                    (darkMode ? 'bg-yellow-300 text-gray-900 hover:bg-yellow-400' : 'bg-purple-600 text-white hover:bg-purple-700')
                  }
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
