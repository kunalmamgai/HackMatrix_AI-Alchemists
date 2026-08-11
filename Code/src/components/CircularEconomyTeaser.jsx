import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Minimize2, RotateCcw, RotateCw, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Minimize2,
    title: 'Reduce',
    text: 'Buy only what you need — less manufacturing, lower carbon footprint.',
    color: 'from-blue-400 to-blue-600',
  },
  {
    icon: RotateCcw,
    title: 'Reuse',
    text: 'Repair, refurbish, and donate to keep devices alive longer.',
    color: 'from-eco-400 to-eco-600',
  },
  {
    icon: RotateCw,
    title: 'Recycle',
    text: 'Certified recyclers recover valuable metals and keep toxins out of landfills.',
    color: 'from-ocean-400 to-ocean-600',
  },
];

export default function CircularEconomyTeaser({ darkMode }) {
  const navigate = useNavigate();

  return (
    <section id="circular-teaser" className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            The Circular Economy <span className="text-red-500">in Action</span>
          </h2>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Every device can stay in the loop instead of ending up in a landfill.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className={`rounded-2xl p-8 text-center shadow-lg border-2 ${
                darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -6 }}
            >
              <div
                className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mb-5`}
              >
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {step.title}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{step.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/circular-economy')}
            className="btn-primary inline-flex items-center gap-2"
          >
            Explore the Full Journey
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
