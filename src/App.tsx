import React, { useState, useEffect } from 'react';
import Workspace from './components/Workspace';
import { BrainCircuit, Sun, Moon, LogOut, Sparkles } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import Auth from './components/Auth';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [checklist, setChecklist] = useState<string[]>([]);
  const [roadmap, setRoadmap] = useState<string[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSetToken = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setChecklist([]);
    setRoadmap([]);
  };

  return (
    <div className={
      `min-h-screen transition-all duration-500 ease-in-out ` +
      (darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-100' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900'
      )
    }>
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-indigo-400/35 rounded-full animate-pulse"></div>
      </div>

      {/* Header */}
      <header className={
        (darkMode 
          ? 'bg-slate-900/80 border-slate-700/50 backdrop-blur-xl' 
          : 'bg-white/90 border-blue-100/50 backdrop-blur-xl'
        ) +
        ' border-b sticky top-0 z-50 shadow-lg'
      }>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 group">
              <div className={
                'p-3 rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ' +
                (darkMode 
                  ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 shadow-yellow-500/25' 
                  : 'bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 shadow-blue-500/25'
                )
              }>
                <BrainCircuit className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className={
                  'text-3xl font-bold bg-clip-text text-transparent transition-all duration-300 ' +
                  (darkMode 
                    ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500' 
                    : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600'
                  )
                }>
                  Learn_mate
                </h1>
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <p className={
                    'text-sm font-medium transition-colors duration-300 ' +
                    (darkMode ? 'text-gray-300' : 'text-gray-600')
                  }>
                    AI-Powered Learning Guide Agent
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(d => !d)}
                className={
                  'p-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg ' +
                  (darkMode 
                    ? 'bg-slate-800 text-yellow-300 hover:bg-slate-700 hover:shadow-yellow-500/25' 
                    : 'bg-white text-blue-700 hover:bg-blue-50 hover:shadow-blue-500/25'
                  )
                }
                title="Toggle dark mode"
              >
                {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
              
              {token && (
                <button
                  onClick={handleLogout}
                  className={
                    'px-6 py-3 font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 ' +
                    (darkMode 
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-red-500/25' 
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-red-500/25'
                    )
                  }
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Split Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {!token ? (
          <Auth setToken={handleSetToken} darkMode={darkMode} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
            <div className="group">
              <div className="h-full bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-[1.02] overflow-hidden">
                <ChatInterface 
                  token={token} 
                  setChecklist={setChecklist}
                  setRoadmap={setRoadmap}
                  darkMode={darkMode}
                />
              </div>
            </div>
            
            <div className="group">
              <div className="h-full bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-[1.02] overflow-hidden">
                <Workspace 
                  checklist={checklist} 
                  roadmap={roadmap} 
                  setChecklist={setChecklist}
                  setRoadmap={setRoadmap}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
