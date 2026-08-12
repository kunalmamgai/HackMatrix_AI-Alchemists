import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, RotateCcw, X, Trash } from 'lucide-react';
import { devices } from '../data/devices';

const CUSTOM_DISPOSABLES_KEY = 'customDisposables';

export default function DeviceSearch({ initialQuery = '' }) {
  const [searchTerm, setSearchTerm] = useState(initialQuery || '');
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

    const filtered = devices.filter(device =>
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
      className={`py-20 bg-white`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`rounded-[2rem] p-8 md:p-16 mb-12 mt-4 text-center shadow-xl bg-sage-100/80 border border-sage-200 relative overflow-hidden`}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-ink-900 mb-6 tracking-tight">
              Device <span className="text-eco-500">Disposal Guide</span>
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
                <Search className="h-6 w-6 text-ink-500 group-focus-within:text-eco-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search device (e.g., iPhone, Laptop, Battery)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-16 pr-6 py-5 border border-sage-300 rounded-2xl leading-5 bg-white text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-eco-500/50 focus:border-eco-500 transition-all text-lg shadow-inner"
              />
            </div>
          </motion.div>
        </div>

        {selectedDevice && (
          <motion.div
            className={`mb-12 card bg-sage-100`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
          <h3 className={`text-2xl font-bold mb-2 text-ink-900`}>
            Add Device To Disposables
          </h3>
          <p className={`mb-6 text-ink-500`}>
            Add product information and upload an image. It will appear in the Disposables tab.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Device Name"
              value={newDisposable.name}
              onChange={(e) => handleNewDisposableChange('name', e.target.value)}
              className={`px-4 py-3 rounded-lg border bg-sage-200 border-sage-300 text-ink-900`}
            />

            <input
              type="number"
              min="1"
              placeholder="Price in Rupees (e.g. 12000)"
              value={newDisposable.price}
              onChange={(e) => handleNewDisposableChange('price', e.target.value)}
              className={`px-4 py-3 rounded-lg border bg-sage-200 border-sage-300 text-ink-900`}
            />

            <select
              value={newDisposable.category}
              onChange={(e) => handleNewDisposableChange('category', e.target.value)}
              className={`px-4 py-3 rounded-lg border bg-sage-200 border-sage-300 text-ink-900`}
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
              className={`px-4 py-3 rounded-lg border bg-sage-200 border-sage-300 text-ink-900`}
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
              className={`px-4 py-3 rounded-lg border bg-sage-200 border-sage-300 text-ink-900`}
            />

            <div>
              <motion.button
                type="button"
                onClick={() => addFileInputRef.current?.click()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 rounded-lg border-2 border-dashed font-semibold transition-colors border-eco-500 text-eco-600 hover:bg-sage-200`}
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
                className={`flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-colors text-eco-600 hover:bg-sage-100`}
              >
                <X size={18} />
                <span>Back to search</span>
              </button>

              {/* Disposal Steps */}
              <motion.div
                className={`mt-8 card bg-sage-100`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center space-x-2 mb-6">
                  <RotateCcw className="w-5 h-5 text-eco-500 flex-shrink-0" />
                  <h4 className={`text-xl font-bold text-ink-900`}>Step-by-Step Disposal Guide</h4>
                </div>
                <div className="space-y-4">
                  {selectedDevice.disposal.steps.map((step, index) => (
                    <motion.div
                      key={index}
                      className={`flex gap-4 p-4 rounded-lg bg-sage-200`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-eco flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className={`flex-1 pt-0.5 text-ink-700`}>
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
                    className={`card-interactive group bg-sage-100 hover:bg-sage-200`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`mb-4 overflow-hidden rounded-xl bg-sage-200`}>
                      <img
                        src={deviceImages[device.id] || device.image}
                        alt={device.name}
                        className="h-36 w-full object-cover"
                      />
                    </div>
                    <h3 className={`text-lg font-bold mb-1 text-ink-900`}>
                      {device.name}
                    </h3>
                    <p className={`text-sm mb-3 text-ink-500`}>
                      {device.category}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      device.disposal.type === 'Hazardous'
                        ? 'bg-red-100 text-red-700'
                        : device.disposal.type === 'Reuse/Recycle'
                        ? 'bg-gold-100 text-gold-700'
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
                  <Trash2 className={`w-16 h-16 mx-auto mb-4 text-ink-500`} />
                  <p className={`text-lg text-ink-500`}>
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
              {devices.map((device, index) => (
                <motion.button
                  key={device.id}
                  onClick={() => handleDeviceSelect(device)}
                  className={`card-interactive group bg-sage-100 hover:bg-sage-200`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className={`mb-4 overflow-hidden rounded-xl bg-sage-200`}>
                    <img
                      src={deviceImages[device.id] || device.image}
                      alt={device.name}
                      className="h-36 w-full object-cover"
                    />
                  </div>
                  <h3 className={`text-lg font-bold mb-1 text-ink-900`}>
                    {device.name}
                  </h3>
                  <p className={`text-sm mb-3 text-ink-500`}>
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
