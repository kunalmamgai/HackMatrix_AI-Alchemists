import { motion } from 'framer-motion';
import { Smartphone, Laptop, Battery, Headphones, TabletSmartphone, Monitor, ShoppingCart, Heart, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const DISPOSABLES = [
  {
    id: 1,
    name: 'iPhone 12',
    category: 'Smartphone',
    price: '₹350',
    icon: Smartphone,
    color: 'from-blue-400 to-blue-600',
    condition: 'Good',
    stock: 5,
  },
  {
    id: 2,
    name: 'MacBook Pro 2020',
    category: 'Laptop',
    price: '₹9,600',
    icon: Laptop,
    color: 'from-gray-400 to-gray-600',
    condition: 'Excellent',
    stock: 2,
  },
  {
    id: 3,
    name: 'Used Battery Pack',
    category: 'Battery',
    price: '₹75',
    icon: Battery,
    color: 'from-yellow-400 to-yellow-600',
    condition: 'Good',
    stock: 12,
  },
  {
    id: 4,
    name: 'Sony Headphones',
    category: 'Headphones',
    price: '₹940',
    icon: Headphones,
    color: 'from-purple-400 to-purple-600',
    condition: 'Like New',
    stock: 8,
  },
  {
    id: 5,
    name: 'iPad Air 2022',
    category: 'Tablet',
    price: '₹950',
    icon: TabletSmartphone,
    color: 'from-pink-400 to-pink-600',
    condition: 'Good',
    stock: 3,
  },
  {
    id: 6,
    name: 'Dell Monitor 4K',
    category: 'Monitor',
    price: '₹2,240',
    icon: Monitor,
    color: 'from-green-400 to-green-600',
    condition: 'Very Good',
    stock: 1,
  },
  {
    id: 7,
    name: 'Samsung Phone',
    category: 'Smartphone',
    price: '₹560',
    icon: Smartphone,
    color: 'from-blue-500 to-cyan-500',
    condition: 'Good',
    stock: 6,
  },
  {
    id: 8,
    name: 'HP Laptop',
    category: 'Laptop',
    price: '₹4,800',
    icon: Laptop,
    color: 'from-indigo-400 to-indigo-600',
    condition: 'Fair',
    stock: 4,
  },
  {
    id: 9,
    name: 'AirPods Max',
    category: 'Headphones',
    price: '₹,260',
    icon: Headphones,
    color: 'from-red-400 to-rose-600',
    condition: 'Excellent',
    stock: 2,
  },
  {
    id: 10,
    name: 'Google Pixel 6',
    category: 'Smartphone',
    price: '₹540',
    icon: Smartphone,
    color: 'from-orange-400 to-amber-600',
    condition: 'Very Good',
    stock: 7,
  },
  {
    id: 11,
    name: 'LG 27" Monitor',
    category: 'Monitor',
    price: '₹1,600',
    icon: Monitor,
    color: 'from-teal-400 to-teal-600',
    condition: 'Good',
    stock: 3,
  },
  {
    id: 12,
    name: 'Lenovo ThinkPad',
    category: 'Laptop',
    price: '₹2,250',
    icon: Laptop,
    color: 'from-slate-400 to-slate-600',
    condition: 'Like New',
    stock: 1,
  },
];

const CUSTOM_DISPOSABLES_KEY = 'customDisposables';

const iconByCategory = {
  Smartphone,
  Laptop,
  Battery,
  Headphones,
  Tablet: TabletSmartphone,
  Monitor,
};

const getCategoryIcon = (category) => iconByCategory[category] || Smartphone;

export default function DisposablesPage({ darkMode }) {
  const [wishlist, setWishlist] = useState(new Set());
  const [filter, setFilter] = useState('All');
  const [customDisposables, setCustomDisposables] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(CUSTOM_DISPOSABLES_KEY) || '[]');
    setCustomDisposables(Array.isArray(stored) ? stored : []);
  }, []);

  const allDisposables = [
    ...customDisposables.map((item) => ({
      ...item,
      icon: getCategoryIcon(item.category),
      color: item.color || 'from-eco-500 to-ocean-500',
      stock: Number(item.stock) || 1,
      condition: item.condition || 'Good',
      isCustom: true,
    })),
    ...DISPOSABLES,
  ];

  const categories = ['All', ...new Set(allDisposables.map((item) => item.category))];

  const filteredProducts = filter === 'All' 
    ? allDisposables 
    : allDisposables.filter(item => item.category === filter);

  const toggleWishlist = (id) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(id)) {
      newWishlist.delete(id);
    } else {
      newWishlist.add(id);
    }
    setWishlist(newWishlist);
  };

  const handleRemoveCustomDisposable = (id) => {
    const updated = customDisposables.filter((item) => item.id !== id);
    setCustomDisposables(updated);
    localStorage.setItem(CUSTOM_DISPOSABLES_KEY, JSON.stringify(updated));

    setWishlist((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

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
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen pt-20 pb-12 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-white to-gray-50'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            💚 Available Disposables
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Browse our collection of refurbished electronics at great prices
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex flex-wrap gap-2"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setFilter(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full font-semibold transition-all ${
                filter === category
                  ? 'bg-eco-500 text-white shadow-lg'
                  : darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product, index) => {
            const Icon = product.icon || getCategoryIcon(product.category);
            const isWishlisted = wishlist.has(product.id);

            return (
              <motion.div
                key={product.id}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div
                  className={`h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all ${
                    darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className={`h-40 relative overflow-hidden ${!product.image ? `bg-gradient-to-br ${product.color}` : ''}`}>
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Icon className="w-16 h-16 text-white opacity-80" />
                      </div>
                    )}

                    {/* Stock Badge */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
                      {product.stock} left
                    </div>

                    {/* Wishlist Button */}
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors"
                    >
                      <Heart
                        size={20}
                        className={isWishlisted ? 'fill-eco-500 text-eco-500' : 'text-gray-400'}
                      />
                    </motion.button>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Condition Badge */}
                    <motion.div className="mb-3 inline-block">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          product.condition === 'Excellent' || product.condition === 'Like New'
                            ? 'bg-green-100 text-green-700'
                            : product.condition === 'Very Good'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {product.condition}
                      </span>
                    </motion.div>

                    {/* Product Name */}
                    <h3 className={`font-bold text-lg mb-1 line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {product.name}
                    </h3>

                    {/* Category */}
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {product.category}
                    </p>

                    {/* Price and Button */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-2xl font-bold text-eco-500">{product.price}</span>
                      {product.isCustom ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRemoveCustomDisposable(product.id)}
                          className="flex-1 bg-red-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                        >
                          <Trash2 size={18} />
                          <span className="hidden sm:inline">Remove</span>
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 bg-gradient-eco text-white font-semibold py-2 px-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          <ShoppingCart size={18} />
                          <span className="hidden sm:inline">Buy</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No products found in this category
            </p>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}
