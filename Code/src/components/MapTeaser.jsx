import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, ShieldCheck, Database, Recycle, ArrowRight } from 'lucide-react';
import MapComponent from './MapComponent';
import { centers } from '../data/centers';
import 'leaflet/dist/leaflet.css';

export default function MapTeaser({ darkMode }) {
  const navigate = useNavigate();
  const topCenters = [...centers].sort((a, b) => b.rating - a.rating).slice(0, 5);

  const badges = [
    { icon: ShieldCheck, label: 'Certified & verified' },
    { icon: Database, label: 'Data destruction' },
    { icon: Recycle, label: 'Material recovery' },
  ];

  return (
    <section id="map-teaser" className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Find Certified <span className="text-cyan-400">Recycling Centers</span>
          </h2>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            A network of verified e-waste recyclers across India — with directions, ratings, and pickup options.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: highlights */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ul className="space-y-4 mb-8">
              {topCenters.map((center) => (
                <li
                  key={center.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="p-2.5 rounded-lg bg-eco-500/15 flex-shrink-0">
                    <MapPin className="w-5 h-5 text-eco-500" />
                  </div>
                  <div className="min-w-0">
                    <p className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {center.name}
                    </p>
                    <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {center.address} · ★ {center.rating} ({center.reviews})
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3 mb-8">
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 ${
                    darkMode
                      ? 'bg-gray-800 border-eco-700/50 text-eco-300'
                      : 'bg-eco-50 border-eco-200 text-eco-700'
                  }`}
                >
                  <badge.icon className="w-4 h-4" />
                  {badge.label}
                </span>
              ))}
            </div>

            <button
              onClick={() => navigate('/nearby-locations')}
              className="btn-primary inline-flex items-center gap-2"
            >
              Explore All {centers.length} Centers
              <ArrowRight size={18} />
            </button>
          </motion.div>

          {/* Right: live map */}
          <motion.div
            className="h-[420px] rounded-2xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <MapComponent
              locations={centers}
              selectedLocation={null}
              onSelectLocation={() => {}}
              darkMode={darkMode}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
