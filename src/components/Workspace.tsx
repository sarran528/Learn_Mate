import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface WorkspaceProps {
  checklist: string[];
  roadmap: string[];
  setChecklist: (checklist: string[]) => void;
  setRoadmap: (roadmap: string[]) => void;
  darkMode: boolean;
}

const skills = ['React', 'Python', 'Node.js', 'Data Science', 'Docker', 'TypeScript'];

const skillTemplates: Record<string, {
  roadmap: string[];
  checklist: { task: string }[];
  schedule: string[];
  resources: string[];
}> = {
  React: {
    roadmap: ['Learn JSX', 'Understand Components', 'State & Props', 'Hooks', 'Routing', 'Build a Project'],
    checklist: [
      { task: 'Read React docs' },
      { task: 'Complete a React tutorial' },
      { task: 'Build a sample React app' }
    ],
    schedule: ['Day 1: JSX & Components', 'Day 2: State & Props', 'Day 3: Hooks & Routing', 'Day 4: Project'],
    resources: ['https://react.dev/', 'https://www.youtube.com/results?search_query=react+tutorial']
  },
  Python: {
    roadmap: ['Syntax & Basics', 'Data Structures', 'Functions', 'Modules', 'Build a CLI Tool'],
    checklist: [
      { task: 'Read Python docs' },
      { task: 'Complete a Python course' },
      { task: 'Build a Python script' }
    ],
    schedule: ['Day 1: Basics', 'Day 2: Data Structures', 'Day 3: Functions & Modules', 'Day 4: Project'],
    resources: ['https://docs.python.org/3/', 'https://www.youtube.com/results?search_query=python+tutorial']
  }
};

export default function Workspace({ checklist, roadmap, setChecklist, setRoadmap, darkMode }: WorkspaceProps) {
  const [selectedSkill, setSelectedSkill] = useState(skills[0]);
  const [schedule, setSchedule] = useState<string[]>(skillTemplates[selectedSkill]?.schedule || []);
  const [resources, setResources] = useState<string[]>(skillTemplates[selectedSkill]?.resources || []);

  const [newRoadmapStep, setNewRoadmapStep] = useState('');
  const [newChecklistTask, setNewChecklistTask] = useState('');
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    // sync when skill changes
    const tmpl = skillTemplates[selectedSkill];
    if (tmpl) {
      setRoadmap(tmpl.roadmap);
      setChecklist(tmpl.checklist.map((c) => c.task));
      setSchedule(tmpl.schedule);
      setResources(tmpl.resources);
      setCompletedSteps(new Set());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSkill]);

  const handleSkillChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSkill(e.target.value);
  };

  const addRoadmapStep = () => {
    if (!newRoadmapStep.trim()) return;
    setRoadmap([...roadmap, newRoadmapStep.trim()]);
    setNewRoadmapStep('');
  };

  const removeRoadmapStep = (idx: number) => {
    setRoadmap(roadmap.filter((_, i) => i !== idx));
    const next = new Set(completedSteps);
    next.delete(idx);
    setCompletedSteps(next);
  };

  const toggleStepCompletion = (idx: number) => {
    const next = new Set(completedSteps);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setCompletedSteps(next);
  };

  const addChecklistTask = () => {
    if (!newChecklistTask.trim()) return;
    setChecklist([...checklist, newChecklistTask.trim()]);
    setNewChecklistTask('');
  };

  const removeChecklistTask = (idx: number) => {
    setChecklist(checklist.filter((_, i) => i !== idx));
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <label htmlFor="skill-select" className="font-bold text-lg">Choose a skill:</label>
        <select
          id="skill-select"
          value={selectedSkill}
          onChange={handleSkillChange}
          className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        >
          {skills.map((skill) => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-green-50 rounded-xl shadow">
          <h2 className="text-lg font-bold mb-2 text-green-700">Checklist</h2>
          <ul className="ml-2">
            {checklist.map((item, i) => (
              <li key={i} className="mb-2 flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={false}
                    readOnly
                    className="mr-2 accent-green-600"
                  />
                  <span className="">{item}</span>
                </div>
                <button onClick={() => removeChecklistTask(i)} className="p-1 rounded hover:bg-red-50">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Add checklist task..."
              value={newChecklistTask}
              onChange={(e) => setNewChecklistTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addChecklistTask()}
              className="flex-1 px-3 py-2 rounded border"
            />
            <button onClick={addChecklistTask} className="px-3 py-2 bg-green-600 text-white rounded">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 rounded-xl shadow">
          <h2 className="text-lg font-bold mb-2 text-yellow-700">Roadmap</h2>
          <ol className="list-decimal ml-6">
            {roadmap.map((step, i) => (
              <li key={i} className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleStepCompletion(i)} className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
                    {completedSteps.has(i) ? '✓' : i + 1}
                  </button>
                  <span className={completedSteps.has(i) ? 'line-through text-gray-500' : ''}>{step}</span>
                </div>
                <button onClick={() => removeRoadmapStep(i)} className="p-1 rounded hover:bg-red-50">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </li>
            ))}
          </ol>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Add roadmap step..."
              value={newRoadmapStep}
              onChange={(e) => setNewRoadmapStep(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addRoadmapStep()}
              className="flex-1 px-3 py-2 rounded border"
            />
            <button onClick={addRoadmapStep} className="px-3 py-2 bg-yellow-600 text-white rounded">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-xl shadow">
          <h2 className="text-lg font-bold mb-2 text-blue-700">Schedule</h2>
          {schedule.length === 0 ? (
            <div className="text-gray-400">No schedule set yet.</div>
          ) : (
            <ul className="list-disc ml-6">
              {schedule.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-4 bg-purple-50 rounded-xl shadow">
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
      </div>
    </div>
  );
}
