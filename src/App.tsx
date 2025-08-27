import React, { useState, useEffect } from 'react';
import Workspace from './components/Workspace';
import { BrainCircuit } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import Auth from './components/Auth';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

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
  };

  return (
    <div className={
      `min-h-screen transition-colors duration-300 ` +
      (darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-gray-100' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900')
    }>
      {/* Header */}
      <header className={
        (darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white/80 border-blue-100') +
        ' backdrop-blur-sm border-b sticky top-0 z-50'
      }>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={
                (darkMode ? 'bg-gradient-to-r from-yellow-400 to-yellow-700' : 'bg-gradient-to-r from-blue-500 to-purple-600') +
                ' p-2 rounded-xl'
              }>
                <BrainCircuit className={darkMode ? 'h-6 w-6 text-gray-900' : 'h-6 w-6 text-white'} />
              </div>
              <div>
                <h1 className={
                  'text-2xl font-bold bg-clip-text text-transparent ' +
                  (darkMode ? 'bg-gradient-to-r from-yellow-400 to-yellow-700' : 'bg-gradient-to-r from-blue-600 to-purple-600')
                }>
                  Learn_mate
                </h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>AI-Powered Learning Guide Agent</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(d => !d)}
                className={
                  'px-4 py-2 font-bold rounded transition ' +
                  (darkMode ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200')
                }
                title="Toggle dark mode"
              >
                {darkMode ? '🌙 Dark' : '☀️ Light'}
              </button>
              {token && (
                <button
                  onClick={handleLogout}
                  className={
                    'px-4 py-2 font-bold rounded focus:outline-none focus:shadow-outline transition ' +
                    (darkMode ? 'bg-red-700 text-white hover:bg-red-800' : 'bg-red-500 text-white hover:bg-red-700')
                  }
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Split Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!token ? (
          <Auth setToken={handleSetToken} />
        ) : (
          <div className="flex flex-col md:flex-row gap-6 h-[70vh]">
            <div className={
              'md:w-1/2 w-full h-full rounded-xl shadow p-4 overflow-auto transition-colors duration-300 ' +
              (darkMode ? 'bg-gray-900' : 'bg-white/80')
            }>
              <ChatInterface token={token} />
            </div>
            <div className={
              'md:w-1/2 w-full h-full rounded-xl shadow p-4 overflow-auto transition-colors duration-300'
            }>
              <Workspace darkMode={darkMode} setDarkMode={setDarkMode} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
