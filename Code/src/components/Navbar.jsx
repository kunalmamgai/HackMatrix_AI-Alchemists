import { useState } from 'react';
import { Menu, X, Leaf, LogIn, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  const navItems = [
    { label: 'Device Guide', href: '/device-search' },
    { label: 'Locations', href: '/nearby-locations' },
    { label: 'Pickup', href: '/pickup-network' },
    { label: 'Disposables', href: '/disposables' },
    { label: 'About', href: '/about' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sage-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/">
            <motion.div 
              className="flex items-center space-x-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 bg-gradient-forest rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-ink-900">E-Scrape Mart</span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link key={index} to={item.href}>
                <motion.div
                  className="font-medium text-ink-700 transition-colors hover:text-forest-600"
                  whileHover={{ scale: 1.05 }}
                >
                  {item.label}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Theme Toggle and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="hidden md:flex items-center space-x-3">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || 'User'}
                    className="w-9 h-9 rounded-full border-2 border-sage-200 object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-forest flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {(user?.name || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <motion.button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full font-semibold text-danger-600 border-2 border-danger-500/40 hover:bg-danger-50 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </motion.button>
              </div>
            ) : (
              <motion.button
                onClick={() => navigate('/login')}
                className="hidden md:inline-flex px-4 py-2 rounded-lg font-semibold text-white bg-gradient-forest hover:shadow-glow transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogIn size={18} className="mr-2" />
                Login
              </motion.button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2"
            >
              {isOpen ? (
                <X className="text-ink-900" size={24} />
              ) : (
                <Menu className="text-ink-900" size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t bg-white border-sage-200"
        >
          <div className="px-4 pt-2 pb-3 space-y-1">
            {isLoggedIn ? (
              <>
                {user && (
                  <div className="flex items-center space-x-3 px-3 py-2">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name || 'User'}
                        className="w-8 h-8 rounded-full border-2 border-sage-200 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-forest flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {(user.name || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{user.name}</p>
                      <p className="text-xs text-ink-500">{user.email}</p>
                    </div>
                  </div>
                )}
                <motion.button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 text-danger-600 bg-danger-50 hover:bg-danger-100"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <motion.button
                onClick={() => {
                  navigate('/login');
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 bg-gradient-forest text-white hover:opacity-90"
              >
                <LogIn size={18} />
                <span>Login</span>
              </motion.button>
            )}
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`block px-3 py-2 rounded-lg transition-colors text-ink-700 hover:bg-sage-100`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
