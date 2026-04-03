import { motion } from 'framer-motion';
import DeviceSearch from '../components/DeviceSearch';

export default function DeviceSearchPage({ darkMode }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="pt-20">
        <DeviceSearch darkMode={darkMode} />
      </div>
    </motion.main>
  );
}
