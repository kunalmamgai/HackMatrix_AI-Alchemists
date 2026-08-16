import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Recycle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';

export default function DisposablesBar() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative w-full px-4 py-6 bg-sage-100/50 border-b border-sage-200 backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-bold text-ink-900 flex items-center gap-2`}>
            <Recycle className="w-5 h-5 text-forest-500" />
            Available Disposables
          </h3>
          <button
            onClick={() => navigate('/disposables')}
            className={`text-sm font-semibold transition-colors text-forest-600 hover:text-forest-500`}
          >
            View All →
          </button>
        </div>

        <div className="relative group">
          {/* Left Scroll Button */}
          {canScrollLeft && (
            <motion.button
              onClick={() => scroll('left')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full backdrop-blur-md bg-cream-50/80 hover:bg-white transition-colors`}
            >
              <ChevronLeft className={'text-ink-900'} size={24} />
            </motion.button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none' }}
          >
            <div className="flex gap-4 pb-2">
              {products.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="flex-shrink-0"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    onClick={() => navigate('/disposables')}
                    className={`w-48 p-4 rounded-xl cursor-pointer transition-all bg-sage-100/50 border border-sage-200`}
                  >
                    {/* Image or Icon */}
                    {item.image ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden mb-3">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}
                      >
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                    )}

                    {/* Product Info */}
                    <h4 className={`font-semibold text-sm mb-1 text-ink-900`}>
                      {item.name}
                    </h4>
                    <p className={`text-xs mb-2 text-ink-500`}>
                      {item.category}
                    </p>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-forest-500">{item.price}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/disposables');
                        }}
                        className="px-2 py-1 text-xs rounded bg-forest-500 text-white hover:bg-forest-600 transition-colors"
                      >
                        View
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Scroll Button */}
          {canScrollRight && (
            <motion.button
              onClick={() => scroll('right')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full backdrop-blur-md bg-cream-50/80 hover:bg-white transition-colors`}
            >
              <ChevronRight className={'text-ink-900'} size={24} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.div>
  );
}
