import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone, Clock, Star, Filter } from 'lucide-react';
import MapComponent from './MapComponent';
import 'leaflet/dist/leaflet.css';

const MOCK_LOCATIONS = [
  {
    id: 1,
    name: 'Green Cycle Delhi',
    distance: 0.8,
    rating: 4.8,
    reviews: 342,
    address: 'Holambi Kalan, Delhi',
    phone: '+91 (120) 456-7890',
    hours: 'Mon-Sat: 9AM-6PM',
    services: ['Drop-off', 'Dismantling', 'Refurbishing', 'Component Testing', 'Plastic Recovery', 'Second-hand Electronics Market'],
    coordinates: { lat: 28.5921, lng: 77.3693 },
    image: 'https://images.news18.com/ibnlive/uploads/2025/06/Delhi-eco-park-2025-06-3a0fa58fc26fffe73108773502cfb9d3.jpg',
    description: "India's first state-of-the-art E-Waste Eco Park at Holambi Kalan, spanning 11.4 acres with Rs 150 crore investment. Processes 51,000 metric tonnes of e-waste annually covering all 106 categories under E-Waste Management Rules 2022. Features dedicated zones for dismantling, refurbishing, component testing, plastic recovery, and second-hand electronics market. Includes skilling centers to train thousands of informal workers. Expected to generate Rs 350 crore in revenue and create thousands of green jobs. PPP model with 18-month construction timeline.",
  },
  {
    id: 2,
    name: 'Tech Recycle Mumbai',
    distance: 2.3,
    rating: 4.6,
    reviews: 218,
    address: '123 Innovation Avenue, GIDC, Thane (W), Maharashtra 400601',
    phone: '+91 (022) 6789-0123',
    hours: 'Tue-Sun: 10AM-7PM',
    services: ['Drop-off', 'Repair Program', 'Data Destruction'],
    coordinates: { lat: 19.2183, lng: 72.9781 },
  },
  {
    id: 3,
    name: 'E-Waste Solutions Bangalore',
    distance: 1.2,
    rating: 4.9,
    reviews: 567,
    address: '678 Tech Park, Outer Ring Road, Bangalore, Karnataka 560103',
    phone: '+91 (080) 4123-5678',
    hours: 'Mon-Fri: 8AM-8PM',
    services: ['Drop-off', 'Scheduled Pickup', 'Bulk Business Accounts'],
    coordinates: { lat: 12.9716, lng: 77.5946 },
    tabImage: 'https://content.jdmagicbox.com/comp/def_content/e-waste-recycling/ap-18344325082660-e-waste-recycling-2-z16rw.jpg',
    image: 'https://content.jdmagicbox.com/comp/def_content/e-waste-recycling/ap-18344325082660-e-waste-recycling-2-z16rw.jpg',
  },
  {
    id: 4,
    name: 'Eco Mind Hyderabad',
    distance: 3.1,
    rating: 4.5,
    reviews: 156,
    address: '234 Green Street, Hitec City, Hyderabad, Telangana 500081',
    phone: '+91 (040) 3456-7890',
    hours: 'Mon-Sun: 9AM-9PM',
    services: ['Drop-off', 'Free Assessment', 'Buy Used Electronics'],
    coordinates: { lat: 17.3850, lng: 78.4867 },
  },
  {
    id: 5,
    name: 'Sustainable Chennai',
    distance: 4.5,
    rating: 4.7,
    reviews: 289,
    address: '456 Industrial Estate, Guindy, Chennai, Tamil Nadu 600032',
    phone: '+91 (044) 5678-9012',
    hours: 'Tue-Sat: 11AM-6PM',
    services: ['Drop-off', 'Refurbishment Services', 'Community Programs'],
    coordinates: { lat: 13.0827, lng: 80.2707 },
  },
  {
    id: 6,
    name: 'Green Future Kolkata',
    distance: 5.8,
    rating: 4.4,
    reviews: 194,
    address: '789 Tech Lane, Salt Lake, Kolkata, West Bengal 700091',
    phone: '+91 (033) 7890-1234',
    hours: 'Wed-Mon: 10AM-5PM',
    services: ['Drop-off', 'Data Secure Destruction', 'Environmental Reports'],
    coordinates: { lat: 22.5726, lng: 88.3639 },
  },
  {
    id: 7,
    name: 'Circular Pune',
    distance: 2.1,
    rating: 4.7,
    reviews: 423,
    address: '567 Tech Lane, Hinjawadi, Pune, Maharashtra 411057',
    phone: '+91 (020) 2890-3456',
    hours: 'Mon-Sat: 8AM-7PM',
    services: ['Drop-off', 'Scheduled Pickup', 'Refurbishment Services'],
    coordinates: { lat: 18.5904, lng: 73.8129 },
  },
  {
    id: 8,
    name: 'EcoWaste Jaipur',
    distance: 3.5,
    rating: 4.6,
    reviews: 267,
    address: '321 Green Boulevard, Industrial Area, Jaipur, Rajasthan 302013',
    phone: '+91 (141) 4567-8901',
    hours: 'Tue-Sun: 9AM-6PM',
    services: ['Drop-off', 'Free Assessment', 'Data Destruction'],
    coordinates: { lat: 26.9124, lng: 75.7873 },
  },
  {
    id: 9,
    name: 'Green Ahmedabad Hub',
    distance: 1.9,
    rating: 4.8,
    reviews: 356,
    address: '234 Eco Park, GIDC Vatva, Ahmedabad, Gujarat 382445',
    phone: '+91 (079) 6789-2345',
    hours: 'Mon-Fri: 8AM-7PM',
    services: ['Drop-off', 'Bulk Pickup', 'Certified Recycling'],
    coordinates: { lat: 23.0225, lng: 72.5714 },
  },
  {
    id: 10,
    name: 'TechCycle Lucknow',
    distance: 4.2,
    rating: 4.5,
    reviews: 198,
    address: '890 Industrial Zone, Kanpur Road, Lucknow, Uttar Pradesh 226004',
    phone: '+91 (522) 1234-5678',
    hours: 'Mon-Sat: 9AM-6PM',
    services: ['Drop-off', 'Repair Program', 'Community Programs'],
    coordinates: { lat: 26.8467, lng: 80.9462 },
  },
  {
    id: 11,
    name: 'Sustainable Kochi',
    distance: 2.8,
    rating: 4.6,
    reviews: 245,
    address: '456 Tech Street, Infopark, Kochi, Kerala 682042',
    phone: '+91 (484) 3456-7890',
    hours: 'Tue-Sun: 10AM-7PM',
    services: ['Drop-off', 'Refurbishment Services', 'Data Destruction'],
    coordinates: { lat: 9.9312, lng: 76.2673 },
  },
  {
    id: 12,
    name: 'Green Surat',
    distance: 3.7,
    rating: 4.7,
    reviews: 312,
    address: '678 Industrial Circle, GIDC Piplaj, Surat, Gujarat 395007',
    phone: '+91 (261) 5678-9012',
    hours: 'Mon-Fri: 9AM-8PM',
    services: ['Drop-off', 'Bulk Pickup', 'Free Assessment'],
    coordinates: { lat: 21.1458, lng: 72.8336 },
  },
  {
    id: 13,
    name: 'EcoCircle Indore',
    distance: 3.3,
    rating: 4.7,
    reviews: 301,
    address: '890 Industrial Road, EPIP Zone, Indore, Madhya Pradesh 452010',
    phone: '+91 (731) 4567-8901',
    hours: 'Mon-Sat: 8AM-7PM',
    services: ['Drop-off', 'Scheduled Pickup', 'Bulk Business Accounts'],
    coordinates: { lat: 22.7196, lng: 75.8577 },
  },
  {
    id: 14,
    name: 'Green Bhopal Center',
    distance: 4.8,
    rating: 4.6,
    reviews: 234,
    address: '123 Eco Lane, BHEL Nagar, Bhopal, Madhya Pradesh 462022',
    phone: '+91 (755) 5678-9012',
    hours: 'Tue-Sun: 9AM-6PM',
    services: ['Drop-off', 'Free Assessment', 'Repair Program'],
    coordinates: { lat: 23.1815, lng: 79.9864 },
  },
  {
    id: 15,
    name: 'TechWaste Raipur',
    distance: 2.9,
    rating: 4.5,
    reviews: 189,
    address: '567 Green Street, Durg Road, Raipur, Chhattisgarh 492001',
    phone: '+91 (771) 3456-7890',
    hours: 'Mon-Fri: 8AM-7PM',
    services: ['Drop-off', 'Data Destruction', 'Community Programs'],
    coordinates: { lat: 21.2514, lng: 81.6296 },
  },
  {
    id: 16,
    name: 'Sustainable Jamshedpur',
    distance: 3.4,
    rating: 4.6,
    reviews: 267,
    address: '234 Industrial Complex, Mango (South), Jamshedpur, Jharkhand 831003',
    phone: '+91 (657) 6789-0123',
    hours: 'Mon-Sat: 9AM-6PM',
    services: ['Drop-off', 'Bulk Pickup', 'Refurbishment Services'],
    coordinates: { lat: 22.8047, lng: 84.3330 },
  },
  {
    id: 17,
    name: 'Green Ranchi Hub',
    distance: 4.1,
    rating: 4.7,
    reviews: 298,
    address: '890 Tech Lane, Hehal, Ranchi, Jharkhand 834004',
    phone: '+91 (651) 2345-6789',
    hours: 'Tue-Sun: 10AM-7PM',
    services: ['Drop-off', 'Scheduled Pickup', 'Data Destruction'],
    coordinates: { lat: 23.3645, lng: 85.3340 },
  },
];

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
