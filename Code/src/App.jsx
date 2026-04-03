import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ChatBot from './components/ChatBot';
import { CartProvider } from './context/CartContext';

// Pages
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
  const [darkMode] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState('success');
  const navigate = useNavigate();

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

  const handleSearchClick = () => {
    navigate('/device-search');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white transition-colors duration-300 dark">
      <Navbar darkMode={true} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

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
          <Route path="/checkout" element={<CheckoutPage darkMode={darkMode} isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<LoginPage darkMode={darkMode} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/checkout" element={isLoggedIn ? <CheckoutPage darkMode={darkMode} /> : <LoginPage darkMode={darkMode} setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
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

