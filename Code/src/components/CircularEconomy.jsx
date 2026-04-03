import { motion } from 'framer-motion';
import { Minimize2, RotateCcw, RotateCw, Leaf, Zap, Droplet, Trophy, Lightbulb, Heart } from 'lucide-react';

export default function CircularEconomy({ darkMode }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const cycleItems = [
    {
      icon: Minimize2,
      title: 'Reduce',
      description: 'Minimize e-waste by buying only what you need and choosing quality over quantity',
      color: 'from-blue-400 to-blue-600',
      benefits: ['Less manufacturing', 'Lower carbon footprint', 'Cost savings'],
    },
    {
      icon: RotateCcw,
      title: 'Reuse',
      description: 'Extend device lifecycles through repair, refurbishment, and donation programs',
      color: 'from-eco-400 to-eco-600',
      benefits: ['Saves resources', 'Affordable access', 'Community support'],
    },
    {
      icon: RotateCw,
      title: 'Recycle',
      description: 'Responsibly process materials to recover valuable metals and minimize environmental impact',
      color: 'from-ocean-400 to-ocean-600',
      benefits: ['Material recovery', 'Pollution prevention', 'New products'],
    },
  ];

  const stats = [
    { icon: Leaf, value: '95%', label: 'Less E-waste' },
    { icon: Zap, value: '80%', label: 'Energy Saved' },
    { icon: Droplet, value: '250M', label: 'Liters Water Saved' },
    { icon: Trophy, value: '1000+', label: 'Devices Renewed' },
  ];

  const environmentalBenefit = [
    { icon: Lightbulb, label: 'Innovation' },
    { icon: Heart, label: 'Community' },
    { icon: Leaf, label: 'Nature' },
  ];

  return (
    <section
      id="circular"
      className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title mb-4">The Circular Economy in Action</h2>
          <p className={`section-subtitle ${darkMode ? 'text-gray-400' : ''}`}>
            Understanding how we transform e-waste into value through a sustainable circular model
          </p>
        </motion.div>

        {/* Main Cycle Flow */}
        <motion.div
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {cycleItems.map((item, index) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="relative"
              >
                {/* Card */}
                <motion.div
                  className={`rounded-2xl p-8 h-full shadow-xl transition-all border-2 ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 hover:border-eco-500'
                      : 'bg-white border-gray-200 hover:border-eco-500'
                  }`}
                  whileHover={{ scale: 1.05, y: -10 }}
                >
                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mb-6`}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-2">
                    {item.benefits.map((benefit, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-center space-x-2"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color}`} />
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {benefit}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Arrow to next item */}
                {index < cycleItems.length - 1 && (
                  <motion.div
                    className="hidden md:flex absolute -right-6 top-1/2 transform -translate-y-1/2 z-10"
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className={`text-3xl ${darkMode ? 'text-eco-400' : 'text-eco-500'}`}>→</div>
                  </motion.div>
                )}

                {/* Mobile arrow */}
                {index < cycleItems.length - 1 && (
                  <motion.div
                    className="md:hidden flex justify-center mt-4"
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className={`text-3xl ${darkMode ? 'text-eco-400' : 'text-eco-500'}`}>↓</div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Cycle Complete Arrow */}
          <motion.div
            className="flex justify-center mt-8"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className={`text-4xl ${darkMode ? 'text-eco-400' : 'text-eco-500'}`}>↻</div>
          </motion.div>
        </motion.div>

        {/* Environmental Impact Stats */}
        <motion.div
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Environmental Impact
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className={`rounded-2xl p-8 text-center shadow-lg border-2 ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gradient-subtle border-eco-200'
                }`}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="p-4 rounded-xl bg-gradient-eco w-fit mx-auto mb-4"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </motion.div>
                <div className={`text-4xl font-bold mb-2 ${darkMode ? 'text-eco-300' : 'text-eco-600'}`}>
                  {stat.value}
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How You Can Help */}
        <motion.div
          className={`rounded-2xl p-12 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-eco-50 to-ocean-50'} border-2 border-eco-300`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className={`text-2xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            5 Ways to Support the Circular Economy
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { step: '1️⃣', action: 'Buy Responsibly', desc: 'Choose durable, repairable devices' },
              { step: '2️⃣', action: 'Extend Life', desc: 'Keep devices working as long as possible' },
              { step: '3️⃣', action: 'Donate Used', desc: 'Give devices to those who need them' },
              { step: '4️⃣', action: 'Repair, Don\'t Replace', desc: 'Get items fixed instead of buying new' },
              { step: '5️⃣', action: 'Recycle Properly', desc: 'Use certified e-waste recyclers' },
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-xl text-center transition-all ${
                  darkMode
                    ? 'bg-gray-700/50 hover:bg-gray-700'
                    : 'bg-white/60 hover:bg-white'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl mb-2">{item.step}</div>
                <h4 className={`font-bold text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.action}
                </h4>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Ready to Make a Difference?
          </h3>
          <p className={`text-lg mb-8 max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Join thousands of people who are already part of the circular economy movement. Start by disposing of your e-waste responsibly today.
          </p>
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Journey →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
