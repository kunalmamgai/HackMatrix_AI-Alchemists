import { motion } from 'framer-motion';
import NearbyLocations from '../components/NearbyLocations';
import Breadcrumb from '../components/Breadcrumb';

export default function NearbyLocationsPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Nearby Locations' },
            ].filter((item) => item.label !== 'Home')}
          />
        </div>
        <NearbyLocations />
      </div>
    </motion.main>
  );
}
