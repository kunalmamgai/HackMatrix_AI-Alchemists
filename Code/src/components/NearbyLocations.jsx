import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone, Clock, Star, Filter } from 'lucide-react';
import MapComponent from './MapComponent';
import { centers } from '../data/centers';
import 'leaflet/dist/leaflet.css';

export default function NearbyLocations() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const detailsRef = useRef(null);

  useEffect(() => {
    if (selectedLocation) {
      // debug log to check selected object in browser console
      // eslint-disable-next-line no-console
      console.log('Selected location:', selectedLocation);
      if (detailsRef.current) {
        detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [selectedLocation]);
  const navigate = useNavigate();

  const handleGetDirections = () => {
    if (!selectedLocation) return;
    const { coordinates, address } = selectedLocation;
    const dest = coordinates ? `${coordinates.lat},${coordinates.lng}` : encodeURIComponent(address || '');
    const url = `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
    window.open(url, '_blank');
  };

  const handleRequestPickup = () => {
    if (!selectedLocation) return;
    navigate('/pickup-network', { state: { locationId: selectedLocation.id } });
  };
  const [sortBy, setSortBy] = useState('distance');
  const [filterService, setFilterService] = useState('All');

  const allServices = ['All', 'Drop-off', 'Pickup', 'Refurbishment', 'Data Destruction'];

  const sortedLocations = [...centers].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'distance':
        return a.distance - b.distance;
      case 'reviews':
        return b.reviews - a.reviews;
      default:
        return 0;
    }
  });

  const filteredLocations = sortedLocations.filter(location => {
    if (filterService === 'All') return true;
    return location.services.some(service =>
      service.toLowerCase().includes(filterService.toLowerCase())
    );
  });

  return (
    <section
      id="locations"
      className={`py-16 lg:py-24 bg-cream-50`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title mb-4 text-forest-600">Find Nearby Recycling Centers</h2>
          <p className={`section-subtitle text-ink-500`}>
            Locate certified e-waste recycling centers near you with real-time information
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Real Map */}
          <motion.div
            className={`lg:col-span-2 rounded-2xl overflow-hidden shadow-xl bg-white`}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <div className="relative h-96 lg:h-full min-h-96">
              <MapComponent
                locations={filteredLocations}
                selectedLocation={selectedLocation}
                onSelectLocation={setSelectedLocation}
              />
            </div>
          </motion.div>

          {/* Sidebar with Locations List */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Selected-center action panel — actions stay beside the map */}
            {selectedLocation && (
              <div className="rounded-2xl bg-forest-800 text-white p-5 shadow-lg">
                <h4 className="font-bold mb-1 text-white">{selectedLocation.name}</h4>
                <div className="text-xs text-forest-100/80 mb-3">
                  <span className="text-gold-400">★</span> {selectedLocation.rating} ({selectedLocation.reviews}) · {selectedLocation.distance} km
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleGetDirections}
                    className="flex-1 text-xs font-semibold py-2 rounded-lg bg-gradient-forest text-white hover:shadow-glow transition-all"
                  >
                    <Navigation size={14} className="inline mr-1 -mt-0.5" />
                    Directions
                  </button>
                  <button
                    onClick={handleRequestPickup}
                    className="flex-1 text-xs font-semibold py-2 rounded-lg border border-white/40 text-white hover:bg-white/10 transition-all"
                  >
                    Pickup
                  </button>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className={`p-4 rounded-xl bg-white shadow-lg`}>
              <div className="flex items-center space-x-2 mb-3">
                <Filter size={18} className="text-forest-500" />
                <h3 className={`font-semibold text-ink-900`}>Filters</h3>
              </div>

              {/* Sort */}
              <div className="mb-4">
                <label className={`text-xs font-semibold block mb-2 text-ink-500`}>
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors bg-sage-100 border-sage-200 text-ink-900`}
                >
                  <option value="distance">Distance</option>
                  <option value="rating">Rating</option>
                  <option value="reviews">Reviews</option>
                </select>
              </div>

              {/* Service Filter */}
              <div>
                <label className={`text-xs font-semibold block mb-2 text-ink-500`}>
                  Services
                </label>
                <div className="flex flex-wrap gap-2">
                  {allServices.map((service) => (
                    <button
                      key={service}
                      onClick={() => setFilterService(service)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        filterService === service
                          ? 'bg-forest-500 text-white'
                          : 'bg-sage-100 text-ink-700 hover:bg-sage-200'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Locations List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {filteredLocations.map((location, index) => (
                <motion.button
                  key={location.id}
                  onClick={() => setSelectedLocation(location)}
                  className={`w-full text-left overflow-hidden rounded-xl transition-all transform ${
                    selectedLocation?.id === location.id
                      ? 'bg-forest-600/20 border-2 border-forest-500 scale-105 shadow-lg'
                      : 'bg-white hover:bg-sage-100 border border-sage-200'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {location.image && (
                    <div className="w-full h-32 overflow-hidden">
                      <img
                        src={location.image}
                        alt={location.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`font-bold text-ink-900`}>
                        {location.name}
                      </h4>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                        selectedLocation?.id === location.id
                          ? 'bg-forest-500 text-white'
                          : 'bg-forest-100 text-forest-700'
                      }`}>
                        {location.distance} km
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(location.rating) ? 'fill-gold-400 text-gold-400' : 'text-ink-700'}
                        />
                      ))}
                      <span className={`text-xs ml-1 text-ink-500`}>
                        {location.rating} ({location.reviews})
                      </span>
                    </div>

                    {/* Details */}
                    <div className={`grid grid-cols-2 gap-2 text-xs text-ink-500`}>
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} />
                        <span className="truncate">Near you</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>Open hours</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Selected Location Details */}
        {selectedLocation && (
          <motion.div
            ref={detailsRef}
            className={`mt-8 rounded-2xl shadow-xl overflow-hidden bg-white`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {(selectedLocation.tabImage || selectedLocation.image) && (
              <div className="w-full h-80 overflow-hidden">
                <img
                  src={selectedLocation.tabImage || selectedLocation.image}
                  alt={selectedLocation.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <div className="mb-4">
                <h3 className={`text-3xl font-bold mb-2 text-ink-900`}>
                  {selectedLocation.name}
                </h3>
                {selectedLocation.description && (
                  <p className={`text-sm text-ink-700`}>
                    {selectedLocation.description}
                  </p>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-forest-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className={`text-xs font-semibold text-ink-500 uppercase`}>Address</p>
                      <p className={'text-ink-900'}>{selectedLocation.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-forest-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className={`text-xs font-semibold text-ink-500 uppercase`}>Phone</p>
                      <a href={`tel:${selectedLocation.phone}`} className={`hover:text-forest-500 transition-colors text-ink-900`}>
                        {selectedLocation.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-forest-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className={`text-xs font-semibold text-ink-500 uppercase`}>Hours</p>
                      <p className={'text-ink-900'}>{selectedLocation.hours}</p>
                    </div>
                  </div>
                  </div>
                </div>
                <div>
                  <h4 className={`font-semibold mb-3 text-ink-900`}>Services Offered</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedLocation.services.map((service, index) => (
                    <motion.span
                      key={index}
                      className="px-3 py-2 rounded-lg bg-gradient-forest text-white text-sm font-medium"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      ✓ {service}
                    </motion.span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={handleGetDirections} className="btn-primary flex-1 flex items-center justify-center space-x-2">
                    <Navigation size={18} />
                    <span>Get Directions</span>
                  </button>
                  <button onClick={handleRequestPickup} className="btn-secondary flex-1">Request Pickup</button>
                </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
