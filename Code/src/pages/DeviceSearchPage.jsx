import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import DeviceSearch from '../components/DeviceSearch';

export default function DeviceSearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="pt-20">
        <DeviceSearch key={initialQuery} initialQuery={initialQuery} />
      </div>
    </motion.main>
  );
}
