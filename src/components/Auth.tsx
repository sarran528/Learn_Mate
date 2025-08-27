import React, { useState } from 'react';

const Auth: React.FC<{ setToken: (token: string) => void }> = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/register';
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

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
      } else {
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h2 className="mb-6 text-2xl font-bold text-center">{isLogin ? 'Login' : 'Register'}</h2>
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            >
              {isLogin ? 'Sign In' : 'Register'}
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="inline-block text-sm font-bold text-blue-500 align-baseline hover:text-blue-800"
            >
              {isLogin ? 'Create an account' : 'Already have an account?'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
