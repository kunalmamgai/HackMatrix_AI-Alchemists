import { motion } from 'framer-motion';
import { MapPin, BookOpen, Package, Recycle } from 'lucide-react';
import CountUp from './CountUp';
import { centers } from '../data/centers';
import { devices } from '../data/devices';
import { products } from '../data/products';

export default function ImpactStats() {
  const stats = [
    { icon: MapPin, target: centers.length, suffix: '+', label: 'Certified Recyclers', note: 'Verified partners across 12 cities in India' },
    { icon: BookOpen, target: devices.length, label: 'Device Guides', note: 'Step-by-step instructions with safety ratings' },
    { icon: Package, target: products.length, suffix: '+', label: 'Refurbished Products', note: 'Each tested with 6-month warranty' },
    { icon: Recycle, target: 62, suffix: 'M', label: 'Tonnes of E-Waste', note: 'Generated globally — only 17.4% is recycled properly' },
  ];

  return (
    <section id="impact" className="py-20 lg:py-32 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-h1 text-ink-900 mb-4">
            The E-Waste Problem is <span className="text-forest-600">Real</span>
          </h2>
          <p className="text-body text-ink-500 max-w-2xl mx-auto">
            India generates 3.2 million tonnes of e-waste annually — the 3rd largest globally. Only 22% is formally recycled. Here's what we're doing about it.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="rounded-2xl p-8 text-center shadow-lg border-2 bg-white border-sage-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="p-4 rounded-xl bg-gradient-forest w-fit mx-auto mb-5">
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div className="text-stat text-forest-700 mb-2">
                <CountUp target={stat.target} suffix={stat.suffix} />
              </div>
              <p className="font-semibold text-ink-900 mb-1">{stat.label}</p>
              <p className="text-small text-ink-500">{stat.note}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
