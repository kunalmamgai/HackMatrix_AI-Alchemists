import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Truck, ShoppingBag } from 'lucide-react';

export default function HomeCta() {
  const navigate = useNavigate();

  return (
    <section id="home-cta" className={`py-20 bg-cream-50`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="rounded-3xl bg-gradient-eco p-10 md:p-14 text-center text-white shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-10">
            Every device you recycle keeps toxic waste out of landfills and gives materials a second life.
            Start today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/pickup-network')}
              className="inline-flex items-center justify-center gap-2 bg-white text-eco-700 font-semibold px-8 py-3 rounded-xl hover:bg-eco-50 transition-colors"
            >
              <Truck size={20} />
              Schedule a Pickup
            </button>
            <button
              onClick={() => navigate('/disposables')}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/60 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors"
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
