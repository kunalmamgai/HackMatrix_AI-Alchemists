import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Recycle, Loader2, Globe, RefreshCw } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { products as localProducts, productCategories } from '../data/products';
import { fetchDummyProducts, fetchFakeStoreProducts, searchDummyProducts, searchFakeStoreProducts, mergeProducts } from '../api/external';
import DeviceImage from '../components/DeviceImage';
import Breadcrumb from '../components/Breadcrumb';

export default function DisposablesPage() {
  const { isLoggedIn } = useAuth();
  const [wishlist, setWishlist] = useState(new Set());
  const [filter, setFilter] = useState('All');
  const [allProducts, setAllProducts] = useState(localProducts);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState('local');
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Fetch products from external APIs
  // Fetch electronics products from external APIs
  const loadLiveProducts = useCallback(async () => {
    setLoading(true);
    try {
      const [dummyProducts, fakeStoreProducts] = await Promise.allSettled([
        fetchDummyProducts(8),
        fetchFakeStoreProducts(),
      ]);

      const external = [
        ...(dummyProducts.status === 'fulfilled' ? dummyProducts.value : []),
        ...(fakeStoreProducts.status === 'fulfilled' ? fakeStoreProducts.value : []),
      ];

      if (external.length > 0) {
        const merged = mergeProducts(localProducts, external);
        setAllProducts(merged);
        setDataSource('mixed');
      } else {
        setAllProducts(localProducts);
        setDataSource('local');
      }
    } catch (err) {
      console.error('[PRODUCTS]', err.message);
      setAllProducts(localProducts);
      setDataSource('local');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLiveProducts();
  }, [loadLiveProducts]);

  // Build categories from merged product list
  const allCategories = ['All', ...new Set(allProducts.map((p) => p.category))];

  const filteredProducts = filter === 'All' ? allProducts : allProducts.filter((item) => item.category === filter);

  const toggleWishlist = (id) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(id)) newWishlist.delete(id);
    else newWishlist.add(id);
    setWishlist(newWishlist);
  };

  const handleBuy = (product) => {
    if (!isLoggedIn) { navigate('/login'); return; }
    addToCart(product);
    navigate('/checkout');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Format price from paise to display string
  const formatPrice = (price) => {
    if (typeof price === 'string') return price;
    return `₹${(price / 100).toLocaleString('en-IN')}`;
  };

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="min-h-screen pt-20 pb-12 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Disposables' }].filter((i) => i.label !== 'Home')} />

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-ink-900 flex items-center gap-3">
            <Recycle className="w-10 h-10 text-forest-500" />
            Available Disposables
          </h1>
          <p className="text-lg text-ink-500">
            Browse our collection of refurbished electronics at great prices
          </p>
          {/* Data source indicator */}
          <div className="flex items-center gap-2 mt-3">
            {loading ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-forest-600">
                <Loader2 size={14} className="animate-spin" /> Loading products from external APIs...
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-500">
                <Globe size={14} className={dataSource === 'mixed' ? 'text-forest-500' : 'text-ink-400'} />
                {dataSource === 'mixed'
                  ? `Showing ${allProducts.length} products (local + DummyJSON + FakeStore)`
                  : `${allProducts.length} local products`}
              </span>
            )}
            <button onClick={loadLiveProducts} disabled={loading} className="text-xs text-forest-500 hover:text-forest-700 underline disabled:opacity-50">
              <RefreshCw size={12} className="inline mr-1" /> Refresh
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8 flex flex-wrap gap-2">
          {allCategories.map((category) => (
            <motion.button key={category} onClick={() => setFilter(category)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`px-4 py-2 rounded-full font-semibold transition-all ${filter === category ? 'bg-forest-500 text-white shadow-lg' : 'bg-white text-ink-700 hover:bg-sage-100'}`}>
              {category}
            </motion.button>
          ))}
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const Icon = product.icon;
            const isWishlisted = wishlist.has(product.id);

            return (
              <motion.div key={product.id} variants={itemVariants} whileHover={{ y: -8, transition: { duration: 0.3 } }}>
                <div className="h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all bg-white border border-sage-200">
                  <div className={`h-40 bg-gradient-to-br ${product.color || 'from-forest-400 to-forest-600'} flex items-center justify-center relative overflow-hidden`}>
                    {product.image ? (
                      <DeviceImage src={product.image} alt={product.name} icon={Icon} className="absolute inset-0 w-full h-full object-cover opacity-90 z-0" iconClassName="w-16 h-16 text-white opacity-80" />
                    ) : Icon ? (
                      <Icon className="w-16 h-16 text-white opacity-80 relative z-10" />
                    ) : null}
                    <div className="absolute top-3 right-3 bg-sage-100/90 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold text-ink-900 z-20">
                      {product.stock || 5} left
                    </div>
                    <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => toggleWishlist(product.id)} className="absolute top-3 left-3 p-2 bg-sage-100/90 backdrop-blur rounded-full hover:bg-white transition-colors z-20">
                      <Heart size={20} className={isWishlisted ? 'fill-forest-500 text-forest-500' : 'text-ink-500'} />
                    </motion.button>
                    {product.source && product.source !== 'local' && (
                      <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-forest-600/80 text-[10px] text-white font-medium z-20">LIVE DATA</div>
                    )}
                  </div>

                  <div className="p-5">
                    <motion.div className="mb-3 inline-block">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${product.condition === 'Excellent' ? 'bg-success-100 text-success-600' : product.condition === 'Good' ? 'bg-info-100 text-info-600' : 'bg-gold-100 text-gold-700'}`}>
                        {product.condition}
                      </span>
                    </motion.div>
                    <h3 className="font-bold text-lg mb-1 line-clamp-2 text-ink-900">{product.name}</h3>
                    <p className="text-sm mb-4 text-ink-500">{product.category}</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-2xl font-bold text-forest-500">{formatPrice(product.price)}</span>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleBuy(product)} className="flex-1 bg-gradient-forest text-white font-semibold py-2 px-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
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

        {filteredProducts.length === 0 && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <p className="text-lg text-ink-500">No products found in this category</p>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}
