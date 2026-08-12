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
const DisposablesPage = lazy(() => import('./pages/DisposablesPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));

import './index.css';

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-eco-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function AppContent() {
  const [darkMode] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState('success');

  useEffect(() => {
    localStorage.setItem('darkMode', 'true');
    document.documentElement.classList.add('dark');
  }, []);

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
    <div className="min-h-screen bg-gray-900 text-white transition-colors duration-300 dark">
      <Navbar darkMode={true} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home darkMode={darkMode} />} />
            <Route path="/device-search" element={<DeviceSearchPage darkMode={darkMode} />} />
            <Route path="/nearby-locations" element={<NearbyLocationsPage darkMode={darkMode} />} />
            <Route path="/pickup-network" element={<PickupNetworkPage darkMode={darkMode} onNotification={handleNotification} />} />
            <Route path="/circular-economy" element={<CircularEconomyPage darkMode={darkMode} />} />
            <Route path="/disposables" element={<DisposablesPage darkMode={darkMode} isLoggedIn={isLoggedIn} />} />
            <Route path="/checkout" element={<CheckoutPage darkMode={darkMode} isLoggedIn={isLoggedIn} />} />
            <Route path="/login" element={<LoginPage darkMode={darkMode} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/checkout" element={isLoggedIn ? <CheckoutPage darkMode={darkMode} /> : <LoginPage darkMode={darkMode} setIsLoggedIn={setIsLoggedIn} />} />
          </Routes>
        </Suspense>
      </motion.div>

      <Footer darkMode={darkMode} />

      <ChatBot darkMode={darkMode} />

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

