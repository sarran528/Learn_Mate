import React, { useState, useEffect } from 'react';
import Workspace from './components/Workspace';
import { BrainCircuit } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import Auth from './components/Auth';

function App() {
  const [token, setToken] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <BrainCircuit className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Learn_mate
                </h1>
                <p className="text-sm text-gray-600">AI-Powered Learning Guide Agent</p>
              </div>
            </div>
            {token && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Split Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!token ? (
          <Auth setToken={handleSetToken} />
        ) : (
          <div className="flex flex-col md:flex-row gap-6 h-[70vh]">
            <div className="md:w-1/2 w-full h-full bg-white/80 rounded-xl shadow p-4 overflow-auto">
              <ChatInterface token={token} />
            </div>
            <div className="md:w-1/2 w-full h-full bg-white/80 rounded-xl shadow p-4 overflow-auto">
              <Workspace />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
