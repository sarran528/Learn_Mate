import React, { useState } from 'react';
import { User, Lock, Mail, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';

export default function Auth({ onLogin, darkMode = false }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login logic
        const users = JSON.parse(localStorage.getItem('learnMateUsers') || '[]');
        const user = users.find(u => u.email === formData.email && u.password === formData.password);
        
        if (user) {
          // Store current user session
          localStorage.setItem('learnMateCurrentUser', JSON.stringify(user));
          onLogin(user);
        } else {
          setError('Invalid email or password');
        }
      } else {
        // Registration logic
        const users = JSON.parse(localStorage.getItem('learnMateUsers') || '[]');
        
        // Check if user already exists
        if (users.find(u => u.email === formData.email)) {
          setError('User with this email already exists');
          return;
        }

        // Create new user
        const newUser = {
          id: Date.now(),
          name: formData.name,
          email: formData.email,
          password: formData.password,
          createdAt: new Date().toISOString(),
          skills: []
        };

        // Save user to storage
        users.push(newUser);
        localStorage.setItem('learnMateUsers', JSON.stringify(users));
        
        // Auto-login after registration
        localStorage.setItem('learnMateCurrentUser', JSON.stringify(newUser));
        onLogin(newUser);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-black' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl ${
        darkMode 
          ? 'bg-slate-800/90 backdrop-blur-xl border border-slate-700/50' 
          : 'bg-white/90 backdrop-blur-xl border border-white/50'
      }`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            darkMode 
              ? 'bg-gradient-to-br from-blue-600 to-purple-700 shadow-lg shadow-blue-500/25' 
              : 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25'
          }`}>
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {isLogin ? 'Sign in to continue your learning journey' : 'Join Learn_Mate to start your learning journey'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                    darkMode 
                      ? 'bg-slate-700/80 border-slate-600 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                      : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Email Address
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                  darkMode 
                    ? 'bg-slate-700/80 border-slate-600 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                    : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className={`w-full pl-10 pr-12 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                  darkMode 
                    ? 'bg-slate-700/80 border-slate-600 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                    : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className={`p-3 rounded-lg text-sm ${
              darkMode ? 'bg-red-900/30 text-red-300 border border-red-700/50' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              loading 
                ? (darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:scale-105 active:scale-95'
            }`}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                {isLogin ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                {isLogin ? 'Sign In' : 'Create Account'}
              </>
            )}
          </button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ email: '', password: '', name: '' });
              }}
              className={`ml-1 font-medium hover:underline ${
                darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
              }`}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
