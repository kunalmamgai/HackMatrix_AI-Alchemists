import { motion } from 'framer-motion';
import PickupNetwork from '../components/PickupNetwork';

export default function PickupNetworkPage({ darkMode, onNotification }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="pt-20">
        <PickupNetwork darkMode={darkMode} onNotification={onNotification} />
      </div>
    </motion.main>
  );
}
