import { motion } from 'framer-motion';
import { ArrowRight, Search, Zap } from 'lucide-react';

export default function Hero({ onSearchClick, darkMode, transparentBackground = false }) {
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
      className={`relative min-h-screen flex items-center justify-center pt-20 overflow-hidden ${transparentBackground ? 'bg-transparent' : darkMode ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-b from-white via-eco-50 to-ocean-50'}`}
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
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${darkMode ? 'bg-eco-900/30 border border-eco-700/50' : 'bg-eco-100 border border-eco-300'}`}>
              <Zap className="w-4 h-4 text-eco-600" />
              <span className={`text-sm font-medium ${darkMode ? 'text-eco-300' : 'text-eco-700'}`}>🌱 Revolutionizing E-Waste</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className={`text-5xl md:text-7xl font-bold mb-6 leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}
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
            className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Join millions in responsible e-waste disposal. Find recycling centers, schedule pickups, and participate in our circular economy network.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 justify-center mb-12">
            <motion.button
              onClick={onSearchClick}
              className="btn-primary flex items-center justify-center space-x-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search size={20} />
              <span>Search Device</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 border-2 ${darkMode ? 'border-eco-600 text-eco-400 hover:bg-eco-600/20' : 'border-eco-600 text-eco-600 hover:bg-eco-50'}`}
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
                className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/50 border border-gray-200'} backdrop-blur-md`}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl md:text-3xl font-bold text-eco-500 mb-1">
                  {stat.number}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
            <div className={`relative w-64 h-64 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-eco-900/30 to-ocean-900/30 border border-eco-700/30' : 'bg-gradient-to-br from-eco-100 to-ocean-100 border-2 border-eco-300'}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">♻️</div>
                  <p className={`font-semibold ${darkMode ? 'text-eco-300' : 'text-eco-700'}`}>
                    Circular Economy
                  </p>
                </div>
              </div>
              {/* Orbiting elements */}
              <motion.div
                className={`absolute w-8 h-8 rounded-full ${darkMode ? 'bg-eco-500' : 'bg-eco-400'} top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '0px 100px' }}
              />
              <motion.div
                className={`absolute w-6 h-6 rounded-full ${darkMode ? 'bg-ocean-500' : 'bg-ocean-400'} bottom-0 right-0 transform translate-x-1/2 translate-y-1/2`}
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
