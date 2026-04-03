import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Smartphone, Laptop, Battery, Headphones, TabletSmartphone, Monitor } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const DISPOSABLES = [
  {
    id: 1,
    name: 'iPhone 12',
    category: 'Smartphone',
    price: '$450',
    icon: Smartphone,
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 2,
    name: 'MacBook Pro 2020',
    category: 'Laptop',
    price: '$1,200',
    icon: Laptop,
    color: 'from-gray-400 to-gray-600',
  },
  {
    id: 3,
    name: 'Used Battery Pack',
    category: 'Battery',
    price: '$25',
    icon: Battery,
    color: 'from-yellow-400 to-yellow-600',
  },
  {
    id: 4,
    name: 'Sony Headphones',
    category: 'Headphones',
    price: '$180',
    icon: Headphones,
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 5,
    name: 'iPad Air 2022',
    category: 'Tablet',
    price: '$350',
    icon: TabletSmartphone,
    color: 'from-pink-400 to-pink-600',
  },
  {
    id: 6,
    name: 'Dell Monitor 4K',
    category: 'Monitor',
    price: '$280',
    icon: Monitor,
    color: 'from-green-400 to-green-600',
  },
  {
    id: 7,
    name: 'Samsung Phone',
    category: 'Smartphone',
    price: '$320',
    icon: Smartphone,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 8,
    name: 'HP Laptop',
    category: 'Laptop',
    price: '$600',
    icon: Laptop,
    color: 'from-indigo-400 to-indigo-600',
  },
];

export default function DisposablesBar({ darkMode }) {
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
      className={`relative w-full px-4 py-6 ${
        darkMode ? 'bg-gray-800/50 border-b border-gray-700' : 'bg-white/50 border-b border-gray-200'
      } backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto">
        <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          💚 Available Disposables
        </h3>

        <div className="relative group">
          {/* Left Scroll Button */}
          {canScrollLeft && (
            <motion.button
              onClick={() => scroll('left')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full backdrop-blur-md ${
                darkMode ? 'bg-gray-900/80 hover:bg-gray-800' : 'bg-white/80 hover:bg-white'
              } transition-colors`}
            >
              <ChevronLeft className={darkMode ? 'text-white' : 'text-gray-900'} size={24} />
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
              {DISPOSABLES.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="flex-shrink-0"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      className={`w-48 p-4 rounded-xl cursor-pointer transition-all ${
                        darkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-white border border-gray-300'
                      }`}
                    >
                      {/* Icon Background */}
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Product Info */}
                      <h4 className={`font-semibold text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.name}
                      </h4>
                      <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.category}
                      </p>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-eco-500">{item.price}</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-2 py-1 text-xs rounded bg-eco-500 text-white hover:bg-eco-600 transition-colors"
                        >
                          View
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Scroll Button */}
          {canScrollRight && (
            <motion.button
              onClick={() => scroll('right')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full backdrop-blur-md ${
                darkMode ? 'bg-gray-900/80 hover:bg-gray-800' : 'bg-white/80 hover:bg-white'
              } transition-colors`}
            >
              <ChevronRight className={darkMode ? 'text-white' : 'text-gray-900'} size={24} />
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
