import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import DeviceSearchPage from './pages/DeviceSearchPage';
import NearbyLocationsPage from './pages/NearbyLocationsPage';
import PickupNetworkPage from './pages/PickupNetworkPage';
import CircularEconomyPage from './pages/CircularEconomyPage';
import DisposablesPage from './pages/DisposablesPage';
import LoginPage from './pages/LoginPage';
import CheckoutPage from './pages/CheckoutPage';

import './index.css';

function AppContent() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState('success');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

  const handleSearchClick = () => {
    navigate('/device-search');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} onSearchClick={handleSearchClick} />} />
          <Route path="/device-search" element={<DeviceSearchPage darkMode={darkMode} />} />
          <Route path="/nearby-locations" element={<NearbyLocationsPage darkMode={darkMode} />} />
          <Route path="/pickup-network" element={<PickupNetworkPage darkMode={darkMode} onNotification={handleNotification} />} />
          <Route path="/circular-economy" element={<CircularEconomyPage darkMode={darkMode} />} />
          <Route path="/disposables" element={<DisposablesPage darkMode={darkMode} isLoggedIn={isLoggedIn} />} />
          <Route path="/checkout" element={<CheckoutPage darkMode={darkMode} />} />
          <Route path="/login" element={<LoginPage darkMode={darkMode} setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
      </motion.div>

      <Footer darkMode={darkMode} />

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

