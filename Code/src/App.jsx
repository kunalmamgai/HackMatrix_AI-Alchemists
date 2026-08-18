import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ChatBot from './components/ChatBot';
import { CartProvider } from './context/CartContext';

// Pages
// Home stays eager for the fastest first paint; everything else is
// code-split so Leaflet and secondary pages only download when visited.
import Home from './pages/Home';
const DeviceSearchPage = lazy(() => import('./pages/DeviceSearchPage'));
const NearbyLocationsPage = lazy(() => import('./pages/NearbyLocationsPage'));
const PickupNetworkPage = lazy(() => import('./pages/PickupNetworkPage'));
const CircularEconomyPage = lazy(() => import('./pages/CircularEconomyPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const DisposablesPage = lazy(() => import('./pages/DisposablesPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));

import './index.css';

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-forest-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState('success');

  // The site is fully light-first (botanical palette) — no forced dark class.

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleNotification = (message, type = 'success') => {
    setNotification(message);
    setNotificationType(type);
  };

  return (
    <div className="min-h-screen bg-cream-50 text-ink-900 transition-colors duration-300">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/device-search" element={<DeviceSearchPage />} />
            <Route path="/nearby-locations" element={<NearbyLocationsPage />} />
            <Route path="/pickup-network" element={<PickupNetworkPage onNotification={handleNotification} />} />
            <Route path="/circular-economy" element={<CircularEconomyPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/disposables" element={<DisposablesPage isLoggedIn={isLoggedIn} />} />
            <Route path="/checkout" element={<CheckoutPage isLoggedIn={isLoggedIn} />} />
            <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          </Routes>
        </Suspense>
      </motion.div>

      <Footer />

      <ChatBot />

      <Toast
        message={notification}
        type={notificationType}
        onClose={() => setNotification(null)}
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;

