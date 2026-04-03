import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle, Zap, Smartphone, Battery, Laptop, Headphones, TabletSmartphone, Trash2, RotateCcw, X } from 'lucide-react';

const DEVICE_DATABASE = [
  {
    id: 1,
    name: 'Smartphone',
    icon: Smartphone,
    category: 'Electronics',
    disposal: {
      type: 'Recycle',
      steps: [
        'Back up all data (Settings → Cloud Backup)',
        'Remove SIM card and memory card',
        'Factory reset the device (Settings → Reset)',
        'Remove battery if possible',
        'Take to certified e-waste recycler',
      ],
      safety: [
        'Li-ion batteries can be hazardous - handle carefully',
        'Do not throw in regular trash - batteries are toxic',
        'Avoid direct sunlight during transport',
      ],
      value: 'Contains valuable materials: copper, gold, rare metals',
    },
  },
  {
    id: 2,
    name: 'Laptop',
    icon: Laptop,
    category: 'Electronics',
    disposal: {
      type: 'Recycle',
      steps: [
        'Securely erase hard drive using DBAN or macOS erase',
        'Remove battery (usually detachable)',
        'Disconnect all peripherals',
        'Pack in protective case',
        'Drop off at recycling center or schedule pickup',
      ],
      safety: [
        'Lithium batteries require special handling',
        'Do not disassemble - leave to professionals',
        'LCD screens contain mercury - fragile!',
      ],
      value: 'High-value aluminum, copper, and rare earth elements',
    },
  },
  {
    id: 3,
    name: 'Battery',
    icon: Battery,
    category: 'Hazardous',
    disposal: {
      type: 'Hazardous',
      steps: [
        'Collect in non-metal container',
        'Keep away from moisture and heat',
        'Store in cool, dry place',
        'Take to hazmat recycling facility or electronics store',
        'Never attempt to recharge damaged batteries',
      ],
      safety: [
        '⚠️ HIGHLY HAZARDOUS - Risk of fire and explosion',
        'Never dispose in regular trash',
        'Tape terminals to prevent short circuit',
        'Keep away from children and pets',
      ],
      value: 'Recyclable lithium and cobalt materials',
    },
  },
  {
    id: 4,
    name: 'Tablet',
    icon: TabletSmartphone,
    category: 'Electronics',
    disposal: {
      type: 'Recycle',
      steps: [
        'Update to latest software',
        'Sign out from all accounts',
        'Perform factory reset',
        'Remove protective case/screen',
        'Transport in padded case to recycler',
      ],
      safety: [
        'Glass screens are fragile - wrap carefully',
        'Battery disposal is critical part of recycling',
        'Contains gold and other valuable metals',
      ],
      value: 'Reusable condition: Consider donation or repair centers',
    },
  },
  {
    id: 5,
    name: 'Headphones',
    icon: Headphones,
    category: 'Electronics',
    disposal: {
      type: 'Reuse/Recycle',
      steps: [
        'Test functionality before disposal',
        'Clean with dry cloth',
        'If broken: remove batteries if applicable',
        'Check local e-waste recyclers',
        'Or donate to thrift stores if working',
      ],
      safety: [
        'Most headphones contain small batteries',
        'Wireless models: charge before recycling',
        'No hazardous materials typically present',
      ],
      value: 'Often reusable - consider donation first!',
    },
  },
  {
    id: 6,
    name: 'Monitor',
    icon: Zap,
    category: 'Electronics',
    disposal: {
      type: 'Recycle',
      steps: [
        'Unplug from power source',
        'Disconnect all cables carefully',
        'Store in upright position (avoid pressure on screen)',
        'Schedule bulk e-waste pickup or visit recycler',
        'Many retailers offer take-back programs',
      ],
      safety: [
        'LED/LCD panels are fragile - handle with care',
        'Older monitors may contain lead in glass',
        'CRT monitors require specialized handling',
      ],
      value: 'Contains aluminum frame and copper wiring',
    },
  },
];

export default function DeviceSearch({ darkMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDevices([]);
      return;
    }

    const filtered = DEVICE_DATABASE.filter(device =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDevices(filtered);
  }, [searchTerm]);

  const handleDeviceSelect = (device) => {
    setSelectedDevice(device);
    addRecentSearch(device.name);
  };

  const addRecentSearch = (deviceName) => {
    const updated = [deviceName, ...recentSearches.filter(s => s !== deviceName)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleRecentSearch = (device) => {
    setSearchTerm(device);
    const found = DEVICE_DATABASE.find(d => d.name.toLowerCase() === device.toLowerCase());
    if (found) handleDeviceSelect(found);
  };

  return (
    <section
      id="device-search"
      className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title mb-4">Device Disposal Guide</h2>
          <p className="section-subtitle">
            Search for your device to get personalized disposal instructions and safety tips
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="mb-8 relative max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search device (e.g., iPhone, Laptop, Battery)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-eco-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
            />
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && searchTerm === '' && (
            <motion.div
              className={`absolute top-full left-0 right-0 mt-2 p-4 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} shadow-lg z-20`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className={`text-xs font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Recent Searches</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearch(search)}
                    className="text-sm px-3 py-1 rounded-lg bg-eco-100 text-eco-700 hover:bg-eco-200 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Search Results */}
        <AnimatePresence mode="wait">
          {selectedDevice ? (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-4xl mx-auto"
            >
              <button
                onClick={() => setSelectedDevice(null)}
                className={`flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-eco-400 hover:bg-gray-700' : 'text-eco-600 hover:bg-eco-50'}`}
              >
                <X size={18} />
                <span>Back to search</span>
              </button>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Device Info Card */}
                <motion.div
                  className={`card ${darkMode ? 'bg-gray-700' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-eco">
                      <selectedDevice.icon className="w-8 h-8 text-white" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedDevice.disposal.type === 'Hazardous'
                        ? 'bg-red-100 text-red-700'
                        : selectedDevice.disposal.type === 'Reuse/Recycle'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-eco-100 text-eco-700'
                    }`}>
                      {selectedDevice.disposal.type}
                    </span>
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedDevice.name}
                  </h3>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Category: {selectedDevice.category}
                  </p>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-eco-50'}`}>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-eco-300' : 'text-eco-700'}`}>
                      💰 {selectedDevice.disposal.value}
                    </p>
                  </div>
                </motion.div>

                {/* Safety Tips */}
                <motion.div
                  className={`card ${darkMode ? 'bg-gray-700' : ''}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Safety Tips</h4>
                  </div>
                  <ul className="space-y-2">
                    {selectedDevice.disposal.safety.map((tip, index) => (
                      <motion.li
                        key={index}
                        className={`text-sm flex items-start space-x-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                        <span>{tip}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Disposal Steps */}
              <motion.div
                className={`mt-8 card ${darkMode ? 'bg-gray-700' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center space-x-2 mb-6">
                  <RotateCcw className="w-5 h-5 text-eco-500 flex-shrink-0" />
                  <h4 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Step-by-Step Disposal Guide</h4>
                </div>
                <div className="space-y-4">
                  {selectedDevice.disposal.steps.map((step, index) => (
                    <motion.div
                      key={index}
                      className={`flex gap-4 p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-50'}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-eco flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className={`flex-1 pt-0.5 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                        {step}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="mt-8 flex gap-4 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <button className="btn-primary flex-1">Find Recycling Centers</button>
                <button className="btn-secondary flex-1">Schedule Pickup</button>
              </motion.div>
            </motion.div>
          ) : searchTerm ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredDevices.length > 0 ? (
                filteredDevices.map((device, index) => (
                  <motion.button
                    key={device.id}
                    onClick={() => handleDeviceSelect(device)}
                    className={`card-interactive group ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="p-4 rounded-xl bg-gradient-eco/10 group-hover:bg-gradient-eco/20 transition-colors mb-4">
                      <device.icon className="w-8 h-8 text-eco-600" />
                    </div>
                    <h3 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {device.name}
                    </h3>
                    <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {device.category}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      device.disposal.type === 'Hazardous'
                        ? 'bg-red-100 text-red-700'
                        : device.disposal.type === 'Reuse/Recycle'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-eco-100 text-eco-700'
                    }`}>
                      {device.disposal.type}
                    </span>
                  </motion.button>
                ))
              ) : (
                <motion.div
                  className="col-span-full text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Trash2 className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No devices found. Try searching for "phone", "laptop", or "battery".
                  </p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {DEVICE_DATABASE.map((device, index) => (
                <motion.button
                  key={device.id}
                  onClick={() => handleDeviceSelect(device)}
                  className={`card-interactive group ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="p-4 rounded-xl bg-gradient-eco/10 group-hover:bg-gradient-eco/20 transition-colors mb-4">
                    <device.icon className="w-8 h-8 text-eco-600" />
                  </div>
                  <h3 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {device.name}
                  </h3>
                  <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {device.category}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    device.disposal.type === 'Hazardous'
                      ? 'bg-red-100 text-red-700'
                      : device.disposal.type === 'Reuse/Recycle'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-eco-100 text-eco-700'
                  }`}>
                    {device.disposal.type}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
