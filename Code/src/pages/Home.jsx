import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import HomeFeatures from '../components/HomeFeatures';
import ImpactStats from '../components/ImpactStats';
import DisposablesBar from '../components/DisposablesBar';
import CircularEconomyTeaser from '../components/CircularEconomyTeaser';
import DrawerEstimator from '../components/DrawerEstimator';
import HomeCta from '../components/HomeCta';
import homeVideo from '../assets/home.mp4';

// MapTeaser pulls in Leaflet (~150 KB) — keep it out of the first paint
// by loading it as its own chunk once the page mounts.
const MapTeaser = lazy(() => import('../components/MapTeaser'));

function MapTeaserSkeleton() {
  return (
    <section className="py-20 bg-gray-900" aria-hidden="true">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-10 w-2/3 max-w-md mx-auto rounded-full bg-gray-800 animate-pulse mb-14" />
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-gray-800 animate-pulse" />
            ))}
          </div>
          <div className="h-[420px] rounded-2xl bg-gray-800 animate-pulse" />
        </div>
      </div>
    </section>
  );
}

export default function Home({ darkMode }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero with video background */}
      <div className="relative min-h-screen overflow-hidden">
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
          <Hero darkMode={darkMode} transparentBackground />
        </div>
      </div>

      {/* Below-the-fold sections */}
      <HomeFeatures darkMode={darkMode} />
      <ImpactStats darkMode={darkMode} />
      <Suspense fallback={<MapTeaserSkeleton />}>
        <MapTeaser darkMode={darkMode} />
      </Suspense>
      <DisposablesBar darkMode={darkMode} />
      <CircularEconomyTeaser darkMode={darkMode} />
      <DrawerEstimator darkMode={darkMode} />
      <HomeCta darkMode={darkMode} />
    </motion.main>
  );
}
