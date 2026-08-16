import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Minimize2, RotateCcw, RotateCw, Leaf, Zap, Droplet, Trophy } from 'lucide-react';

const CYCLE = [
  {
    icon: Minimize2,
    number: '01',
    title: 'Reduce',
    description:
      'Minimize e-waste by buying only what you need and choosing quality over quantity.',
    benefits: ['Less manufacturing', 'Lower carbon footprint', 'Cost savings'],
    color: 'from-gold-400 to-gold-600',
  },
  {
    icon: RotateCcw,
    number: '02',
    title: 'Reuse',
    description:
      'Extend device lifecycles through repair, refurbishment, and donation programs.',
    benefits: ['Saves resources', 'Affordable access', 'Community support'],
    color: 'from-forest-400 to-forest-600',
  },
  {
    icon: RotateCw,
    number: '03',
    title: 'Recycle',
    description:
      'Responsibly process materials to recover valuable metals and minimize environmental impact.',
    benefits: ['Material recovery', 'Pollution prevention', 'New products'],
    color: 'from-sage-500 to-sage-700',
  },
];

const STATS = [
  { icon: Leaf, value: '95%', label: 'Less E-waste' },
  { icon: Zap, value: '80%', label: 'Energy Saved' },
  { icon: Droplet, value: '250M', label: 'Liters Water Saved' },
  { icon: Trophy, value: '1000+', label: 'Devices Renewed' },
];

const WAYS = [
  { number: 1, action: 'Buy Responsibly', desc: 'Choose durable, repairable devices' },
  { number: 2, action: 'Extend Life', desc: 'Keep devices working as long as possible' },
  { number: 3, action: 'Donate Used', desc: 'Give devices to those who need them' },
  { number: 4, action: "Repair, Don't Replace", desc: 'Get items fixed instead of buying new' },
  { number: 5, action: 'Recycle Properly', desc: 'Use certified e-waste recyclers' },
];

export default function CircularEconomy() {
  const navigate = useNavigate();

  return (
    <section id="circular" className="section bg-cream-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial header — the "why", not a feature intro */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-small uppercase tracking-widest text-gold-600 mb-4">
            Why we exist
          </p>
          <h2 className="text-h1 text-ink-900 mb-6">
            The Circular Economy <span className="text-gold-500">in Action</span>
          </h2>
          <p className="text-body md:text-h3 font-normal text-ink-500 max-w-3xl mx-auto leading-relaxed">
            Every device can stay in the loop instead of ending up in a landfill.
            Understanding how we transform e-waste into value through a sustainable
            circular model — that's the mission.
          </p>
        </motion.div>

        {/* Editorial cycle — numbered timeline, alternating rows */}
        <div className="space-y-16 md:space-y-20 mb-24">
          {CYCLE.map((item, index) => (
            <motion.div
              key={item.title}
              className={`flex flex-col md:flex-row items-start gap-8 md:gap-16 ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Icon + number */}
              <div className="md:w-2/5 flex items-start gap-5">
                <span className="text-display font-bold text-sage-300 leading-none select-none">
                  {item.number}
                </span>
                <motion.div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}
                  whileHover={{ rotate: 8, scale: 1.05 }}
                >
                  <item.icon className="w-8 h-8 text-white" />
                </motion.div>
              </div>

              {/* Copy */}
              <div className="md:w-3/5">
                <h3 className="text-h2 text-ink-900 mb-3">{item.title}</h3>
                <p className="text-body text-ink-500 mb-6 leading-relaxed max-w-xl">
                  {item.description}
                </p>
                <ul className="space-y-2.5">
                  {item.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center space-x-3 text-ink-700">
                      <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${item.color}`} />
                      <span className="text-body">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Environmental Impact Stats */}
        <motion.div
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-h2 text-center mb-12 text-ink-900">
            Environmental Impact
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                className="rounded-2xl p-8 text-center shadow-soft border-2 bg-white border-sage-200"
                whileHover={{ scale: 1.03, y: -4 }}
              >
                <div className="p-4 rounded-xl bg-gradient-forest w-fit mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-stat text-forest-600 mb-2">{stat.value}</div>
                <p className="text-small text-ink-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How You Can Help */}
        <motion.div
          className="rounded-2xl p-10 md:p-14 bg-white border-2 border-forest-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-h2 font-bold mb-2 text-center text-ink-900">
            5 Ways to Support the Circular Economy
          </h3>
          <p className="text-body text-center text-ink-500 mb-10 max-w-xl mx-auto">
            Small choices, compounding into a waste-free future.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {WAYS.map((item, index) => (
              <motion.div
                key={index}
                className="p-4 rounded-xl text-center transition-all bg-sage-100/50 hover:bg-sage-100"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-forest text-white font-bold flex items-center justify-center mx-auto mb-2">
                  {item.number}
                </div>
                <h4 className="font-bold text-small mb-1 text-ink-900">{item.action}</h4>
                <p className="text-xs text-ink-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-h1 text-ink-900 mb-4">Ready to Make a Difference?</h3>
          <p className="text-body mb-8 max-w-2xl mx-auto text-ink-500">
            Join thousands of people who are already part of the circular economy
            movement. Start by disposing of your e-waste responsibly today.
          </p>
          <motion.button
            className="btn-primary"
            onClick={() => navigate('/')}
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
