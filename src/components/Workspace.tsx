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
  // Checklist now supports completion state
  type ChecklistItem = { text: string; done: boolean };
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [schedule, setSchedule] = useState<string[]>([]);
  const [resources, setResources] = useState<string[]>([]);

  const [newRoadmapStep, setNewRoadmapStep] = useState('');
  const [newChecklistTask, setNewChecklistTask] = useState('');
  const [newScheduleItem, setNewScheduleItem] = useState('');
  const [newResource, setNewResource] = useState('');

  useEffect(() => {
    const tmpl = TEMPLATES[skill] || { roadmap: [], checklist: [], schedule: [], resources: [] };
    setRoadmap(tmpl.roadmap.slice());
    setChecklist(tmpl.checklist.map(t => ({ text: t, done: false })));
    setSchedule(tmpl.schedule.slice());
    setResources(tmpl.resources.slice());
  }, [skill]);

  // helpers
  const addRoadmap = () => { if (newRoadmapStep.trim()) { setRoadmap(r => [...r, newRoadmapStep.trim()]); setNewRoadmapStep(''); } };
  const removeRoadmap = (i: number) => setRoadmap(r => r.filter((_, idx) => idx !== i));

  const addChecklist = () => { if (newChecklistTask.trim()) { setChecklist(c => [...c, { text: newChecklistTask.trim(), done: false }]); setNewChecklistTask(''); } };
  const removeChecklist = (i: number) => setChecklist(c => c.filter((_, idx) => idx !== i));
  const toggleChecklist = (i: number) => setChecklist(c => c.map((it, idx) => idx === i ? { ...it, done: !it.done } : it));

  const addSchedule = () => { if (newScheduleItem.trim()) { setSchedule(s => [...s, newScheduleItem.trim()]); setNewScheduleItem(''); } };
  const removeSchedule = (i: number) => setSchedule(s => s.filter((_, idx) => idx !== i));

  const addResource = () => { if (newResource.trim()) { setResources(r => [...r, newResource.trim()]); setNewResource(''); } };
  const removeResource = (i: number) => setResources(r => r.filter((_, idx) => idx !== i));

  // inline edit states
  const [editRoadmapIdx, setEditRoadmapIdx] = useState<number | null>(null);
  const [editRoadmapText, setEditRoadmapText] = useState('');

  const [editChecklistIdx, setEditChecklistIdx] = useState<number | null>(null);
  const [editChecklistText, setEditChecklistText] = useState('');

  const [editScheduleIdx, setEditScheduleIdx] = useState<number | null>(null);
  const [editScheduleText, setEditScheduleText] = useState('');

  const [editResourceIdx, setEditResourceIdx] = useState<number | null>(null);
  const [editResourceText, setEditResourceText] = useState('');

  // reordering helpers (move item up/down)
  const move = <T,>(arr: T[], from: number, to: number) => {
    const copy = arr.slice();
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    return copy;
  };

  const moveRoadmap = (i: number, dir: -1 | 1) => setRoadmap(r => {
    const t = i + dir; if (t < 0 || t >= r.length) return r; return move(r, i, t);
  });
  const moveChecklist = (i: number, dir: -1 | 1) => setChecklist(r => {
    const t = i + dir; if (t < 0 || t >= r.length) return r; return move(r, i, t);
  });
  const moveSchedule = (i: number, dir: -1 | 1) => setSchedule(r => {
    const t = i + dir; if (t < 0 || t >= r.length) return r; return move(r, i, t);
  });
  const moveResource = (i: number, dir: -1 | 1) => setResources(r => {
    const t = i + dir; if (t < 0 || t >= r.length) return r; return move(r, i, t);
  });

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
                <div className="flex items-center gap-2 mb-3">
                  <button onClick={() => setChecklist([])} className="px-2 py-1 text-sm rounded border">Clear</button>
                  <button onClick={() => {
                    const tmpl = TEMPLATES[skill]?.checklist ?? [];
                    setChecklist(tmpl.map(t => ({ text: t, done: false })));
                  }} className="px-2 py-1 text-sm rounded border">Reset to template</button>
                </div>
                <ul className="space-y-2 mb-4">
                  {checklist.map((t, i) => (
                    <li key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={t.done} onChange={() => toggleChecklist(i)} />
                        {editChecklistIdx === i ? (
                          <input
                            value={editChecklistText}
                            onChange={e=>setEditChecklistText(e.target.value)}
                            className="px-2 py-1 rounded border"
                          />
                        ) : (
                          <span className={t.done ? 'line-through opacity-70' : ''}>{t.text}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {editChecklistIdx === i ? (
                          <>
                            <button onClick={() => { setChecklist(c => c.map((it, idx) => idx === i ? { ...it, text: editChecklistText.trim() || it.text } : it)); setEditChecklistIdx(null); setEditChecklistText(''); }} className="text-green-600">Save</button>
                            <button onClick={() => { setEditChecklistIdx(null); setEditChecklistText(''); }} className="text-gray-500">Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => { setEditChecklistIdx(i); setEditChecklistText(t.text); }} className="text-blue-600">Edit</button>
                            <button onClick={() => moveChecklist(i, -1)} className="text-gray-500">▲</button>
                            <button onClick={() => moveChecklist(i, 1)} className="text-gray-500">▼</button>
                            <button onClick={() => removeChecklist(i)} className="text-red-500">Remove</button>
                          </>
                        )}
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
                <div className="flex items-center gap-2 mb-3">
                  <button onClick={() => setRoadmap([])} className="px-2 py-1 text-sm rounded border">Clear</button>
                  <button onClick={() => setRoadmap(TEMPLATES[skill]?.roadmap ?? [])} className="px-2 py-1 text-sm rounded border">Reset to template</button>
                </div>
                <ol className="list-decimal ml-6 space-y-3 mb-4">
                  {roadmap.map((s, i) => (
                    <li key={i} className="flex items-start justify-between">
                      <div className="max-w-[80%]">
                        {editRoadmapIdx === i ? (
                          <input value={editRoadmapText} onChange={e=>setEditRoadmapText(e.target.value)} className="w-full px-2 py-1 rounded border" />
                        ) : (
                          <span>{s}</span>
                        )}
                      </div>
                      <div className="ml-4 flex items-center gap-2">
                        {editRoadmapIdx === i ? (
                          <>
                            <button onClick={() => { setRoadmap(r => r.map((v, idx) => idx === i ? (editRoadmapText.trim() || v) : v)); setEditRoadmapIdx(null); setEditRoadmapText(''); }} className="text-green-600">Save</button>
                            <button onClick={() => { setEditRoadmapIdx(null); setEditRoadmapText(''); }} className="text-gray-500">Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => { setEditRoadmapIdx(i); setEditRoadmapText(s); }} className="text-blue-600">Edit</button>
                            <button onClick={() => moveRoadmap(i, -1)} className="text-gray-500">▲</button>
                            <button onClick={() => moveRoadmap(i, 1)} className="text-gray-500">▼</button>
                            <button onClick={()=>removeRoadmap(i)} className="text-red-500">Remove</button>
                          </>
                        )}
                      </div>
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
                <div className="flex items-center gap-2 mb-3">
                  <button onClick={() => setSchedule([])} className="px-2 py-1 text-sm rounded border">Clear</button>
                  <button onClick={() => setSchedule(TEMPLATES[skill]?.schedule ?? [])} className="px-2 py-1 text-sm rounded border">Reset to template</button>
                </div>
                <ul className="list-disc ml-6 mb-4">
                  {schedule.map((s, i) => (
                    <li key={i} className="flex items-center justify-between py-1">
                      <div className="max-w-[80%]">
                        {editScheduleIdx === i ? (
                          <input value={editScheduleText} onChange={e=>setEditScheduleText(e.target.value)} className="w-full px-2 py-1 rounded border" />
                        ) : (
                          <span>{s}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {editScheduleIdx === i ? (
                          <>
                            <button onClick={() => { setSchedule(r => r.map((v, idx) => idx === i ? (editScheduleText.trim() || v) : v)); setEditScheduleIdx(null); setEditScheduleText(''); }} className="text-green-600">Save</button>
                            <button onClick={() => { setEditScheduleIdx(null); setEditScheduleText(''); }} className="text-gray-500">Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => { setEditScheduleIdx(i); setEditScheduleText(s); }} className="text-blue-600">Edit</button>
                            <button onClick={() => moveSchedule(i, -1)} className="text-gray-500">▲</button>
                            <button onClick={() => moveSchedule(i, 1)} className="text-gray-500">▼</button>
                            <button onClick={()=>removeSchedule(i)} className="text-red-500">Remove</button>
                          </>
                        )}
                      </div>
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
                <div className="flex items-center gap-2 mb-3">
                  <button onClick={() => setResources([])} className="px-2 py-1 text-sm rounded border">Clear</button>
                  <button onClick={() => setResources(TEMPLATES[skill]?.resources ?? [])} className="px-2 py-1 text-sm rounded border">Reset to template</button>
                </div>
                <ul className="list-disc ml-6 mb-4">
                  {resources.map((r, i) => (
                    <li key={i} className="flex items-center justify-between py-1">
                      <div className="max-w-[80%]">
                        {editResourceIdx === i ? (
                          <input value={editResourceText} onChange={e=>setEditResourceText(e.target.value)} className="w-full px-2 py-1 rounded border" />
                        ) : (
                          <a href={r} target="_blank" rel="noreferrer" className="text-blue-600 underline">{r}</a>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {editResourceIdx === i ? (
                          <>
                            <button onClick={() => { setResources(rs => rs.map((v, idx) => idx === i ? (editResourceText.trim() || v) : v)); setEditResourceIdx(null); setEditResourceText(''); }} className="text-green-600">Save</button>
                            <button onClick={() => { setEditResourceIdx(null); setEditResourceText(''); }} className="text-gray-500">Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => { setEditResourceIdx(i); setEditResourceText(r); }} className="text-blue-600">Edit</button>
                            <button onClick={() => moveResource(i, -1)} className="text-gray-500">▲</button>
                            <button onClick={() => moveResource(i, 1)} className="text-gray-500">▼</button>
                            <button onClick={()=>removeResource(i)} className="text-red-500">Remove</button>
                          </>
                        )}
                      </div>
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
