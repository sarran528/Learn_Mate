import { useEffect, useState } from 'react';
import SkillSearch from './SkillSearch';
import Schedule from './Schedule';
import Resources from './Resources';

type Tab = 'checklist' | 'roadmap' | 'schedule' | 'resources';

interface Props {
  darkMode?: boolean;
  setDarkMode?: (v: boolean) => void;
}

const SKILLS = ['React', 'Python', 'Node.js', 'Data Science', 'Docker', 'TypeScript'];

const TEMPLATES: Record<string, { roadmap: string[]; checklist: string[]; schedule: string[]; resources: string[] }> = {
  React: {
    roadmap: ['Learn JSX', 'Components & Props', 'State & Lifecycle', 'Hooks', 'Routing', 'Build a Project'],
    checklist: ['Read React docs', 'Follow an official tutorial', 'Create a small app'],
    schedule: ['Day 1: JSX & Components', 'Day 2: State & Hooks', 'Day 3: Build Project'],
    resources: ['https://react.dev/', 'https://beta.reactjs.org/learn'],
  },
  Python: {
    roadmap: ['Syntax & Variables', 'Control Flow', 'Data Structures', 'Modules & Packages', 'Build a CLI'],
    checklist: ['Install Python', 'Complete a basic tutorial', 'Write small scripts'],
    schedule: ['Day 1: Basics', 'Day 2: Data Structures', 'Day 3: Project'],
    resources: ['https://docs.python.org/3/', 'https://realpython.com/'],
  },
  'Node.js': {
    roadmap: ['Node basics', 'Modules', 'Express', 'Databases', 'Auth & Deployment'],
    checklist: ['Install Node', 'Create express server', 'Connect DB'],
    schedule: ['Day 1: Basics', 'Day 2: Express', 'Day 3: DB & Auth'],
    resources: ['https://nodejs.org/en/docs/', 'https://expressjs.com/'],
  },
  'Data Science': {
    roadmap: ['Python & NumPy', 'Pandas', 'Data Visualization', 'ML Basics', 'Project'],
    checklist: ['Install Anaconda', 'Follow a tutorial', 'Analyze a dataset'],
    schedule: ['Week 1: Pandas', 'Week 2: Visualization', 'Week 3: ML'],
    resources: ['https://scikit-learn.org/', 'https://pandas.pydata.org/'],
  },
  Docker: {
    roadmap: ['Containers vs VMs', 'Dockerfile', 'Images & Registries', 'Compose', 'Deploy'],
    checklist: ['Install Docker', 'Create Dockerfile', 'Push an image'],
    schedule: ['Day 1: Basics', 'Day 2: Dockerfile', 'Day 3: Compose'],
    resources: ['https://docs.docker.com/', 'https://www.docker.com/learn'],
  },
  TypeScript: {
    roadmap: ['Types & Interfaces', 'Generics', 'TS with React', 'Tooling'],
    checklist: ['Install TypeScript', 'Migrate small project', 'Use types in React'],
    schedule: ['Day 1: Types', 'Day 2: Generics', 'Day 3: TS+React'],
    resources: ['https://www.typescriptlang.org/', 'https://www.typescriptlang.org/docs/'],
  },
};

export default function Workspace({ darkMode = false, setDarkMode }: Props) {
  const [skill, setSkill] = useState<string>(SKILLS[0]);
  const [tab, setTab] = useState<Tab>('checklist');

  const [roadmap, setRoadmap] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<string[]>([]);
  const [resources, setResources] = useState<string[]>([]);

  const [newRoadmapStep, setNewRoadmapStep] = useState('');
  const [newChecklistTask, setNewChecklistTask] = useState('');
  const [newScheduleItem, setNewScheduleItem] = useState('');
  const [newResource, setNewResource] = useState('');

  useEffect(() => {
    const tmpl = TEMPLATES[skill] || { roadmap: [], checklist: [], schedule: [], resources: [] };
    setRoadmap(tmpl.roadmap.slice());
    setChecklist(tmpl.checklist.slice());
    setSchedule(tmpl.schedule.slice());
    setResources(tmpl.resources.slice());
  }, [skill]);

  // helpers
  const addRoadmap = () => { if (newRoadmapStep.trim()) { setRoadmap(r => [...r, newRoadmapStep.trim()]); setNewRoadmapStep(''); } };
  const removeRoadmap = (i: number) => setRoadmap(r => r.filter((_, idx) => idx !== i));

  const addChecklist = () => { if (newChecklistTask.trim()) { setChecklist(c => [...c, newChecklistTask.trim()]); setNewChecklistTask(''); } };
  const removeChecklist = (i: number) => setChecklist(c => c.filter((_, idx) => idx !== i));

  const addSchedule = () => { if (newScheduleItem.trim()) { setSchedule(s => [...s, newScheduleItem.trim()]); setNewScheduleItem(''); } };
  const removeSchedule = (i: number) => setSchedule(s => s.filter((_, idx) => idx !== i));

  const addResource = () => { if (newResource.trim()) { setResources(r => [...r, newResource.trim()]); setNewResource(''); } };
  const removeResource = (i: number) => setResources(r => r.filter((_, idx) => idx !== i));

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} min-h-[60vh] rounded-lg shadow`}>
      <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className="flex items-center gap-4">
          <label className="font-semibold">Skill</label>
          <select value={skill} onChange={e => setSkill(e.target.value)} className="px-3 py-2 rounded border">
            {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <div className="ml-4 text-sm text-gray-500">Switch tab:</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setTab('checklist')} className={`px-3 py-1 rounded ${tab==='checklist' ? 'bg-blue-600 text-white' : 'bg-transparent'}`}>Checklist</button>
            <button onClick={() => setTab('roadmap')} className={`px-3 py-1 rounded ${tab==='roadmap' ? 'bg-blue-600 text-white' : 'bg-transparent'}`}>Roadmap</button>
            <button onClick={() => setTab('schedule')} className={`px-3 py-1 rounded ${tab==='schedule' ? 'bg-blue-600 text-white' : 'bg-transparent'}`}>Schedule</button>
            <button onClick={() => setTab('resources')} className={`px-3 py-1 rounded ${tab==='resources' ? 'bg-blue-600 text-white' : 'bg-transparent'}`}>Resources</button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {setDarkMode && (
            <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-1 rounded border">Toggle Theme</button>
          )}
        </div>
      </div>

      {/* Body: grid with main content + right sidebar */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column (roadmap/checklist) */}
          <div className="lg:col-span-2">
            {/* Skill search + small selector fallback */}
            <div className="mb-4">
              <SkillSearch onSelect={(s) => setSkill(s)} />
            </div>

            {tab === 'checklist' && (
              <div>
                <h3 className="text-xl font-bold mb-3">Checklist</h3>
                <ul className="space-y-2 mb-4">
                  {checklist.map((t, i) => (
                    <li key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <div>{t}</div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeChecklist(i)} className="text-red-500">Remove</button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <input value={newChecklistTask} onChange={e=>setNewChecklistTask(e.target.value)} placeholder="Add task" className="flex-1 px-3 py-2 rounded border" />
                  <button onClick={addChecklist} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
                </div>
              </div>
            )}

            {tab === 'roadmap' && (
              <div>
                <h3 className="text-xl font-bold mb-3">Roadmap</h3>
                <ol className="list-decimal ml-6 space-y-3 mb-4">
                  {roadmap.map((s, i) => (
                    <li key={i} className="flex items-start justify-between">
                      <div className="max-w-[80%]">{s}</div>
                      <div className="ml-4"><button onClick={()=>removeRoadmap(i)} className="text-red-500">Remove</button></div>
                    </li>
                  ))}
                </ol>
                <div className="flex gap-2">
                  <input value={newRoadmapStep} onChange={e=>setNewRoadmapStep(e.target.value)} placeholder="Add roadmap step" className="flex-1 px-3 py-2 rounded border" />
                  <button onClick={addRoadmap} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
                </div>
              </div>
            )}

            {tab === 'schedule' && (
              <div>
                <h3 className="text-xl font-bold mb-3">Schedule</h3>
                <ul className="list-disc ml-6 mb-4">
                  {schedule.map((s, i) => (
                    <li key={i} className="flex items-center justify-between py-1">
                      <div>{s}</div>
                      <button onClick={()=>removeSchedule(i)} className="text-red-500">Remove</button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <input value={newScheduleItem} onChange={e=>setNewScheduleItem(e.target.value)} placeholder="Add schedule item" className="flex-1 px-3 py-2 rounded border" />
                  <button onClick={addSchedule} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
                </div>
              </div>
            )}

            {tab === 'resources' && (
              <div>
                <h3 className="text-xl font-bold mb-3">Resources</h3>
                <ul className="list-disc ml-6 mb-4">
                  {resources.map((r, i) => (
                    <li key={i} className="flex items-center justify-between py-1">
                      <a href={r} target="_blank" rel="noreferrer" className="text-blue-600 underline">{r}</a>
                      <button onClick={()=>removeResource(i)} className="text-red-500 ml-4">Remove</button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <input value={newResource} onChange={e=>setNewResource(e.target.value)} placeholder="Add resource URL" className="flex-1 px-3 py-2 rounded border" />
                  <button onClick={addResource} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar: Schedule + Resources summarized */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <Schedule schedule={schedule} />
              <Resources resources={resources} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
