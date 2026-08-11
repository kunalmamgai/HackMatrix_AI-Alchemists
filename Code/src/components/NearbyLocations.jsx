import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone, Clock, Star, Filter } from 'lucide-react';
import MapComponent from './MapComponent';
import { centers } from '../data/centers';
import 'leaflet/dist/leaflet.css';

export default function NearbyLocations({ darkMode }) {
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
      className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title mb-4 text-cyan-400">Find Nearby Recycling Centers</h2>
          <p className={`section-subtitle ${darkMode ? 'text-gray-400' : ''}`}>
            Locate certified e-waste recycling centers near you with real-time information
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Real Map */}
          <motion.div
            className={`lg:col-span-2 rounded-2xl overflow-hidden shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <div className="relative h-96 lg:h-full min-h-96">
              <MapComponent
                locations={filteredLocations}
                selectedLocation={selectedLocation}
                onSelectLocation={setSelectedLocation}
                darkMode={darkMode}
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
            {/* Filters */}
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center space-x-2 mb-3">
                <Filter size={18} className="text-eco-500" />
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Filters</h3>
              </div>

              {/* Sort */}
              <div className="mb-4">
                <label className={`text-xs font-semibold block mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                >
                  <option value="distance">Distance</option>
                  <option value="rating">Rating</option>
                  <option value="reviews">Reviews</option>
                </select>
              </div>

              {/* Service Filter */}
              <div>
                <label className={`text-xs font-semibold block mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Services
                </label>
                <div className="flex flex-wrap gap-2">
                  {allServices.map((service) => (
                    <button
                      key={service}
                      onClick={() => setFilterService(service)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        filterService === service
                          ? 'bg-eco-500 text-white'
                          : darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                      ? darkMode
                        ? 'bg-eco-600/20 border-2 border-eco-500 scale-105 shadow-lg'
                        : 'bg-eco-50 border-2 border-eco-500 scale-105 shadow-lg'
                      : darkMode
                      ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                      : 'bg-white hover:bg-gray-50 border border-gray-200'
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
                      <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {location.name}
                      </h4>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                        selectedLocation?.id === location.id
                          ? 'bg-eco-500 text-white'
                          : 'bg-eco-100 text-eco-700'
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
                          className={i < Math.floor(location.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                        />
                      ))}
                      <span className={`text-xs ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {location.rating} ({location.reviews})
                      </span>
                    </div>

                    {/* Details */}
                    <div className={`grid grid-cols-2 gap-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
            className={`mt-8 rounded-2xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
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
                <h3 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedLocation.name}
                </h3>
                {selectedLocation.description && (
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedLocation.description}
                  </p>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-eco-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase`}>Address</p>
                      <p className={darkMode ? 'text-white' : 'text-gray-900'}>{selectedLocation.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-eco-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase`}>Phone</p>
                      <a href={`tel:${selectedLocation.phone}`} className={`hover:text-eco-500 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedLocation.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-eco-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase`}>Hours</p>
                      <p className={darkMode ? 'text-white' : 'text-gray-900'}>{selectedLocation.hours}</p>
                    </div>
                  </div>
                  </div>
                </div>
                <div>
                  <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Services Offered</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedLocation.services.map((service, index) => (
                    <motion.span
                      key={index}
                      className="px-3 py-2 rounded-lg bg-gradient-eco text-white text-sm font-medium"
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
