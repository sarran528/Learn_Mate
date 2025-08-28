import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Checklist from './components/Checklist.jsx';
import Roadmap from './components/Roadmap.jsx';
import Schedule from './components/Schedule.jsx';
import Resources from './components/Resources.jsx';
import Chatbot from './components/Chatbot.jsx';
import Auth from './components/Auth.jsx';

export default function App() {
  const [active, setActive] = useState('Overview');
  const [darkMode, setDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [checklist, setChecklist] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [resources, setResources] = useState([]);

  const [currentTopic, setCurrentTopic] = useState('');
  const [savedSkills, setSavedSkills] = useState([]);

  // Check for existing user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('learnMateCurrentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      loadUserData(user);
    }
  }, []);

  // Load user-specific data
  const loadUserData = (user) => {
    const userSkills = user.skills || [];
    setSavedSkills(userSkills);
  };

  // Handle user login
  const handleLogin = (user) => {
    setCurrentUser(user);
    loadUserData(user);
  };

  // Handle user logout
  const handleLogout = () => {
    setCurrentUser(null);
    setSavedSkills([]);
    setChecklist([]);
    setRoadmap([]);
    setSchedule([]);
    setResources([]);
    setCurrentTopic('');
    setActive('Overview');
    localStorage.removeItem('learnMateCurrentUser');
  };

  // Save checklist progress to user's data
  const saveChecklistProgress = (newChecklist) => {
    if (currentTopic && currentUser) {
      const updatedSkills = savedSkills.map(skill => 
        skill.name === currentTopic 
          ? { ...skill, checklist: newChecklist }
          : skill
      );
      setSavedSkills(updatedSkills);
      
      // Update user's skills in localStorage
      const users = JSON.parse(localStorage.getItem('learnMateUsers') || '[]');
      const updatedUsers = users.map(user => 
        user.id === currentUser.id 
          ? { ...user, skills: updatedSkills }
          : user
      );
      localStorage.setItem('learnMateUsers', JSON.stringify(updatedUsers));
      
      // Update current user session
      const updatedUser = { ...currentUser, skills: updatedSkills };
      setCurrentUser(updatedUser);
      localStorage.setItem('learnMateCurrentUser', JSON.stringify(updatedUser));
    }
  };
  
  const handleSuggest = ({ checklist: c, roadmap: r, schedule: s, resources: res, topic }) => {
    console.log('App handleSuggest called with:', { checklist: c, roadmap: r, schedule: s, resources: res, topic });
    
    if (!currentUser) {
      alert('Please log in to save learning paths');
      return;
    }
    
    // Convert checklist items to objects with completed status
    const checklistWithStatus = c.map(item => ({
      text: item,
      completed: false
    }));
    
    // Update all sections with the new learning path
    setChecklist(checklistWithStatus);
    setRoadmap(r);
    setSchedule(s);
    setResources(res);
    
    // Use the provided topic or detect from learning path
    const detectedTopic = topic || Object.keys(r.join(' ').match(/[A-Z][a-z]+/g) || [])[0] || 'New Topic';
    
    // Update current topic
    setCurrentTopic(detectedTopic);
    
    // Save this skill to user's data
    const newSkill = {
      id: Date.now(),
      name: detectedTopic,
      dateCreated: new Date().toISOString(),
      checklist: checklistWithStatus,
      roadmap: r,
      schedule: s,
      resources: res
    };
    
    const updatedSkills = [newSkill, ...savedSkills.filter(skill => skill.name !== detectedTopic)];
    setSavedSkills(updatedSkills);
    
    // Update user's skills in localStorage
    const users = JSON.parse(localStorage.getItem('learnMateUsers') || '[]');
    const updatedUsers = users.map(user => 
      user.id === currentUser.id 
        ? { ...user, skills: updatedSkills }
        : user
    );
    localStorage.setItem('learnMateUsers', JSON.stringify(updatedUsers));
    
    // Update current user session
    const updatedUser = { ...currentUser, skills: updatedSkills };
    setCurrentUser(updatedUser);
    localStorage.setItem('learnMateCurrentUser', JSON.stringify(updatedUser));
    
    // Switch to the overview view to show the learning path
    setActive('Overview');
  };

  const loadSkill = (skill) => {
    // Ensure checklist items have the proper structure
    const checklistWithStatus = skill.checklist.map(item => 
      typeof item === 'string' 
        ? { text: item, completed: false }
        : item
    );
    
    setChecklist(checklistWithStatus);
    setRoadmap(skill.roadmap);
    setSchedule(skill.schedule);
    setResources(skill.resources);
    setCurrentTopic(skill.name);
    setActive('Overview');
  };

  // Handle checklist item removal with progress saving
  const handleChecklistRemove = (index) => {
    const newChecklist = checklist.filter((_, idx) => idx !== index);
    setChecklist(newChecklist);
    saveChecklistProgress(newChecklist);
  };

  // Handle checklist item toggle with progress saving
  const handleChecklistToggle = (index) => {
    const newChecklist = checklist.map((item, idx) => 
      idx === index 
        ? { ...item, completed: !item.completed }
        : item
    );
    setChecklist(newChecklist);
    saveChecklistProgress(newChecklist);
  };

  const deleteSkill = (skillId) => {
    const updatedSkills = savedSkills.filter(skill => skill.id !== skillId);
    setSavedSkills(updatedSkills);
    
    // Update user's skills in localStorage
    const users = JSON.parse(localStorage.getItem('learnMateUsers') || '[]');
    const updatedUsers = users.map(user => 
      user.id === currentUser.id 
        ? { ...user, skills: updatedSkills }
        : user
    );
    localStorage.setItem('learnMateUsers', JSON.stringify(updatedUsers));
    
    // Update current user session
    const updatedUser = { ...currentUser, skills: updatedSkills };
    setCurrentUser(updatedUser);
    localStorage.setItem('learnMateCurrentUser', JSON.stringify(updatedUser));
  };

  // Show authentication screen if no user is logged in
  if (!currentUser) {
    return <Auth onLogin={handleLogin} darkMode={darkMode} />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-black text-gray-100' : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900'}`}>
      <Navbar 
        darkMode={darkMode} 
        onToggleDark={() => setDarkMode(d => !d)} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <div className="flex h-screen">
        <Sidebar onSelect={setActive} active={active} darkMode={darkMode} />
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Topic heading when a topic is selected */}
          {currentTopic && (
            <div className={`px-6 py-3 ${darkMode ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-700/50' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'} border-b backdrop-blur-sm`}>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                Learning Path: {currentTopic}
              </h1>
              <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                Your personalized learning journey has been created. Explore the roadmap, checklist, and resources below.
              </p>
            </div>
          )}
          
          <div className="flex-1 flex overflow-hidden">
                         <div className="flex-1 p-6 overflow-y-auto">
               {active === 'Checklist' && <Checklist items={checklist} onRemove={handleChecklistRemove} onToggle={handleChecklistToggle} />}
               {active === 'Roadmap' && <Roadmap steps={roadmap} onRemove={(i)=>setRoadmap(prev => prev.filter((_,idx)=>idx!==i))} />}
              {active === 'Schedule' && <Schedule items={schedule} />}
              {active === 'Resources' && <Resources items={resources} />}
                             {active === 'Overview' && (
                                   <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700/50' : 'bg-white/90 backdrop-blur-sm border border-gray-200/50'}`}>
                    <h2 className={`font-semibold mb-4 text-2xl ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      Welcome back, {currentUser.name}! 👋
                    </h2>
                    <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Ask the Learning Assistant to suggest a personalized learning plan for any topic.
                      Try asking about JavaScript, Python, Machine Learning, Web Development, or Data Science.
                    </p>
                   
                                       {/* Saved Skills Section */}
                    {savedSkills.length > 0 && (
                      <div className={`mt-6 p-6 rounded-xl border ${darkMode ? 'bg-blue-900/30 border-blue-700/50' : 'bg-blue-50 border-blue-200'}`}>
                        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                          💾 {currentUser.name}'s Learning Skills ({savedSkills.length})
                        </h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         {savedSkills.map((skill) => (
                           <div 
                             key={skill.id} 
                             className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-lg ${
                               darkMode 
                                 ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50' 
                                 : 'bg-white border-gray-200 hover:bg-gray-50'
                             }`}
                           >
                             <div className="flex items-center justify-between mb-2">
                               <h4 className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                 {skill.name}
                               </h4>
                               <button
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   deleteSkill(skill.id);
                                 }}
                                 className={`text-xs px-2 py-1 rounded ${darkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-50'}`}
                               >
                                 🗑️
                               </button>
                             </div>
                             <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                               Created: {new Date(skill.dateCreated).toLocaleDateString()}
                             </p>
                                                           <div className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <span className="mr-2">📋 {skill.checklist.length} tasks</span>
                                <span className="mr-2">🗺️ {skill.roadmap.length} steps</span>
                                <span>📚 {skill.resources.length} resources</span>
                              </div>
                              {skill.checklist.length > 0 && (
                                <div className={`mt-1 text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                  ✅ {skill.checklist.filter(item => item.completed).length} completed
                                </div>
                              )}
                             <button
                               onClick={() => loadSkill(skill)}
                               className={`mt-3 w-full text-xs px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                                 darkMode 
                                   ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                   : 'bg-blue-500 text-white hover:bg-blue-600'
                               }`}
                             >
                               Load Skill
                             </button>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                   
                   {!currentTopic && savedSkills.length === 0 && (
                     <div className={`mt-6 p-6 rounded-xl border ${darkMode ? 'bg-yellow-900/30 border-yellow-700/50' : 'bg-yellow-50 border-yellow-200'}`}>
                       <p className={`text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>
                         <span className="font-medium">Get Started:</span> Use the Learning Assistant on the right to create your first learning path.
                       </p>
                     </div>
                   )}
                   
                   {currentTopic && (
                     <div className={`mt-6 p-6 rounded-xl border ${darkMode ? 'bg-green-900/30 border-green-700/50' : 'bg-green-50 border-green-200'}`}>
                       <p className={`text-sm ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
                         <span className="font-medium">Learning Plan Created!</span> Use the sidebar to explore your personalized learning path:
                       </p>
                       <div className={`mt-4 space-y-2 text-sm ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
                         <div className="flex items-center"><span className="mr-2">📋</span> <strong>Checklist:</strong> Track your progress with actionable tasks</div>
                         <div className="flex items-center"><span className="mr-2">🗺️</span> <strong>Roadmap:</strong> See the step-by-step learning journey</div>
                         <div className="flex items-center"><span className="mr-2">📅</span> <strong>Schedule:</strong> View your weekly learning timeline</div>
                         <div className="flex items-center"><span className="mr-2">📚</span> <strong>Resources:</strong> Access curated learning materials</div>
                       </div>
                     </div>
                   )}
                 </div>
               )}
            </div>

            <aside className="w-96 p-6 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
              <Chatbot onSuggest={handleSuggest} darkMode={darkMode} />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
