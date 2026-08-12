import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { devices } from '../data/devices';

export default function Hero({ transparentBackground = false }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const trimmedQuery = query.trim().toLowerCase();
  const suggestions = trimmedQuery
    ? devices
        .filter(
          (device) =>
            device.name.toLowerCase().includes(trimmedQuery) ||
            device.category.toLowerCase().includes(trimmedQuery)
        )
        .slice(0, 5)
    : [];

  const handleSelectDevice = (device) => {
    setShowSuggestions(false);
    setQuery('');
    navigate(`/device-search?q=${encodeURIComponent(device.name)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && trimmedQuery) {
      e.preventDefault();
      setShowSuggestions(false);
      navigate(`/device-search?q=${encodeURIComponent(trimmedQuery)}`);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const floatingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1 },
    },
  };

  const bounce = {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  return (
    <section 
      id="hero"
      className={`relative min-h-screen flex items-center justify-center pt-20 overflow-hidden ${transparentBackground ? 'bg-transparent' : 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900'}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-10 left-10 w-72 h-72 bg-gradient-eco rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, 50, -50, 0],
            y: [0, 50, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-r from-ocean-400 to-eco-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, -50, 50, 0],
            y: [0, -50, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-eco-900/30 border border-eco-700/50`}>
              <Zap className="w-4 h-4 text-eco-600" />
              <span className={`text-sm font-medium text-eco-300`}>🌱 Revolutionizing E-Waste</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className={`text-5xl md:text-7xl font-bold mb-6 leading-tight text-white`}
          >
            Dispose Smarter. <br />
            <span className="bg-gradient-to-r from-eco-500 to-ocean-500 bg-clip-text text-transparent">
              Reuse Better.
            </span>
            <br />
            Save the Planet.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-300`}
          >
            Join millions in responsible e-waste disposal. Find recycling centers, schedule pickups, and participate in our circular economy network.
          </motion.p>

          {/* Quick Search + CTA */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
            <div className="relative w-full md:w-[420px]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onKeyDown={handleKeyDown}
                placeholder="Search a device, e.g. Laptop, Battery..."
                aria-label="Search the device disposal guide"
                className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 placeholder-gray-400 bg-white/95 backdrop-blur border-2 border-eco-500/60 focus:outline-none focus:ring-2 focus:ring-eco-400 shadow-lg"
              />

              {showSuggestions && suggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-20 mt-2 w-full bg-gray-800/95 backdrop-blur-md border border-gray-600 rounded-xl shadow-2xl overflow-hidden text-left"
                >
                  {suggestions.map((device) => (
                    <li key={device.id}>
                      <button
                        type="button"
                        onMouseDown={() => handleSelectDevice(device)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors text-left"
                      >
                        <device.icon className="w-4 h-4 text-eco-400 flex-shrink-0" />
                        <span className="text-sm text-white">{device.name}</span>
                        <span className="ml-auto text-xs text-gray-400">{device.category}</span>
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </div>

            <motion.button
              onClick={() => navigate('/pickup-network')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 border-2 border-eco-600 text-eco-400 hover:bg-eco-600/20`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule Pickup
            </motion.button>
          </motion.div>

          {/* Featured Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            {[
              { number: '5000+', label: 'Recycling Centers' },
              { number: '2M+', label: 'Devices Recycled' },
              { number: '500K', label: 'Active Users' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-xl bg-gray-800/50 border border-gray-700 backdrop-blur-md`}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl md:text-3xl font-bold text-eco-500 mb-1">
                  {stat.number}
                </div>
                <div className={`text-sm text-gray-400`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Floating Illustration */}
          <motion.div
            variants={floatingVariants}
            animate={bounce}
            className="mt-16 relative h-64 flex items-center justify-center"
          >
            <div className={`relative w-64 h-64 rounded-3xl bg-gradient-to-br from-eco-900/30 to-ocean-900/30 border border-eco-700/30`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">♻️</div>
                  <p className={`font-semibold text-eco-300`}>
                    Circular Economy
                  </p>
                </div>
              </div>
              {/* Orbiting elements */}
              <motion.div
                className={`absolute w-8 h-8 rounded-full bg-eco-500 top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '0px 100px' }}
              />
              <motion.div
                className={`absolute w-6 h-6 rounded-full bg-ocean-500 bottom-0 right-0 transform translate-x-1/2 translate-y-1/2`}
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '-80px -80px' }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
