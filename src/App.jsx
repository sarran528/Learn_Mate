import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Checklist from './components/Checklist.jsx';
import Roadmap from './components/Roadmap.jsx';
import Schedule from './components/Schedule.jsx';
import Resources from './components/Resources.jsx';
import Chatbot from './components/Chatbot.jsx';

export default function App() {
  const [active, setActive] = useState('Overview');
  const [darkMode, setDarkMode] = useState(false);

  const [checklist, setChecklist] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [resources, setResources] = useState([]);

  const [currentTopic, setCurrentTopic] = useState('');
  
  const handleSuggest = ({ checklist: c, roadmap: r, schedule: s, resources: res }) => {
    console.log('App handleSuggest called with:', { checklist: c, roadmap: r, schedule: s, resources: res });
    // Update all sections with the new learning path
    setChecklist(c);
    setRoadmap(r);
    setSchedule(s);
    setResources(res);
    
    // Detect topic from the learning path
    const possibleTopics = Object.keys(r.join(' ').match(/[A-Z][a-z]+/g) || []);
    const detectedTopic = possibleTopics[0] || 'New Topic';
    
    // Update current topic
    setCurrentTopic(detectedTopic);
    
    // Switch to the overview view to show the learning path
    setActive('Overview');
  };

  return (
    <div className={darkMode ? 'min-h-screen bg-slate-900 text-white' : 'min-h-screen bg-gray-100 text-gray-900'}>
      <Navbar darkMode={darkMode} onToggleDark={() => setDarkMode(d => !d)} />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        <Sidebar onSelect={setActive} />
        <main className="flex-1 p-4 md:p-6">
          {/* Topic heading when a topic is selected */}
          {currentTopic && (
            <div className="mb-4 px-4 py-2 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-100 dark:border-blue-800">
              <h1 className="text-xl font-bold text-blue-800 dark:text-blue-200">
                Learning Path: {currentTopic}
              </h1>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                Your personalized learning journey has been created. Explore the roadmap, checklist, and resources below.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2 space-y-4">
              {active === 'Checklist' && <Checklist items={checklist} onRemove={(i)=>setChecklist(prev => prev.filter((_,idx)=>idx!==i))} />}
              {active === 'Roadmap' && <Roadmap steps={roadmap} onRemove={(i)=>setRoadmap(prev => prev.filter((_,idx)=>idx!==i))} />}
              {active === 'Schedule' && <Schedule items={schedule} />}
              {active === 'Resources' && <Resources items={resources} />}
              {active === 'Overview' && (
                <div className="p-4 bg-white rounded shadow dark:bg-slate-800">
                  <h2 className="font-semibold mb-2">Welcome to Learn_Mate</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Ask the Learning Assistant to suggest a personalized learning plan for any topic.
                    Try asking about JavaScript, Python, Machine Learning, Web Development, or Data Science.
                  </p>
                  
                  {!currentTopic && (
                    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900 rounded border border-yellow-100 dark:border-yellow-800">
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        <span className="font-medium">Get Started:</span> Use the Learning Assistant on the right to create your first learning path.
                      </p>
                    </div>
                  )}
                  
                  {currentTopic && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900 rounded border border-green-100 dark:border-green-800">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        <span className="font-medium">Learning Plan Created!</span> Use the sidebar to explore your personalized learning path:
                      </p>
                      <div className="mt-2 space-y-1 text-xs text-green-600 dark:text-green-400">
                        <div>• <strong>Checklist:</strong> Track your progress with actionable tasks</div>
                        <div>• <strong>Roadmap:</strong> See the step-by-step learning journey</div>
                        <div>• <strong>Schedule:</strong> View your weekly learning timeline</div>
                        <div>• <strong>Resources:</strong> Access curated learning materials</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <aside className="lg:col-span-1 space-y-4">
              <Chatbot onSuggest={handleSuggest} />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
