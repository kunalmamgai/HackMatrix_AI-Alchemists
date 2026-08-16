import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, ShieldCheck, Database, Recycle, ArrowRight, Star } from 'lucide-react';
import MapComponent from './MapComponent';
import { centers } from '../data/centers';
import 'leaflet/dist/leaflet.css';

export default function MapTeaser() {
  const navigate = useNavigate();
  const topCenters = [...centers].sort((a, b) => b.rating - a.rating).slice(0, 5);

  const badges = [
    { icon: ShieldCheck, label: 'Certified & verified' },
    { icon: Database, label: 'Data destruction' },
    { icon: Recycle, label: 'Material recovery' },
  ];

  return (
    <section id="map-teaser" className={`py-16 lg:py-24 bg-cream-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 text-ink-900`}>
            Find Certified <span className="text-forest-500">Recycling Centers</span>
          </h2>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto text-ink-500`}>
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
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 bg-white border-sage-200`}
                >
                  <div className="p-2.5 rounded-lg bg-forest-500/15 flex-shrink-0">
                    <MapPin className="w-5 h-5 text-forest-500" />
                  </div>
                  <div className="min-w-0">
                    <p className={`font-semibold truncate text-ink-900`}>
                      {center.name}
                    </p>
                    <p className={`text-sm truncate text-ink-500`}>
                      {center.address} ·
                      <span className="inline-flex items-center gap-1 ml-1">
                        <Star size={12} className="fill-gold-400 text-gold-400" />
                        {center.rating} ({center.reviews})
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3 mb-8">
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 bg-white border-forest-200 text-forest-600`}
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
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
