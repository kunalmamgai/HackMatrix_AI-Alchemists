import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth, GOOGLE_CLIENT_ID } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setIsLoggedIn, loginWithGoogle, user } = useAuth();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(-1);
    }
  }, [user, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    // Simulate API Login
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    navigate(-1);
  };

  const handleGoogleSuccess = (credentialResponse) => {
    loginWithGoogle(credentialResponse);
    navigate(-1);
  };

  const handleGoogleError = () => {
    setError('Google sign-in was cancelled or failed. Please try again.');
  };

  const isGoogleConfigured = GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8 bg-cream-50`}
    >
      <div className={`max-w-md w-full space-y-8 p-10 rounded-2xl shadow-2xl bg-white border border-sage-200`}>
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-forest rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className={`text-3xl font-extrabold text-ink-900`}>
            Welcome Back
          </h2>
          <p className={`mt-2 text-sm text-ink-500`}>
            Sign in to access your account and make purchases.
          </p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-danger-100 text-danger-700 text-sm text-center">
            {error}
          </motion.div>
        )}

        {/* Google Sign-In */}
        {isGoogleConfigured ? (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-sage-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-ink-500">or continue with</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
                width="100%"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-sage-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-ink-500">or sign in with email</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-forest-50 text-forest-700 text-xs text-center border border-forest-200">
            To enable Google Sign-In, set <code className="font-mono bg-forest-100 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code> in your <code className="font-mono bg-forest-100 px-1 rounded">.env</code> file.
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>

          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 text-ink-700`}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className={`h-5 w-5 text-ink-400`} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl leading-5 bg-transparent focus:outline-none focus:ring-2 focus:ring-forest-500 sm:text-sm transition-colors border-sage-200 text-ink-900 placeholder-ink-400 focus:border-forest-500`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 text-ink-700`}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 text-ink-400`} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl leading-5 bg-transparent focus:outline-none focus:ring-2 focus:ring-forest-500 sm:text-sm transition-colors border-sage-200 text-ink-900 placeholder-ink-400 focus:border-forest-500`}
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
                className="h-4 w-4 text-forest-600 focus:ring-forest-500 border-sage-300 rounded"
              />
              <label htmlFor="remember-me" className={`ml-2 block text-sm text-ink-700`}>
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-forest-600 hover:text-forest-500">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-forest hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <Lock className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
            </span>
            Sign In
            <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
          </button>
        </form>

        <p className="text-center text-sm text-ink-500">
          Don't have an account?{' '}
          <a href="#" className="font-medium text-forest-600 hover:text-forest-500">
            Sign up
          </a>
        </p>
      </div>
    </motion.main>
  );
}