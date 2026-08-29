import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Truck, ShoppingBag, RotateCcw, ArrowRight, Leaf } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Device Disposal Guide',
    description: 'Search any device for step-by-step disposal steps, safety warnings, and recycling value.',
    href: '/device-search',
  },
  {
    icon: MapPin,
    title: 'Nearby Recycling Centers',
    description: 'Find certified e-waste recyclers near you on an interactive map with filters.',
    href: '/nearby-locations',
  },
  {
    icon: Truck,
    title: 'Pickup & Reuse Network',
    description: 'Schedule a doorstep pickup and connect with verified recyclers and repairers.',
    href: '/pickup-network',
  },
  {
    icon: ShoppingBag,
    title: 'Refurbished Marketplace',
    description: 'Shop tested, refurbished disposables at great prices — a second life for electronics.',
    href: '/disposables',
  },
  {
    icon: RotateCcw,
    title: 'Circular Economy',
    description: 'See how reduce → reuse → recycle keeps devices and materials in the loop.',
    href: '/circular-economy',
  },
];

export default function HomeFeatures() {
  const navigate = useNavigate();

  return (
    <section id="features" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-h1 text-ink-900 mb-4">
            Everything You Need to <span className="text-forest-600">Go Circular</span>
          </h2>
          <p className="text-body text-ink-500 max-w-2xl mx-auto">
            One platform for the whole e-waste journey — from finding a recycler to buying a second-life device.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.button
              key={feature.title}
              onClick={() => navigate(feature.href)}
              className={`text-left rounded-2xl p-8 shadow-lg border-2 transition-all bg-cream-50 border-sage-200 hover:border-forest-500`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ scale: 1.03, y: -4 }}
            >
              <div className="p-4 rounded-xl bg-gradient-forest w-fit mb-5">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-h3 text-ink-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-body text-ink-500 mb-5">
                {feature.description}
              </p>
              <span className="inline-flex items-center gap-1 text-small font-semibold text-forest-600">
                Explore <ArrowRight size={16} />
              </span>
            </motion.button>
          ))}

          {/* CTA card to fill the grid */}
          <motion.div
            className="rounded-2xl p-8 bg-gradient-forest text-white flex flex-col justify-between shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div>
              <Leaf className="w-8 h-8 mb-5" />
              <h3 className="text-h3 text-white mb-3">Make Your E-Waste Count</h3>
              <p className="text-body text-white/80 mb-6">
                Have old devices lying around? Turn them into pickups, repairs, and refurbished products.
              </p>
            </div>
            <button
              onClick={() => navigate('/pickup-network')}
              className="w-full bg-white text-forest-700 font-semibold py-3.5 px-4 rounded-xl hover:bg-forest-50 transition-colors"
            >
              Schedule a Pickup
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
