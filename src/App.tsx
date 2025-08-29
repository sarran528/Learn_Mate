import { useState, useEffect } from 'react';
import { BrainCircuit, Sun, Moon, LogOut, Sparkles, Menu, X, MessageSquare, FileText } from 'lucide-react';
import Workspace from './components/Workspace';
import ChatInterface from './components/ChatInterface';
import Auth from './components/Auth';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [, setChecklist] = useState<string[]>([]);
  const [, setRoadmap] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileView, setActiveMobileView] = useState('workspace'); // 'workspace' or 'chat'

  useEffect(() => {
    try {
      const stored = localStorage.getItem('token');
      if (stored) setToken(stored);
    } catch {}
  }, []);

  const handleSetToken = (newToken: string) => {
    setToken(newToken);
  try { localStorage.setItem('token', newToken); } catch {}
  };

  const handleLogout = () => {
    setToken(null);
  try { localStorage.removeItem('token'); } catch {}
    setChecklist([]);
    setRoadmap([]);
  };

  const toggleMobileView = (view: 'workspace' | 'chat') => {
    setActiveMobileView(view);
    setMobileMenuOpen(false);
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
          ? 'bg-slate-900/90 border-slate-700/50 backdrop-blur-xl' 
          : 'bg-white/90 border-blue-100/50 backdrop-blur-xl'
        ) +
        ' border-b sticky top-0 z-50 shadow-lg'
      }>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group">
              <div className={
                'p-2 lg:p-3 rounded-xl lg:rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ' +
                (darkMode 
                  ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 shadow-yellow-500/25' 
                  : 'bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 shadow-blue-500/25'
                )
              }>
                <BrainCircuit className="h-5 w-5 lg:h-7 lg:w-7 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className={
                  'text-xl lg:text-3xl font-bold bg-clip-text text-transparent transition-all duration-300 ' +
                  (darkMode 
                    ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500' 
                    : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600'
                  )
                }>
                  Learn_mate
                </h1>
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-3 w-3 lg:h-4 lg:w-4 text-yellow-500" />
                  <p className={
                    'text-xs lg:text-sm font-medium transition-colors duration-300 ' +
                    (darkMode ? 'text-gray-300' : 'text-gray-600')
                  }>
                    AI-Powered Learning Guide Agent
                  </p>
                </div>
              </div>
              {/* Mobile title */}
              <h1 className={
                'sm:hidden text-lg font-bold bg-clip-text text-transparent transition-all duration-300 ' +
                (darkMode 
                  ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500' 
                  : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600'
                )
              }>
                Learn_mate
              </h1>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Mobile menu button */}
              {token && (
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={
                    'lg:hidden p-2 rounded-lg transition-all duration-300 ' +
                    (darkMode 
                      ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                    )
                  }
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              )}

              <button
                onClick={() => setDarkMode(d => !d)}
                className={
                  'p-2 lg:p-3 rounded-lg lg:rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg ' +
                  (darkMode 
                    ? 'bg-slate-800 text-yellow-300 hover:bg-slate-700 hover:shadow-yellow-500/25' 
                    : 'bg-white text-blue-700 hover:bg-blue-50 hover:shadow-blue-500/25'
                  )
                }
                title="Toggle dark mode"
              >
                {darkMode ? <Moon className="h-4 w-4 lg:h-5 lg:w-5" /> : <Sun className="h-4 w-4 lg:h-5 lg:w-5" />}
              </button>
              
              {token && (
                <button
                  onClick={handleLogout}
                  className={
                    'px-3 lg:px-6 py-2 lg:py-3 font-semibold rounded-lg lg:rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 text-sm lg:text-base ' +
                    (darkMode 
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-red-500/25' 
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-red-500/25'
                    )
                  }
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {token && mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200/20">
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => toggleMobileView('workspace')}
                  className={
                    `flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ` +
                    (activeMobileView === 'workspace'
                      ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                      : (darkMode ? 'bg-slate-800 text-gray-300' : 'bg-white text-gray-700')
                    )
                  }
                >
                  <FileText className="h-4 w-4" />
                  Workspace
                </button>
                <button
                  onClick={() => toggleMobileView('chat')}
                  className={
                    `flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ` +
                    (activeMobileView === 'chat'
                      ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                      : (darkMode ? 'bg-slate-800 text-gray-300' : 'bg-white text-gray-700')
                    )
                  }
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {!token ? (
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <ErrorBoundary>
              <Auth setToken={handleSetToken} darkMode={darkMode} />
            </ErrorBoundary>
          </div>
        ) : (
          <>
            {/* Desktop Layout */}
            <div className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" style={{height: 'calc(100vh - 160px)'}}>
                {/* Workspace - larger left column */}
                <div className="lg:col-span-3">
                  <div className={
                    `h-full backdrop-blur-xl border rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl p-4 lg:p-6 ` +
                    (darkMode 
                      ? 'bg-slate-900/80 border-slate-700/50' 
                      : 'bg-white/80 border-white/20'
                    )
                  }>
                    <ErrorBoundary>
                      <Workspace darkMode={darkMode} setDarkMode={setDarkMode} />
                    </ErrorBoundary>
                  </div>
                </div>

                {/* Chat - compact right sidebar */}
                <div className="lg:col-span-1">
                  <div className={
                    `h-full backdrop-blur-xl border rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl p-4 ` +
                    (darkMode 
                      ? 'bg-slate-900/80 border-slate-700/50' 
                      : 'bg-white/80 border-white/20'
                    )
                  }>
                    <ErrorBoundary>
                      <ChatInterface
                        token={token || ''}
                        setChecklist={setChecklist as any}
                        setRoadmap={setRoadmap as any}
                        darkMode={darkMode}
                      />
                    </ErrorBoundary>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden px-4 py-4" style={{height: 'calc(100vh - 140px)'}}>
              <div className={
                `h-full backdrop-blur-xl border rounded-2xl shadow-2xl p-4 ` +
                (darkMode 
                  ? 'bg-slate-900/80 border-slate-700/50' 
                  : 'bg-white/80 border-white/20'
                )
              }>
                <ErrorBoundary>
                  {activeMobileView === 'workspace' ? (
                    <Workspace darkMode={darkMode} setDarkMode={setDarkMode} />
                  ) : (
                    <ChatInterface
                      token={token || ''}
                      setChecklist={setChecklist as any}
                      setRoadmap={setRoadmap as any}
                      darkMode={darkMode}
                    />
                  )}
                </ErrorBoundary>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;