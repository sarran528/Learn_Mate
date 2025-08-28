import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Checklist from './components/Checklist';
import Roadmap from './components/Roadmap';
import Schedule from './components/Schedule';
import Resources from './components/Resources';
import Chatbot from './components/Chatbot';

export default function App() {
  const [active, setActive] = useState('Overview');
  const [darkMode, setDarkMode] = useState(false);

  const [checklist, setChecklist] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [resources, setResources] = useState([]);

  const [currentTopic, setCurrentTopic] = useState('');
  
  const handleSuggest = ({ checklist: c, roadmap: r, schedule: s, resources: res }) => {
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
    
    // Switch to the roadmap view to show the learning path
    setActive('Roadmap');
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
                </div>
              )}
              
              {/* Show schedule in main content on larger screens */}
              <div className="lg:hidden">
                <Schedule items={schedule} />
              </div>
            </div>

            <aside className="lg:col-span-1 space-y-4">
              <Chatbot onSuggest={handleSuggest} />
              
              {/* Only show these on larger screens in the sidebar */}
              <div className="hidden lg:block">
                <Schedule items={schedule} />
              </div>
              <Resources items={resources} />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
