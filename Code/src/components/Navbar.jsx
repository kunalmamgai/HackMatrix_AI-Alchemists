import { useState } from 'react';
import { Menu, X, Leaf, LogIn, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ darkMode, isLoggedIn, setIsLoggedIn }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Device Guide', href: '/device-search' },
    { label: 'Locations', href: '/nearby-locations' },
    { label: 'Pickup', href: '/pickup-network' },
    { label: 'Disposables', href: '/disposables' },
    { label: 'About', href: '/circular-economy' },
  ];

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/">
            <motion.div 
              className="flex items-center space-x-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 bg-gradient-eco rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">E-Scarpe Mart</span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link key={index} to={item.href}>
                <motion.div
                  className="font-medium text-gray-300 transition-colors hover:text-eco-400"
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
              <motion.button
                onClick={handleLogout}
                className="hidden md:inline-flex px-4 py-2 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </motion.button>
            ) : (
              <motion.button
                onClick={() => navigate('/login')}
                className="hidden md:inline-flex px-4 py-2 rounded-lg font-semibold text-white bg-gradient-eco hover:shadow-glow transition-all duration-300"
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
                <X className="text-white" size={24} />
              ) : (
                <Menu className="text-white" size={24} />
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
          className="md:hidden border-t bg-gray-800 border-gray-700"
        >
          <div className="px-4 pt-2 pb-3 space-y-1">
            {isLoggedIn ? (
              <motion.button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 bg-red-500 text-white hover:opacity-90"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </motion.button>
            ) : (
              <motion.button
                onClick={() => {
                  navigate('/login');
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 bg-gradient-eco text-white hover:opacity-90"
              >
                <LogIn size={18} />
                <span>Login</span>
              </motion.button>
            )}
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`block px-3 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
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
