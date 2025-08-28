import { useState, useEffect, type FC } from 'react';
import { BrainCircuit, Sun, Moon, LogOut, Sparkles, Menu, X, MessageSquare, FileText } from 'lucide-react';

// Mock components for demonstration (typed)
interface WorkspaceProps { darkMode: boolean }
const Workspace: FC<WorkspaceProps> = ({ darkMode }) => (
  <div className="h-full flex flex-col">
    <div className={`flex-1 p-6 rounded-xl ${darkMode ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-sm`}>
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Learning Workspace
      </h3>
      <div className="grid gap-4 h-full">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} min-h-[200px]`}>
          <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Study Materials</h4>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Your learning content goes here...</p>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} min-h-[200px]`}>
          <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Progress Tracker</h4>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Track your learning progress...</p>
        </div>
      </div>
    </div>
  </div>
);

interface ChatInterfaceProps { darkMode: boolean }
const ChatInterface: FC<ChatInterfaceProps> = ({ darkMode }) => (
  <div className="h-full flex flex-col">
    <div className={`flex-1 ${darkMode ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-sm rounded-xl p-4`}>
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        AI Assistant
      </h3>
      <div className="flex-1 space-y-3 mb-4 max-h-[400px] overflow-y-auto">
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Hi! I'm your AI learning assistant. How can I help you today?
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask me anything..."
          className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
            darkMode 
              ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
          Send
        </button>
      </div>
    </div>
  </div>
);

interface AuthProps { setToken: (t: string) => void; darkMode: boolean }
const Auth: FC<AuthProps> = ({ setToken, darkMode }) => (
  <div className="max-w-md mx-auto mt-8 p-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl">
    <h2 className={`text-2xl font-bold text-center mb-6 ${darkMode ? 'text-gray-800' : 'text-gray-900'}`}>
      Welcome to Learn_mate
    </h2>
    <button
      onClick={() => setToken('demo-token')}
      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
    >
      Get Started
    </button>
  </div>
);

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [, setChecklist] = useState<string[]>([]);
  const [, setRoadmap] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileView, setActiveMobileView] = useState('workspace'); // 'workspace' or 'chat'

  useEffect(() => {
    // Simulating localStorage without actually using it
    // In a real app, you'd use localStorage here
    const storedToken = null; // localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSetToken = (newToken: string) => {
    setToken(newToken);
    // In a real app: localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    // In a real app: localStorage.removeItem('token');
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
            <Auth setToken={handleSetToken} darkMode={darkMode} />
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
                    <Workspace darkMode={darkMode} />
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
                    <ChatInterface
                      darkMode={darkMode}
                    />
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
                {activeMobileView === 'workspace' ? (
                  <Workspace darkMode={darkMode} />
                ) : (
                  <ChatInterface
                    darkMode={darkMode}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;