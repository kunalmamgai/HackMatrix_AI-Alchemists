import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Trash2, Plus } from 'lucide-react';
import { devices } from '../data/devices';
import DeviceImage from './DeviceImage';
import DeviceDetail from './DeviceDetail';
import SellModal from './SellModal';
import Breadcrumb from './Breadcrumb';

const CATEGORY_CHIPS = [
  { label: 'All', value: 'all' },
  { label: 'Recycle', value: 'Recycle' },
  { label: 'Hazardous', value: 'Hazardous' },
  { label: 'Reuse/Recycle', value: 'Reuse/Recycle' },
];
const POPULAR_SEARCHES = ['iPhone', 'Laptop', 'Battery', 'Printer', 'Camera', 'Console'];

const matchesKeyword = (device, query) => {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    device.name,
    device.category,
    device.disposal.type,
    ...(device.aliases || []),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(needle);
};

const badgeClasses = (type) => {
  if (type === 'Hazardous') return 'bg-danger-500 text-white';
  if (type === 'Reuse/Recycle') return 'bg-gold-100 text-gold-700';
  return 'bg-forest-100 text-forest-700';
};

export default function DeviceSearch({ initialQuery = '' }) {
  const [searchTerm, setSearchTerm] = useState(initialQuery || '');
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSlug = searchParams.get('device');
  const [selectedDevice, setSelectedDevice] = useState(() =>
    urlSlug ? devices.find((d) => d.slug === urlSlug) || null : null
  );
  const [prevSlug, setPrevSlug] = useState(urlSlug);
  if (prevSlug !== urlSlug) {
    setPrevSlug(urlSlug);
    setSelectedDevice(urlSlug ? devices.find((d) => d.slug === urlSlug) || null : null);
  }
  const [activeCategory, setActiveCategory] = useState('all');
  const [doneByDevice, setDoneByDevice] = useState({});
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  const syncDeviceParam = (slug) => {
    const next = new URLSearchParams(searchParams);
    if (slug) {
      next.set('device', slug);
    } else {
      next.delete('device');
    }
    setSearchParams(next, { replace: true });
  };

  const visibleDevices = useMemo(() => {
    return devices.filter(
      (device) =>
        matchesKeyword(device, searchTerm) &&
        (activeCategory === 'all' || device.disposal.type === activeCategory)
    );
  }, [searchTerm, activeCategory]);

  const handleDeviceSelect = (device) => {
    setSelectedDevice(device);
    syncDeviceParam(device.slug);
  };

  const handleBackToSearch = () => {
    setSelectedDevice(null);
    syncDeviceParam(null);
  };

  const activeDoneSteps = selectedDevice ? (doneByDevice[selectedDevice.id] || new Set()) : new Set();

  const toggleStep = (index) => {
    if (!selectedDevice) return;
    setDoneByDevice((prev) => {
      const next = new Set(prev[selectedDevice.id] || []);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return { ...prev, [selectedDevice.id]: next };
    });
  };

  const resetSteps = () => {
    if (!selectedDevice) return;
    setDoneByDevice((prev) => ({ ...prev, [selectedDevice.id]: new Set() }));
  };

  return (
    <section id="device-search" className="py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Device Guide', href: '/device-search' },
            ...(selectedDevice ? [{ label: selectedDevice.name }] : []),
          ].filter((item) => item.label !== 'Home')}
        />
        <div className="rounded-3xl p-8 md:p-16 mb-12 mt-4 text-center shadow-xl bg-sage-100/80 border border-sage-200 relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <h1 className="text-h1 text-ink-900 mb-6 tracking-tight">
              Device <span className="text-forest-500">Disposal Guide</span>
            </h1>
            <p className="text-lg md:text-xl text-ink-700 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Search your device to unlock tailored disposal steps, crucial safety tips, and maximum recycling value.
            </p>
          </motion.div>

          <motion.div
            className="relative max-w-3xl mx-auto z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-ink-500 group-focus-within:text-forest-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search device (e.g., iPhone, Laptop, Battery)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-16 pr-14 py-5 border border-sage-300 rounded-2xl leading-5 bg-white text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-forest-500/50 focus:border-forest-500 transition-all text-lg shadow-inner"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-ink-400 hover:text-ink-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </motion.div>

          <motion.div
            className="relative z-10 mt-6 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-sm font-semibold text-ink-500">Popular:</span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setSearchTerm(term)}
                className="px-3 py-1.5 rounded-full text-sm font-medium bg-white border border-sage-300 text-forest-700 hover:bg-forest-50 hover:border-forest-400 transition-colors"
              >
                {term}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsSellModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-forest-500 text-white hover:bg-forest-600 transition-colors shadow-soft"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              Sell a device
            </button>
          </motion.div>
        </div>

        {/* Search Results */}
        <AnimatePresence mode="wait">
          {selectedDevice ? (
            <DeviceDetail
              key="details"
              device={selectedDevice}
              doneSteps={activeDoneSteps}
              onToggleStep={toggleStep}
              onResetSteps={resetSteps}
              onSelectDevice={handleDeviceSelect}
              onBack={handleBackToSearch}
            />
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Category filter chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                {CATEGORY_CHIPS.map((chip) => (
                  <button
                    key={chip.value}
                    type="button"
                    onClick={() => setActiveCategory(chip.value)}
                    aria-pressed={activeCategory === chip.value}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${
                      activeCategory === chip.value
                        ? 'bg-forest-500 border-forest-500 text-white shadow-soft'
                        : 'bg-white border-sage-300 text-ink-600 hover:border-forest-400 hover:text-forest-600'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {visibleDevices.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleDevices.map((device, index) => (
                    <motion.button
                      key={device.id}
                      type="button"
                      onClick={() => handleDeviceSelect(device)}
                      className="card-interactive group bg-sage-100 hover:bg-sage-200 text-left"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="mb-4 overflow-hidden rounded-xl">
                        <DeviceImage
                          src={device.image}
                          alt={device.name}
                          icon={device.icon}
                          className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="text-lg font-bold mb-1 text-ink-900">
                        {device.name}
                      </h3>
                      <p className="text-sm mb-3 text-ink-500">
                        {device.category}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badgeClasses(device.disposal.type)}`}
                        >
                          {device.disposal.type}
                        </span>
                        <span className="text-sm font-semibold text-forest-600">
                          ₹{device.recoveryValue.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Trash2 className="w-16 h-16 mx-auto mb-4 text-ink-500" />
                  <p className="text-lg text-ink-500 mb-4">
                    No devices found for "{searchTerm}".
                  </p>
                  <p className="text-sm text-ink-400 mb-6">
                    Try: phone, laptop, battery, printer, camera, console, speaker, cable.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="btn-secondary"
                  >
                    Show all devices
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sell modal */}
      <SellModal isOpen={isSellModalOpen} onClose={() => setIsSellModalOpen(false)} />
    </section>
  );
}
