import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Truck, ShoppingBag } from 'lucide-react';

export default function HomeCta() {
  const navigate = useNavigate();

  return (
    <section id="home-cta" className="py-20 lg:py-32 bg-cream-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="rounded-3xl bg-gradient-forest p-12 md:p-16 text-center text-white shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-h1 text-white mb-5">Your Old Phone Could Power Someone's Education</h2>
          <p className="text-body text-white/80 max-w-2xl mx-auto mb-10">
            When you recycle with us, recovered materials fund digital literacy programs. One smartphone recycling = 10 hours of computer training for rural students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/pickup-network')}
              className="inline-flex items-center justify-center gap-2 bg-white text-forest-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-forest-50 transition-colors"
            >
              <Truck size={20} />
              Schedule a Pickup
            </button>
            <button
              onClick={() => navigate('/disposables')}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/60 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <ShoppingBag size={20} />
              Browse Disposables
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
