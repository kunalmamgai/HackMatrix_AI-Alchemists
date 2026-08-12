import { motion } from 'framer-motion';
import CircularEconomy from '../components/CircularEconomy';

export default function CircularEconomyPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="pt-20">
        <CircularEconomy />
      </div>
    </motion.main>
  );
}
