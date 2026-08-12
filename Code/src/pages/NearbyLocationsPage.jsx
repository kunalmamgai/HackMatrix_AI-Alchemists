import { motion } from 'framer-motion';
import NearbyLocations from '../components/NearbyLocations';

export default function NearbyLocationsPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="pt-20">
        <NearbyLocations />
      </div>
    </motion.main>
  );
}
