import React from 'react';
import { User, LogOut, Sun, Moon } from 'lucide-react';

export default function Navbar({ title = 'Learn_mate', darkMode = false, onToggleDark, currentUser, onLogout }) {
  return (
    <header className={`w-full py-4 px-6 border-b ${darkMode ? 'bg-gray-800/80 border-gray-700 backdrop-blur-sm' : 'bg-white/90 border-gray-200 backdrop-blur-sm'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${darkMode ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'} text-white shadow-lg`}>
            <span className="text-xl">🧠</span>
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{title}</h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>AI-Powered Learning Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* User Info */}
          {currentUser && (
            <div className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
              darkMode 
                ? 'bg-gray-700/50 border border-gray-600' 
                : 'bg-gray-100/50 border border-gray-200'
            }`}>
              <div className={`p-1.5 rounded-full ${
                darkMode ? 'bg-blue-600' : 'bg-blue-500'
              }`}>
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="text-sm">
                <div className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {currentUser.name}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {currentUser.email}
                </div>
              </div>
            </div>
          )}
          
          {/* Theme Toggle */}
          <button 
            onClick={onToggleDark} 
            className={`p-2 rounded-lg transition-all duration-200 ${
              darkMode 
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          {/* Logout Button */}
          {currentUser && (
            <button
              onClick={onLogout}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                darkMode 
                  ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/30' 
                  : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
              }`}
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
