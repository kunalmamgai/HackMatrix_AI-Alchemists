import { motion, animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { MapPin, BookOpen, Package, Recycle } from 'lucide-react';
import { centers } from '../data/centers';
import { devices } from '../data/devices';
import { products } from '../data/products';

function CountUp({ target, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target]);

  return (
    <span ref={ref}>
      {display.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

export default function ImpactStats({ darkMode }) {
  const stats = [
    { icon: MapPin, target: centers.length, suffix: '+', label: 'Recycling Centers', note: 'Certified locations across India' },
    { icon: BookOpen, target: devices.length, label: 'Disposal Guides', note: 'Step-by-step instructions & safety tips' },
    { icon: Package, target: products.length, suffix: '+', label: 'Refurbished Products', note: 'Ready for a second life' },
    { icon: Recycle, target: 62, suffix: 'M', label: 'Tonnes of E-Waste', note: 'Generated worldwide every year' },
  ];

  return (
    <section id="impact" className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Impact in <span className="text-eco-500">Numbers</span>
          </h2>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Real numbers from our network — and the scale of the e-waste challenge we are up against.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`rounded-2xl p-8 text-center shadow-lg border-2 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="p-4 rounded-xl bg-gradient-eco w-fit mx-auto mb-4">
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div className={`text-4xl font-bold mb-2 ${darkMode ? 'text-eco-300' : 'text-eco-600'}`}>
                <CountUp target={stat.target} suffix={stat.suffix} />
              </div>
              <p className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.label}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.note}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
