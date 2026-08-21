import { motion } from 'framer-motion';
import PickupNetwork from '../components/PickupNetwork';
import Breadcrumb from '../components/Breadcrumb';

export default function PickupNetworkPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Pickup Network' },
            ].filter((item) => item.label !== 'Home')}
          />
        </div>
        <PickupNetwork />
      </div>
    </motion.main>
  );
}
