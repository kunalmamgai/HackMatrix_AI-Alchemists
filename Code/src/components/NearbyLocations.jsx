import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone, Clock, Star, Filter, CheckCircle2, Loader2, Globe, RefreshCw } from 'lucide-react';
import MapComponent from './MapComponent';
import { centers as localCenters } from '../data/centers';
import { fetchRecyclingCenters } from '../api/external';
import 'leaflet/dist/leaflet.css';

export default function NearbyLocations() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [allCenters, setAllCenters] = useState(localCenters);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState('local'); // local | live | mixed
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lon: 77.2090 }); // Delhi default
  const detailsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedLocation) {
      if (detailsRef.current) {
        detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [selectedLocation]);

  // Fetch real recycling centers from Overpass API
  const loadLiveCenters = useCallback(async (lat, lon) => {
    setLoading(true);
    try {
      const liveCenters = await fetchRecyclingCenters(lat, lon, 50);
      if (liveCenters.length > 0) {
        // Transform Overpass data to match our component's expected format
        const transformed = liveCenters.map((c) => ({
          ...c,
          distance: calculateDistance(lat, lon, c.latitude, c.longitude),
          reviews: c.reviewCount,
          services: c.acceptedTypes.split(', '),
          hours: c.operatingHours,
          coordinates: { lat: c.latitude, lng: c.longitude },
          phone: c.phone || 'Contact via website',
        }));

        // Merge with local centers (local takes priority for curated ones)
        const merged = [...localCenters];
        const localNames = new Set(localCenters.map((l) => l.name.toLowerCase()));
        for (const tc of transformed) {
          if (!localNames.has(tc.name.toLowerCase())) {
            merged.push(tc);
          }
        }
        setAllCenters(merged);
        setDataSource('mixed');
      } else {
        setAllCenters(localCenters);
        setDataSource('local');
      }
    } catch (err) {
      console.error('[NEARBY]', err.message);
      setAllCenters(localCenters);
      setDataSource('local');
    } finally {
      setLoading(false);
    }
  }, []);

  // Try to get user's location on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setMapCenter({ lat: latitude, lon: longitude });
          loadLiveCenters(latitude, longitude);
        },
        () => {
          // Fallback to Delhi coordinates
          loadLiveCenters(28.6139, 77.2090);
        },
        { timeout: 5000 }
      );
    } else {
      loadLiveCenters(28.6139, 77.2090);
    }
  }, [loadLiveCenters]);

  const handleGetDirections = () => {
    if (!selectedLocation) return;
    const { coordinates, address } = selectedLocation;
    const dest = coordinates ? `${coordinates.lat},${coordinates.lng}` : encodeURIComponent(address || '');
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank');
  };

  const handleRequestPickup = () => {
    if (!selectedLocation) return;
    navigate('/pickup-network', { state: { locationId: selectedLocation.id } });
  };

  const [sortBy, setSortBy] = useState('distance');
  const [filterService, setFilterService] = useState('All');

  const allServices = ['All', 'Drop-off', 'Pickup', 'Refurbishment', 'Data Destruction'];

  const sortedLocations = [...allCenters].sort((a, b) => {
    switch (sortBy) {
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      case 'distance': return (a.distance || 999) - (b.distance || 999);
      case 'reviews': return (b.reviews || b.reviewCount || 0) - (a.reviews || a.reviewCount || 0);
      default: return 0;
    }
  });

  const filteredLocations = sortedLocations.filter((location) => {
    if (filterService === 'All') return true;
    const services = location.services || [];
    return services.some((s) => s.toLowerCase().includes(filterService.toLowerCase()));
  });

  return (
    <section id="locations" className="py-16 lg:py-24 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title mb-4 text-forest-600">Find Nearby Recycling Centers</h2>
          <p className="section-subtitle text-ink-500">
            Locate certified e-waste recycling centers near you with real-time data from OpenStreetMap
          </p>
          {/* Data source indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {loading ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-forest-600">
                <Loader2 size={14} className="animate-spin" /> Loading live centers...
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-500">
                <Globe size={14} className={dataSource === 'mixed' ? 'text-forest-500' : 'text-ink-400'} />
                {dataSource === 'mixed'
                  ? `Showing ${allCenters.length} centers (local + OpenStreetMap)`
                  : `${allCenters.length} local centers`}
              </span>
            )}
            <button
              onClick={() => loadLiveCenters(mapCenter.lat, mapCenter.lon)}
              disabled={loading}
              className="text-xs text-forest-500 hover:text-forest-700 underline disabled:opacity-50"
            >
              <RefreshCw size={12} className="inline mr-1" />
              Refresh live data
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            className="lg:col-span-2 rounded-2xl overflow-hidden shadow-xl bg-white"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative h-96 lg:h-full min-h-96">
              <MapComponent
                locations={filteredLocations}
                selectedLocation={selectedLocation}
                onSelectLocation={setSelectedLocation}
              />
            </div>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {selectedLocation && (
              <div className="rounded-2xl bg-forest-800 text-white p-5 shadow-lg">
                <h4 className="font-bold mb-1 text-white">{selectedLocation.name}</h4>
                <div className="text-xs text-forest-100/80 mb-3">
                  <span className="text-gold-400">★</span> {selectedLocation.rating?.toFixed(1)} ({selectedLocation.reviews || selectedLocation.reviewCount || 0}) · {selectedLocation.distance?.toFixed(1)} km
                  {selectedLocation.source && (
                    <span className="ml-2 px-1.5 py-0.5 rounded bg-white/20 text-[10px]">{selectedLocation.source}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={handleGetDirections} className="flex-1 text-xs font-semibold py-2 rounded-lg bg-gradient-forest text-white hover:shadow-glow transition-all">
                    <Navigation size={14} className="inline mr-1 -mt-0.5" /> Directions
                  </button>
                  <button onClick={handleRequestPickup} className="flex-1 text-xs font-semibold py-2 rounded-lg border border-white/40 text-white hover:bg-white/10 transition-all">
                    Pickup
                  </button>
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-white shadow-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Filter size={18} className="text-forest-500" />
                <h3 className="font-semibold text-ink-900">Filters</h3>
              </div>
              <div className="mb-4">
                <label className="text-xs font-semibold block mb-2 text-ink-500">Sort by</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm bg-sage-100 border-sage-200 text-ink-900">
                  <option value="distance">Distance</option>
                  <option value="rating">Rating</option>
                  <option value="reviews">Reviews</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold block mb-2 text-ink-500">Services</label>
                <div className="flex flex-wrap gap-2">
                  {allServices.map((service) => (
                    <button key={service} onClick={() => setFilterService(service)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filterService === service ? 'bg-forest-500 text-white' : 'bg-sage-100 text-ink-700 hover:bg-sage-200'}`}>
                      {service}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {filteredLocations.map((location, index) => (
                <motion.button
                  key={location.id}
                  onClick={() => setSelectedLocation(location)}
                  className={`w-full text-left overflow-hidden rounded-xl transition-all transform ${selectedLocation?.id === location.id ? 'bg-forest-600/20 border-2 border-forest-500 scale-105 shadow-lg' : 'bg-white hover:bg-sage-100 border border-sage-200'}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-ink-900">{location.name}</h4>
                      <div className="flex items-center gap-1">
                        {location.source && location.source !== 'local' && (
                          <span className="text-[10px] px-1 py-0.5 rounded bg-forest-100 text-forest-600 font-medium">LIVE</span>
                        )}
                        <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${selectedLocation?.id === location.id ? 'bg-forest-500 text-white' : 'bg-forest-100 text-forest-700'}`}>
                          {location.distance?.toFixed(1)} km
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < Math.floor(location.rating || 0) ? 'fill-gold-400 text-gold-400' : 'text-ink-700'} />
                      ))}
                      <span className="text-xs ml-1 text-ink-500">{location.rating?.toFixed(1)} ({location.reviews || location.reviewCount || 0})</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-ink-500">
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} />
                        <span className="truncate">{location.city || location.address || 'View on map'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span className="truncate">{location.hours || location.operatingHours || 'Hours N/A'}</span>
                      </div>
                    </div>
                    {location.acceptedTypes && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {location.acceptedTypes.split(', ').slice(0, 3).map((type) => (
                          <span key={type} className="text-[10px] px-1.5 py-0.5 rounded bg-sage-200 text-ink-600">{type}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {selectedLocation && (
          <motion.div ref={detailsRef} className="mt-8 rounded-2xl shadow-xl overflow-hidden bg-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-3xl font-bold mb-2 text-ink-900">{selectedLocation.name}</h3>
                {selectedLocation.description && <p className="text-sm text-ink-700">{selectedLocation.description}</p>}
                {selectedLocation.source && selectedLocation.source !== 'local' && (
                  <p className="text-xs text-ink-400 mt-1">Data sourced from {selectedLocation.source}</p>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-forest-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-ink-500 uppercase">Address</p>
                      <p className="text-ink-900">{selectedLocation.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-forest-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-ink-500 uppercase">Phone</p>
                      <a href={`tel:${selectedLocation.phone}`} className="hover:text-forest-500 transition-colors text-ink-900">{selectedLocation.phone}</a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-forest-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-ink-500 uppercase">Hours</p>
                      <p className="text-ink-900">{selectedLocation.hours || selectedLocation.operatingHours || 'Contact for hours'}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-ink-900">Services Offered</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(selectedLocation.services || selectedLocation.acceptedTypes?.split(', ') || []).map((service, index) => (
                      <motion.span key={index} className="px-3 py-2 rounded-lg bg-gradient-forest text-white text-sm font-medium inline-flex items-center gap-1.5" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}>
                        <CheckCircle2 size={16} />{service}
                      </motion.span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleGetDirections} className="btn-primary flex-1 flex items-center justify-center space-x-2"><Navigation size={18} /><span>Get Directions</span></button>
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

// Haversine distance in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}
