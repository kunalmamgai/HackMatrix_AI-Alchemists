import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import HomeFeatures from '../components/HomeFeatures';
import ImpactStats from '../components/ImpactStats';
import DisposablesBar from '../components/DisposablesBar';
import DrawerEstimator from '../components/DrawerEstimator';
import HomeCta from '../components/HomeCta';
import HeroAurora from '../components/HeroAurora';

// MapTeaser pulls in Leaflet (~150 KB) — keep it out of the first paint
// by loading it as its own chunk once the page mounts.
const MapTeaser = lazy(() => import('../components/MapTeaser'));

function MapTeaserSkeleton() {
  return (
    <section className="py-16 lg:py-24 bg-cream-50" aria-hidden="true">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-10 w-2/3 max-w-md mx-auto rounded-full bg-white animate-pulse mb-14" />
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-white animate-pulse" />
            ))}
          </div>
          <div className="h-[420px] rounded-2xl bg-white animate-pulse" />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero with WebGL aurora background */}
      <div className="relative min-h-screen overflow-hidden bg-forest-900">
        <HeroAurora />

        <div
          className="absolute inset-0 bg-gradient-hero"
          aria-hidden="true"
        />
        <div className="absolute inset-0 backdrop-blur-[1px]" aria-hidden="true" />

        <div className="relative z-10">
          <Hero transparentBackground />
        </div>


      </div>

      {/* Below-the-fold sections */}
      <HomeFeatures />
      <ImpactStats />
      <Suspense fallback={<MapTeaserSkeleton />}>
        <MapTeaser />
      </Suspense>
      <DisposablesBar />
      <DrawerEstimator />
      <HomeCta />
    </motion.main>
  );
}
