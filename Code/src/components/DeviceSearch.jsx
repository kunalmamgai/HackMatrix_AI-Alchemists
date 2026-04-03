import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle, Zap, Smartphone, Battery, Laptop, Headphones, TabletSmartphone, Trash2, RotateCcw, X, Upload, Trash } from 'lucide-react';

const DEVICE_DATABASE = [
  {
    id: 1,
    name: 'Smartphone',
    icon: Smartphone,
    category: 'Electronics',
    image: 'https://5.imimg.com/data5/SELLER/Default/2024/10/459096182/RX/JQ/MT/233814724/mobile-phone-scrap.jpg',
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
    image: 'https://tiimg.tistatic.com/fp/2/008/585/lightweight-high-tensile-strength-waste-laptop-scrap-779.jpg',
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
    image:'https://media.istockphoto.com/id/2189249426/photo/stack-of-many-used-car-lead-batteries-for-recycling-in-a-hazardous-waste-facility.jpg?s=612x612&w=0&k=20&c=fc7OcWkM0DYHZUm7YkTBqffyKItwb46Di3eM942_Q-A=',
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
    image:'data:image/jpeg;base64,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',
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
    image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsV9bWcPHsslOdXpW5cHOEJbaNJLG-3XLVLg&s',
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
    image:'https://5.imimg.com/data5/SELLER/Default/2022/10/JG/XB/GJ/12177215/lcd-screen-waste-recycling-service.jpg',
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

const CUSTOM_DISPOSABLES_KEY = 'customDisposables';

export default function DeviceSearch({ darkMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const navigate = useNavigate();
  const [deviceImages, setDeviceImages] = useState(() => {
    const saved = localStorage.getItem('deviceImages');
    return saved ? JSON.parse(saved) : {};
  });
  const [newDisposable, setNewDisposable] = useState({
    name: '',
    category: 'Smartphone',
    price: '',
    condition: 'Good',
    stock: '1',
  });
  const [newDisposableImage, setNewDisposableImage] = useState('');
  const [addStatus, setAddStatus] = useState('');
  const fileInputRef = useRef(null);
  const addFileInputRef = useRef(null);

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
  };


  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && selectedDevice) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result;
        const updated = {
          ...deviceImages,
          [selectedDevice.id]: base64String,
        };
        setDeviceImages(updated);
        localStorage.setItem('deviceImages', JSON.stringify(updated));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    if (selectedDevice) {
      const updated = { ...deviceImages };
      delete updated[selectedDevice.id];
      setDeviceImages(updated);
      localStorage.setItem('deviceImages', JSON.stringify(updated));
    }
  };

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
      color: 'from-eco-500 to-ocean-500',
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
          <p className={`section-subtitle ${darkMode ? 'text-gray-400' : ''}`}>
            Search for your device to get personalized disposal instructions and safety tips
          </p>
        </motion.div>

        {selectedDevice && (
          <motion.div
            className={`mb-12 card ${darkMode ? 'bg-gray-700' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
          <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Add Device To Disposables
          </h3>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Add product information and upload an image. It will appear in the Disposables tab.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Device Name"
              value={newDisposable.name}
              onChange={(e) => handleNewDisposableChange('name', e.target.value)}
              className={`px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />

            <input
              type="number"
              min="1"
              placeholder="Price in Rupees (e.g. 12000)"
              value={newDisposable.price}
              onChange={(e) => handleNewDisposableChange('price', e.target.value)}
              className={`px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />

            <select
              value={newDisposable.category}
              onChange={(e) => handleNewDisposableChange('category', e.target.value)}
              className={`px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
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
              className={`px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
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
              className={`px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />

            <div>
              <motion.button
                type="button"
                onClick={() => addFileInputRef.current?.click()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 rounded-lg border-2 border-dashed font-semibold transition-colors ${
                  darkMode
                    ? 'border-eco-500 text-eco-300 hover:bg-gray-600'
                    : 'border-eco-500 text-eco-700 hover:bg-eco-50'
                }`}
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
                <p className={`text-sm ${addStatus.includes('successfully') ? 'text-eco-500' : 'text-red-500'}`}>
                  {addStatus}
                </p>
              )}
            </div>
          </motion.div>
        )}

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
                <button onClick={() => navigate('/nearby-locations')} className="btn-primary flex-1">Find Recycling Centers</button>
                <button onClick={() => navigate('/pickup-network')} className="btn-secondary flex-1">Schedule Pickup</button>
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
                    <div className={`mb-4 overflow-hidden rounded-xl ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                      <img
                        src={deviceImages[device.id] || device.image}
                        alt={device.name}
                        className="h-36 w-full object-cover"
                      />
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
                  <div className={`mb-4 overflow-hidden rounded-xl ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                    <img
                      src={deviceImages[device.id] || device.image}
                      alt={device.name}
                      className="h-36 w-full object-cover"
                    />
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
