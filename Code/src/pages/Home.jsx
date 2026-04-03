import { motion } from 'framer-motion';
import Hero from '../components/Hero';

export default function Home({ darkMode, onSearchClick }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Hero onSearchClick={onSearchClick} darkMode={darkMode} />
    </motion.main>
  );
}
