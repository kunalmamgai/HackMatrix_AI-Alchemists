import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage({ darkMode, setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    // Simulate API Login
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    navigate(-1); // Go back to the previous page
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <div className={`max-w-md w-full space-y-8 p-10 rounded-3xl shadow-2xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-eco rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Welcome Back
          </h2>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Sign in to access your account and make purchases.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-red-100 text-red-700 text-sm text-center">
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl leading-5 bg-transparent focus:outline-none focus:ring-2 focus:ring-eco-500 sm:text-sm transition-colors ${
                    darkMode 
                      ? 'border-gray-600 text-white placeholder-gray-500 focus:border-eco-500' 
                      : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:border-eco-500'
                  }`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl leading-5 bg-transparent focus:outline-none focus:ring-2 focus:ring-eco-500 sm:text-sm transition-colors ${
                    darkMode 
                      ? 'border-gray-600 text-white placeholder-gray-500 focus:border-eco-500' 
                      : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:border-eco-500'
                  }`}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-eco-600 focus:ring-eco-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-eco-600 hover:text-eco-500">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-eco hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eco-500 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <Lock className="h-5 w-5 text-green-200 group-hover:text-white transition-colors" />
            </span>
            Sign In
            <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
          </button>
        </form>
      </div>
    </motion.main>
  );
}