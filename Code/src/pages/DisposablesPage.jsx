import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { products, productCategories } from '../data/products';

export default function DisposablesPage({ isLoggedIn }) {
  const [wishlist, setWishlist] = useState(new Set());
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const filteredProducts = filter === 'All'
    ? products
    : products.filter(item => item.category === filter);

  const toggleWishlist = (id) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(id)) {
      newWishlist.delete(id);
    } else {
      newWishlist.add(id);
    }
    setWishlist(newWishlist);
  };

  const handleBuy = (product) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    addToCart(product);
    navigate('/checkout');
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
      className={`min-h-screen pt-20 pb-12 bg-gray-900`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 text-white`}>
            💚 Available Disposables
          </h1>
          <p className={`text-lg text-gray-400`}>
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
          {productCategories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setFilter(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full font-semibold transition-all ${
                filter === category
                  ? 'bg-eco-500 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProducts.map((product, index) => {
            const Icon = product.icon;
            const isWishlisted = wishlist.has(product.id);

            return (
              <motion.div
                key={product.id}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div
                  className={`h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all bg-gray-800 border border-gray-700`}
                >
                  {/* Icon Background */}
                  <div className={`h-40 bg-gradient-to-br ${product.color} flex items-center justify-center relative overflow-hidden`}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-90 z-0"
                      />
                    ) : null}

                    {!product.image && (
                      <Icon className="w-16 h-16 text-white opacity-80 relative z-10" />
                    )}

                    {/* Stock Badge */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold text-gray-900 z-20">
                      {product.stock} left
                    </div>

                    {/* Wishlist Button */}
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors z-20"
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
                    <h3 className={`font-bold text-lg mb-1 line-clamp-2 text-white`}>
                      {product.name}
                    </h3>

                    {/* Category */}
                    <p className={`text-sm mb-4 text-gray-400`}>
                      {product.category}
                    </p>

                    {/* Price and Button */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-2xl font-bold text-eco-500">{product.price}</span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleBuy(product)}
                        className="flex-1 bg-gradient-eco text-white font-semibold py-2 px-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={18} />
                        <span className="hidden sm:inline">{isLoggedIn ? 'Buy' : 'Login to Buy'}</span>
                      </motion.button>
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
            <p className={`text-lg text-gray-400`}>
              No products found in this category
            </p>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}
