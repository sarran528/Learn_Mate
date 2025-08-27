import React, { useEffect, useRef, useState } from 'react';
import { BrainCircuit, Eye, EyeOff, Sparkles, ArrowRight, User, Lock } from 'lucide-react';

declare global {
  interface Window {
    google?: any;
  }
}

interface AuthProps {
  setToken: (token: string) => void;
  darkMode: boolean;
}

const Auth: React.FC<AuthProps> = ({ setToken, darkMode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const googleButtonRef = useRef<HTMLDivElement | null>(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  useEffect(() => {
    if (!googleClientId) return;

    const existing = document.getElementById('google-identity-script');
    if (existing) {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredential,
        });
        window.google.accounts.id.renderButton(googleButtonRef.current, { theme: 'outline', size: 'large', width: 320 });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.id = 'google-identity-script';
    script.onload = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredential,
        });
        window.google.accounts.id.renderButton(googleButtonRef.current, { theme: 'outline', size: 'large', width: 320 });
      }
    };
    document.body.appendChild(script);
  }, [googleClientId]);

  const handleGoogleCredential = async (response: any) => {
    try {
      setIsLoading(true);
      setError('');
      const id_token = response.credential;
      const res = await fetch(`${backendUrl}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Google authentication failed');
      }
      const data = await res.json();
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
      if (data.name) localStorage.setItem('name', data.name);
      if (data.email) localStorage.setItem('email', data.email);
      if (data.avatar_url) localStorage.setItem('avatar_url', data.avatar_url);
    } catch (e: any) {
      setError(e.message || 'Google Sign-In failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const endpoint = isLogin ? '/login' : '/register';

    try {
      const response = await fetch(`${backendUrl}${endpoint}`,
       {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Something went wrong');
      }

      if (isLogin) {
        const data = await response.json();
        setToken(data.access_token);
        localStorage.setItem('token', data.access_token);
      } else {
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-xl border ${
        darkMode 
          ? 'bg-slate-800/80 border-slate-700/50' 
          : 'bg-white/90 border-gray-200/50'
      }`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex p-4 rounded-2xl mb-4 ${
            darkMode 
              ? 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-blue-500/25' 
              : 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-blue-500/25'
          }`}>
            <BrainCircuit className="h-8 w-8 text-white" />
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${
            darkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            {isLogin ? 'Welcome Back' : 'Join Learn_mate'}
          </h2>
          <p className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {isLogin ? 'Sign in to continue your learning journey' : 'Create an account to get started'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 p-4 rounded-xl text-sm text-center ${
            darkMode 
              ? 'bg-red-900/50 text-red-300 border border-red-700' 
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {error}
          </div>
        )}

        {/* Google Sign-In */}
        {googleClientId && (
          <div className="mb-6">
            <div ref={googleButtonRef} className="flex justify-center"></div>
            <div className="relative my-6">
              <div className={`absolute inset-0 flex items-center ${
                darkMode ? 'border-slate-600' : 'border-gray-300'
              }`}>
                <div className={`w-full border-t ${
                  darkMode ? 'border-slate-600' : 'border-gray-300'
                }`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${
                  darkMode ? 'bg-slate-800 text-gray-400' : 'bg-white text-gray-500'
                }`}>
                  or continue with
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Username
            </label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
                placeholder="Enter your username"
                required
              />
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors duration-200 ${
                  darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
                }`}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
              isLoading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-105 active:scale-95'
            } ${
              darkMode 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setUsername('');
              setPassword('');
            }}
            className={`text-sm font-medium transition-colors duration-200 ${
              darkMode 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className={`text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Powered by AI Learning Technology
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
