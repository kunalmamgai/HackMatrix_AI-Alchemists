import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Trash2,
  RotateCcw,
  TriangleAlert,
  ShieldAlert,
  Coins,
  Leaf,
  Cpu,
  CheckCircle2,
  Plus,
  Printer,
} from 'lucide-react';
import { devices } from '../data/devices';
import DeviceImage from './DeviceImage';

const CUSTOM_DISPOSABLES_KEY = 'customDisposables';
const CATEGORY_CHIPS = [
  { label: 'All', value: 'all' },
  { label: 'Recycle', value: 'Recycle' },
  { label: 'Hazardous', value: 'Hazardous' },
  { label: 'Reuse/Recycle', value: 'Reuse/Recycle' },
];
const POPULAR_SEARCHES = ['iPhone', 'Laptop', 'Battery', 'iPad'];

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

export default function DeviceSearch({ initialQuery = '' }) {
  const [searchTerm, setSearchTerm] = useState(initialQuery || '');
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSlug = searchParams.get('device');
  const [selectedDevice, setSelectedDevice] = useState(() =>
    urlSlug ? devices.find((d) => d.slug === urlSlug) || null : null
  );
  // Keep selection in sync with the ?device= URL param (deep links, back/forward).
  // Adjust state during render — React's recommended pattern for syncing state
  // to a prop/param, which avoids cascading renders from effects.
  const [prevSlug, setPrevSlug] = useState(urlSlug);
  if (prevSlug !== urlSlug) {
    setPrevSlug(urlSlug);
    setSelectedDevice(urlSlug ? devices.find((d) => d.slug === urlSlug) || null : null);
  }
  const [activeCategory, setActiveCategory] = useState('all');
  // Per-device checklist progress, keyed by device id so progress survives
  // switching between devices during a session (no reset effect needed).
  const [doneByDevice, setDoneByDevice] = useState({});
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const navigate = useNavigate();
  const addFileInputRef = useRef(null);

  const [newDisposable, setNewDisposable] = useState({
    name: '',
    category: 'Smartphone',
    price: '',
    condition: 'Good',
    stock: '1',
  });
  const [newDisposableImage, setNewDisposableImage] = useState('');
  const [addStatus, setAddStatus] = useState('');

  // Close the sell modal on Escape.
  useEffect(() => {
    if (!isSellModalOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setIsSellModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSellModalOpen]);

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

  const activeDoneSteps = doneByDevice[selectedDevice?.id] || new Set();

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

  const relatedDevices = selectedDevice
    ? devices
        .filter(
          (d) =>
            d.id !== selectedDevice.id &&
            (d.disposal.type === selectedDevice.disposal.type ||
              d.category === selectedDevice.category)
        )
        .slice(0, 3)
    : [];

  const formatInrPrice = (value) => {
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount <= 0) {
      return '';
    }

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleNewDisposableChange = (field, value) => {
    setNewDisposable((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewDisposableImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (typeof base64 === 'string') {
        setNewDisposableImage(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveNewDisposableImage = () => {
    setNewDisposableImage('');
    if (addFileInputRef.current) {
      addFileInputRef.current.value = '';
    }
  };

  const handleAddDisposable = () => {
    if (!newDisposable.name.trim() || !newDisposable.price) {
      setAddStatus('Please provide at least a device name and price.');
      return;
    }

    const formattedPrice = formatInrPrice(newDisposable.price);
    if (!formattedPrice) {
      setAddStatus('Please enter a valid price in rupees.');
      return;
    }

    const nextItem = {
      id: Date.now(),
      name: newDisposable.name.trim(),
      category: newDisposable.category,
      price: formattedPrice,
      condition: newDisposable.condition,
      stock: Math.max(1, Number(newDisposable.stock) || 1),
      image: newDisposableImage,
      color: 'from-forest-500 to-gold-500',
    };

    const existing = JSON.parse(localStorage.getItem(CUSTOM_DISPOSABLES_KEY) || '[]');
    localStorage.setItem(CUSTOM_DISPOSABLES_KEY, JSON.stringify([nextItem, ...existing]));

    setNewDisposable({
      name: '',
      category: 'Smartphone',
      price: '',
      condition: 'Good',
      stock: '1',
    });
    setNewDisposableImage('');
    if (addFileInputRef.current) {
      addFileInputRef.current.value = '';
    }
    setAddStatus('Device added to Disposables tab successfully.');
  };

  const badgeClasses = (type) => {
    if (type === 'Hazardous') return 'bg-danger-500 text-white';
    if (type === 'Reuse/Recycle') return 'bg-gold-100 text-gold-700';
    return 'bg-forest-100 text-forest-700';
  };

  const steps = selectedDevice?.disposal.steps || [];
  const progress =
    steps.length > 0 ? Math.round((activeDoneSteps.size / steps.length) * 100) : 0;
  const allDone = steps.length > 0 && activeDoneSteps.size === steps.length;

  return (
    <section id="device-search" className="py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-5xl mx-auto"
            >
              <button
                onClick={handleBackToSearch}
                className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-colors text-forest-600 hover:bg-sage-100"
              >
                <X size={18} />
                <span>Back to search</span>
              </button>

              {/* Device hero */}
              <motion.div
                className="card bg-sage-100 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <DeviceImage
                  src={selectedDevice.image}
                  alt={selectedDevice.name}
                  icon={selectedDevice.icon}
                  className="h-56 md:h-72 w-full object-cover"
                  iconClassName="w-16 h-16 text-white/90"
                />
                <div className="p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-h2 text-ink-900">
                      {selectedDevice.name}
                    </h2>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badgeClasses(selectedDevice.disposal.type)}`}
                    >
                      {selectedDevice.disposal.type}
                    </span>
                  </div>
                  <p className="text-body text-ink-500 mb-0">
                    {selectedDevice.category}
                  </p>
                </div>
              </motion.div>

              {/* Value band — recovery value, carbon, materials */}
              <div className="grid sm:grid-cols-3 gap-4 mt-6">
                <motion.div
                  className="card bg-sage-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <Coins className="w-6 h-6 text-gold-600 mb-2" aria-hidden="true" />
                  <p className="text-sm text-ink-500 mb-1">Recovery value</p>
                  <p className="text-stat text-forest-600">
                    ₹{selectedDevice.recoveryValue.toLocaleString('en-IN')}
                  </p>
                </motion.div>
                <motion.div
                  className="card bg-sage-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                >
                  <Leaf className="w-6 h-6 text-forest-500 mb-2" aria-hidden="true" />
                  <p className="text-sm text-ink-500 mb-1">CO₂ avoided</p>
                  <p className="text-stat text-ink-900">
                    {selectedDevice.carbonSaved}
                    <span className="text-h3 font-semibold text-ink-400"> kg</span>
                  </p>
                </motion.div>
                <motion.div
                  className="card bg-sage-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <Cpu className="w-6 h-6 text-forest-500 mb-2" aria-hidden="true" />
                  <p className="text-sm text-ink-500 mb-1">What's recovered</p>
                  <p className="text-sm font-medium text-ink-700 leading-relaxed">
                    {selectedDevice.disposal.value}
                  </p>
                </motion.div>
              </div>

              {/* Interactive disposal checklist */}
              <motion.div
                className="card bg-sage-100 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div className="flex items-center space-x-2">
                    <RotateCcw className="w-5 h-5 text-forest-500 flex-shrink-0" />
                    <h3 className="text-h3 text-ink-900">Step-by-Step Disposal Guide</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    {allDone && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest-500 text-white">
                        <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                        Ready for pickup
                      </span>
                    )}
                    {activeDoneSteps.size > 0 && (
                      <button
                        type="button"
                        onClick={resetSteps}
                        className="text-xs font-semibold text-ink-500 hover:text-forest-600 transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs font-semibold text-ink-500 mb-1.5">
                    <span>
                      {activeDoneSteps.size} of {steps.length} steps complete
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-sage-200 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-forest"
                      initial={false}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {steps.map((step, index) => {
                    const isDone = activeDoneSteps.has(index);
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => toggleStep(index)}
                        aria-pressed={isDone}
                        className={`w-full flex gap-4 items-start p-4 rounded-lg text-left transition-all border ${
                          isDone
                            ? 'bg-forest-500/10 border-forest-400/40'
                            : 'bg-sage-200 border-transparent hover:border-forest-400/40'
                        }`}
                      >
                        <span
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-colors ${
                            isDone ? 'bg-forest-500' : 'bg-gradient-forest'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                          ) : (
                            index + 1
                          )}
                        </span>
                        <span
                          className={`flex-1 pt-1 text-ink-700 ${
                            isDone ? 'line-through opacity-60' : ''
                          }`}
                        >
                          {step}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Safety & Hazard Severity — unmistakable at a glance */}
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {selectedDevice.disposal.type === 'Hazardous' ? (
                  <div className="rounded-2xl border-2 border-danger-500 bg-danger-50 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <TriangleAlert className="w-6 h-6 text-danger-500 flex-shrink-0" />
                      <h4 className="text-xl font-bold text-danger-700">
                        Highly Hazardous — Handle with Care
                      </h4>
                    </div>
                    <ul className="space-y-3">
                      {selectedDevice.disposal.safety?.map((tip, index) => (
                        <li key={index} className="flex gap-3 text-danger-800">
                          <span className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-danger-500" />
                          <span className="text-body">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="rounded-2xl border-2 border-warning-300 bg-warning-100/60 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <ShieldAlert className="w-6 h-6 text-warning-600 flex-shrink-0" />
                      <h4 className="text-xl font-bold text-ink-900">
                        Safety Tips
                      </h4>
                    </div>
                    <ul className="space-y-3">
                      {selectedDevice.disposal.safety?.map((tip, index) => (
                        <li key={index} className="flex gap-3 text-ink-700">
                          <span className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-warning-500" />
                          <span className="text-body">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>

              {/* Related devices */}
              {relatedDevices.length > 0 && (
                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                >
                  <h3 className="text-h3 text-ink-900 mb-4">
                    Similar devices to recycle
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {relatedDevices.map((device) => (
                      <button
                        key={device.id}
                        type="button"
                        onClick={() => handleDeviceSelect(device)}
                        className="card-interactive bg-sage-100 hover:bg-sage-200 text-left p-3"
                      >
                        <DeviceImage
                          src={device.image}
                          alt={device.name}
                          icon={device.icon}
                          className="h-24 w-full object-cover rounded-lg"
                          iconClassName="w-7 h-7 text-white/80"
                        />
                        <div className="flex items-center justify-between mt-3 px-1">
                          <span className="font-semibold text-sm text-ink-900">
                            {device.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${badgeClasses(device.disposal.type)}`}
                          >
                            {device.disposal.type}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                className="mt-8 flex flex-wrap gap-4 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <button onClick={() => navigate('/nearby-locations')} className="btn-primary flex-1 min-w-[180px]">
                  Find Recycling Centers
                </button>
                <button onClick={() => navigate('/pickup-network')} className="btn-secondary flex-1 min-w-[180px]">
                  Schedule Pickup
                </button>
                <button
                  onClick={() => window.print()}
                  className="btn-outline flex-1 min-w-[140px] inline-flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" aria-hidden="true" />
                  Print guide
                </button>
              </motion.div>
            </motion.div>
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
                    Try one of these: phone, laptop, battery, tablet, headphones, monitor.
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

      {/* Sell a device modal — keeps the marketplace flow separate from the guide */}
      <AnimatePresence>
        {isSellModalOpen && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Add a device to the Disposables marketplace"
          >
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsSellModalOpen(false)}
            />
            <motion.div
              className="relative w-full max-w-2xl mx-auto my-8 sm:my-16 px-4"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.25 }}
            >
              <div className="card bg-white shadow-2xl p-6 md:p-8">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-h2 text-ink-900 mb-1">
                      Add Device To Disposables
                    </h3>
                    <p className="text-ink-500 text-sm mb-6">
                      Add product information and upload an image. It will appear in the Disposables tab.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSellModalOpen(false)}
                    aria-label="Close"
                    className="p-2 rounded-full text-ink-400 hover:text-ink-700 hover:bg-sage-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Device Name"
                    value={newDisposable.name}
                    onChange={(e) => handleNewDisposableChange('name', e.target.value)}
                    className="px-4 py-3 rounded-lg border bg-sage-100 border-sage-300 text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-500/50 focus:border-forest-500"
                  />

                  <input
                    type="number"
                    min="1"
                    placeholder="Price in Rupees (e.g. 12000)"
                    value={newDisposable.price}
                    onChange={(e) => handleNewDisposableChange('price', e.target.value)}
                    className="px-4 py-3 rounded-lg border bg-sage-100 border-sage-300 text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-500/50 focus:border-forest-500"
                  />

                  <select
                    value={newDisposable.category}
                    onChange={(e) => handleNewDisposableChange('category', e.target.value)}
                    className="px-4 py-3 rounded-lg border bg-sage-100 border-sage-300 text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-500/50 focus:border-forest-500"
                  >
                    <option value="Smartphone">Smartphone</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Battery">Battery</option>
                    <option value="Headphones">Headphones</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Monitor">Monitor</option>
                  </select>

                  <select
                    value={newDisposable.condition}
                    onChange={(e) => handleNewDisposableChange('condition', e.target.value)}
                    className="px-4 py-3 rounded-lg border bg-sage-100 border-sage-300 text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-500/50 focus:border-forest-500"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Like New">Like New</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>

                  <input
                    type="number"
                    min="1"
                    placeholder="Stock"
                    value={newDisposable.stock}
                    onChange={(e) => handleNewDisposableChange('stock', e.target.value)}
                    className="px-4 py-3 rounded-lg border bg-sage-100 border-sage-300 text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-500/50 focus:border-forest-500"
                  />

                  <div>
                    <motion.button
                      type="button"
                      onClick={() => addFileInputRef.current?.click()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-lg border-2 border-dashed font-semibold transition-colors border-forest-500 text-forest-600 hover:bg-sage-100"
                    >
                      {newDisposableImage ? 'Change Uploaded Image' : 'Upload Product Image'}
                    </motion.button>
                    <input
                      ref={addFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleNewDisposableImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {newDisposableImage && (
                  <div className="mt-4 relative rounded-lg overflow-hidden max-w-xs">
                    <img src={newDisposableImage} alt="New disposable" className="w-full h-40 object-cover" />
                    <button
                      type="button"
                      onClick={handleRemoveNewDisposableImage}
                      className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full hover:bg-black/85 transition-colors"
                      aria-label="Remove uploaded image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <button onClick={handleAddDisposable} className="btn-primary">
                    Add To Disposables
                  </button>
                  {addStatus && (
                    <p
                      className={`text-sm ${
                        addStatus.includes('successfully') ? 'text-forest-500' : 'text-danger-500'
                      }`}
                    >
                      {addStatus}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
