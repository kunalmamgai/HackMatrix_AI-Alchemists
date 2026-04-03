import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import homeVideo from '../assets/home.mp4';

export default function Home({ darkMode, onSearchClick }) {
  return (
    <motion.main
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <video
        className="absolute inset-0 h-full w-full scale-105 object-cover blur-[2px] md:blur-[3px] brightness-[0.72] saturate-[0.9]"
        src={homeVideo}
        autoPlay
        muted
        loop
        playsInline
      />

      <div
        className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/55"
        aria-hidden="true"
      />
      <div className="absolute inset-0 backdrop-blur-[1px]" aria-hidden="true" />

      <div className="relative z-10">
        <Hero
          onSearchClick={onSearchClick}
          darkMode={darkMode}
          transparentBackground
        />
      </div>
    </motion.main>
  );
}
