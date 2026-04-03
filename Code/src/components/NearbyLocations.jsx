import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone, Clock, Star, Filter } from 'lucide-react';

const MOCK_LOCATIONS = [
  {
    id: 1,
    name: 'GreenTech Recycling Center',
    distance: 0.8,
    rating: 4.8,
    reviews: 342,
    address: '123 Eco Street, Green City, GC 12345',
    phone: '+1 (555) 123-4567',
    hours: 'Mon-Sat: 9AM-6PM',
    services: ['Drop-off', 'Bulk Pickup', 'Certified Recycling'],
    coordinates: { lat: 40.7128, lng: -74.0060 },
  },
  {
    id: 2,
    name: 'Earth Renewal Hub',
    distance: 2.3,
    rating: 4.6,
    reviews: 218,
    address: '456 Sustainability Ave, Eco Town, ET 54321',
    phone: '+1 (555) 234-5678',
    hours: 'Tue-Sun: 10AM-7PM',
    services: ['Drop-off', 'Repair Program', 'Data Destruction'],
    coordinates: { lat: 40.7580, lng: -73.9855 },
  },
  {
    id: 3,
    name: 'CircularEarth E-Waste Solutions',
    distance: 1.2,
    rating: 4.9,
    reviews: 567,
    address: '789 Planet Avenue, Waste-Free Zone, WZ 67890',
    phone: '+1 (555) 345-6789',
    hours: 'Mon-Fri: 8AM-8PM',
    services: ['Drop-off', 'Scheduled Pickup', 'Bulk Business Accounts'],
    coordinates: { lat: 40.7489, lng: -73.9680 },
  },
  {
    id: 4,
    name: 'Tech Recycle Pro',
    distance: 3.1,
    rating: 4.5,
    reviews: 156,
    address: '321 Innovation Blvd, Tech City, TC 11111',
    phone: '+1 (555) 456-7890',
    hours: 'Mon-Sun: 9AM-9PM',
    services: ['Drop-off', 'Free Assessment', 'Buy Used Electronics'],
    coordinates: { lat: 40.7614, lng: -73.9776 },
  },
  {
    id: 5,
    name: 'Sustainable Materials Collective',
    distance: 4.5,
    rating: 4.7,
    reviews: 289,
    address: '654 Resource St, Reuse City, RC 22222',
    phone: '+1 (555) 567-8901',
    hours: 'Tue-Sat: 11AM-6PM',
    services: ['Drop-off', 'Refurbishment Services', 'Community Programs'],
    coordinates: { lat: 40.7505, lng: -73.9934 },
  },
  {
    id: 6,
    name: 'Future Forward Recycling',
    distance: 5.8,
    rating: 4.4,
    reviews: 194,
    address: '987 Tomorrow Lane, Innovative District, ID 33333',
    phone: '+1 (555) 678-9012',
    hours: 'Wed-Mon: 10AM-5PM',
    services: ['Drop-off', 'Data Secure Destruction', 'Environmental Reports'],
    coordinates: { lat: 40.7549, lng: -73.9840 },
  },
];

export default function NearbyLocations({ darkMode }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [sortBy, setSortBy] = useState('distance');
  const [filterService, setFilterService] = useState('All');

  const allServices = ['All', 'Drop-off', 'Pickup', 'Refurbishment', 'Data Destruction'];

  const sortedLocations = [...MOCK_LOCATIONS].sort((a, b) => {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

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
          <h2 className="section-title mb-4">Find Nearby Recycling Centers</h2>
          <p className="section-subtitle">
            Locate certified e-waste recycling centers near you with real-time information
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Placeholder */}
          <motion.div
            className={`lg:col-span-2 rounded-2xl overflow-hidden shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative h-96 lg:h-full min-h-96 bg-gradient-to-br from-eco-100 to-ocean-100 flex items-center justify-center overflow-hidden">
              {/* Interactive Map Background */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 400 400">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="400" height="400" fill="url(#grid)" />
                </svg>
              </div>

              {/* Location Pins */}
              <motion.div
                className="relative w-full h-full"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {filteredLocations.map((location, index) => (
                  <motion.button
                    key={location.id}
                    onClick={() => setSelectedLocation(location)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                      selectedLocation?.id === location.id
                        ? 'scale-150'
                        : 'hover:scale-125'
                    }`}
                    style={{
                      left: `${30 + (index % 3) * 35}%`,
                      top: `${20 + Math.floor(index / 3) * 40}%`,
                    }}
                    variants={itemVariants}
                    whileHover={{ scale: 1.3 }}
                  >
                    <div className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center transform transition-all ${
                      selectedLocation?.id === location.id
                        ? 'bg-eco-500 text-white'
                        : 'bg-white text-eco-600 hover:bg-eco-100'
                    }`}>
                      <MapPin size={20} />
                    </div>
                    {selectedLocation?.id === location.id && (
                      <motion.div
                        className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm font-semibold text-eco-600 bg-white px-3 py-1 rounded-lg shadow-lg"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {location.name}
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </motion.div>

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-lg p-3 shadow-lg">
                <p className="text-xs font-semibold text-gray-700 mb-2">Legend</p>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-eco-500" />
                  <span className="text-gray-600">Selected center</span>
                </div>
              </div>
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
                  className={`w-full text-left p-4 rounded-xl transition-all transform ${
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
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Selected Location Details */}
        {selectedLocation && (
          <motion.div
            className={`mt-8 p-6 rounded-2xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedLocation.name}
                </h3>
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
                  <button className="btn-primary flex-1 flex items-center justify-center space-x-2">
                    <Navigation size={18} />
                    <span>Get Directions</span>
                  </button>
                  <button className="btn-secondary flex-1">Request Pickup</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
