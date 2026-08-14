import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Search, Zap, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { devices } from '../data/devices';
import { transitions } from '../utils/motion';

// HeroScene pulls in three.js (~132 KB gzip) — keep it out of the first
// paint by loading it as its own chunk, exactly like the lazy Leaflet map.
const HeroScene = lazy(() => import('./HeroScene'));

// A WebGL failure must never take down the whole page.
class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function Hero({ transparentBackground = false }) {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [query, setQuery] = useState('');

  // Scroll parallax — the hero drifts up and fades as it scrolls past.
  // Driven by a motion value (no re-renders, no framer-motion container warning)
  // and mapped across the hero's own height so the effect is 0→1 per viewport.
  const rawProgress = useMotionValue(0);
  const contentY = useTransform(rawProgress, [0, 1], [0, -90]);
  const contentOpacity = useTransform(rawProgress, [0, 0.75], [1, 0]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const height = rect.height || 1;
      rawProgress.set(Math.min(1, Math.max(0, -rect.top / height)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [rawProgress]);

  // Cursor-follow glow
  const glowX = useMotionValue(-500);
  const glowY = useMotionValue(-500);
  const springX = useSpring(glowX, { stiffness: 45, damping: 18, mass: 0.6 });
  const springY = useSpring(glowY, { stiffness: 45, damping: 18, mass: 0.6 });
  const [showSuggestions, setShowSuggestions] = useState(false);

  const trimmedQuery = query.trim().toLowerCase();
  const suggestions = trimmedQuery
    ? devices
        .filter(
          (device) =>
            device.name.toLowerCase().includes(trimmedQuery) ||
            device.category.toLowerCase().includes(trimmedQuery)
        )
        .slice(0, 5)
    : [];

  const handleSelectDevice = (device) => {
    setShowSuggestions(false);
    setQuery('');
    navigate(`/device-search?q=${encodeURIComponent(device.name)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && trimmedQuery) {
      e.preventDefault();
      setShowSuggestions(false);
      navigate(`/device-search?q=${encodeURIComponent(trimmedQuery)}`);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: transitions.slow,
    },
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    glowX.set(e.clientX - rect.left - 220);
    glowY.set(e.clientY - rect.top - 220);
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      onMouseMove={handleMouseMove}
      className={`relative min-h-screen flex items-center justify-center pt-20 overflow-hidden ${transparentBackground ? 'bg-transparent' : 'bg-gradient-to-b from-cream-50 via-cream-100 to-cream-50'}`}
    >
      {/* Cursor-follow glow above the aurora, below the content */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-[5] h-[440px] w-[440px] rounded-full opacity-25 blur-3xl mix-blend-screen"
        style={{
          x: springX,
          y: springY,
          background: 'radial-gradient(circle, rgba(224,165,39,0.6) 0%, rgba(46,93,70,0.4) 45%, transparent 70%)',
        }}
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 w-full"
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-forest-900/30 border border-forest-700/50">
              <Zap className="w-4 h-4 text-forest-300" />
              <Leaf className="w-4 h-4 text-gold-400" />
              <span className="text-sm font-medium text-forest-100">Revolutionizing E-Waste</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-display mb-6 text-white"
          >
            Dispose Smarter. <br />
            <span className="bg-gradient-to-r from-forest-300 to-gold-300 bg-clip-text text-transparent text-gradient-shimmer">
              Reuse Better.
            </span>
            <br />
            Save the Planet.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-forest-100/90`}
          >
            Join millions in responsible e-waste disposal. Find recycling centers, schedule pickups, and participate in our circular economy network.
          </motion.p>

          {/* Quick Search + CTA */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
            <div className="relative w-full md:w-[420px]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className="text-ink-500" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onKeyDown={handleKeyDown}
                placeholder="Search a device, e.g. Laptop, Battery..."
                aria-label="Search the device disposal guide"
                className="w-full pl-12 pr-4 py-3 rounded-xl text-ink-900 placeholder-ink-400 bg-sage-100/95 backdrop-blur border-2 border-forest-500/60 focus:outline-none focus:ring-2 focus:ring-forest-400 shadow-lg"
              />

              {showSuggestions && suggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-20 mt-2 w-full bg-sage-100/95 backdrop-blur-md border border-sage-200 rounded-xl shadow-2xl overflow-hidden text-left"
                >
                  {suggestions.map((device) => (
                    <li key={device.id}>
                      <button
                        type="button"
                        onMouseDown={() => handleSelectDevice(device)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-sage-100 transition-colors text-left"
                      >
                        <device.icon className="w-4 h-4 text-forest-400 flex-shrink-0" />
                        <span className="text-sm text-ink-900">{device.name}</span>
                        <span className="ml-auto text-xs text-ink-500">{device.category}</span>
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </div>

            <motion.button
              onClick={() => navigate('/pickup-network')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 border-2 border-white/60 text-white hover:bg-white/10`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule Pickup
            </motion.button>
          </motion.div>

          {/* 3D Material Recovery Scene — replaces the old illustration slot */}
          <SceneErrorBoundary>
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>
          </SceneErrorBoundary>

          {/* Featured Stats — real figures from the in-repo datasets */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            {[
              { number: '17', label: 'Verified Centers' },
              { number: '6', label: 'Device Categories' },
              { number: '₹2,500+', label: 'Recoverable Value' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="p-4 rounded-xl bg-sage-100/50 border border-sage-200 backdrop-blur-md"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-stat text-forest-400 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-forest-100/80">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

        </motion.div>
      </div>
      </motion.div>
    </section>
  );
}
