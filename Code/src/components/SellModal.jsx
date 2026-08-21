import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const CUSTOM_DISPOSABLES_KEY = 'customDisposables';

const formatInrPrice = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function SellModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    name: '',
    category: 'Smartphone',
    price: '',
    condition: 'Good',
    stock: '1',
  });
  const [image, setImage] = useState('');
  const [status, setStatus] = useState('');
  const fileRef = useRef(null);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  // Focus trap + initial focus
  useEffect(() => {
    if (!isOpen) return undefined;
    // Focus the close button on open
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      // Focus trap
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (typeof base64 === 'string') setImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.price) {
      setStatus('Please provide at least a device name and price.');
      return;
    }
    const formattedPrice = formatInrPrice(form.price);
    if (!formattedPrice) {
      setStatus('Please enter a valid price in rupees.');
      return;
    }

    const nextItem = {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
      price: formattedPrice,
      condition: form.condition,
      stock: Math.max(1, Number(form.stock) || 1),
      image,
      color: 'from-forest-500 to-gold-500',
    };

    const existing = JSON.parse(localStorage.getItem(CUSTOM_DISPOSABLES_KEY) || '[]');
    localStorage.setItem(CUSTOM_DISPOSABLES_KEY, JSON.stringify([nextItem, ...existing]));

    setForm({ name: '', category: 'Smartphone', price: '', condition: 'Good', stock: '1' });
    setImage('');
    if (fileRef.current) fileRef.current.value = '';
    setStatus('Device added to Disposables tab successfully.');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Add a device to the Disposables marketplace"
      >
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          ref={dialogRef}
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
                ref={closeRef}
                type="button"
                onClick={onClose}
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
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="px-4 py-3 rounded-lg border bg-sage-100 border-sage-300 text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-500/50 focus:border-forest-500"
              />

              <input
                type="number"
                min="1"
                placeholder="Price in Rupees (e.g. 12000)"
                value={form.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="px-4 py-3 rounded-lg border bg-sage-100 border-sage-300 text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-500/50 focus:border-forest-500"
              />

              <select
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="px-4 py-3 rounded-lg border bg-sage-100 border-sage-300 text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-500/50 focus:border-forest-500"
              >
                <option value="Smartphone">Smartphone</option>
                <option value="Laptop">Laptop</option>
                <option value="Tablet">Tablet</option>
                <option value="Monitor">Monitor</option>
                <option value="Smartwatch">Smartwatch</option>
                <option value="Camera">Camera</option>
                <option value="Printer">Printer</option>
                <option value="Keyboard">Keyboard</option>
                <option value="Mouse">Mouse</option>
                <option value="Speaker">Speaker</option>
                <option value="Game Console">Game Console</option>
                <option value="Desktop">Desktop</option>
                <option value="Headphones">Headphones</option>
                <option value="Cables & Chargers">Cables & Chargers</option>
                <option value="Projector">Projector</option>
                <option value="Battery">Battery</option>
              </select>

              <select
                value={form.condition}
                onChange={(e) => handleChange('condition', e.target.value)}
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
                value={form.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                className="px-4 py-3 rounded-lg border bg-sage-100 border-sage-300 text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-500/50 focus:border-forest-500"
              />

              <div>
                <motion.button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-lg border-2 border-dashed font-semibold transition-colors border-forest-500 text-forest-600 hover:bg-sage-100"
                >
                  {image ? 'Change Uploaded Image' : 'Upload Product Image'}
                </motion.button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {image && (
              <div className="mt-4 relative rounded-lg overflow-hidden max-w-xs">
                <img src={image} alt="New disposable" className="w-full h-40 object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full hover:bg-black/85 transition-colors"
                  aria-label="Remove uploaded image"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
              <button onClick={handleSubmit} className="btn-primary">
                Add To Disposables
              </button>
              {status && (
                <p
                  className={`text-sm ${
                    status.includes('successfully') ? 'text-forest-500' : 'text-danger-500'
                  }`}
                >
                  {status}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
