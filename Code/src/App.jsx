import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DeviceSearch from './components/DeviceSearch';
import NearbyLocations from './components/NearbyLocations';
import PickupNetwork from './components/PickupNetwork';
import CircularEconomy from './components/CircularEconomy';
import Footer from './components/Footer';
import Toast from './components/Toast';
import './index.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState('success');

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
    document.getElementById('device-search')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Hero onSearchClick={handleSearchClick} darkMode={darkMode} />
        <DeviceSearch darkMode={darkMode} />
        <NearbyLocations darkMode={darkMode} />
        <PickupNetwork darkMode={darkMode} onNotification={handleNotification} />
        <CircularEconomy darkMode={darkMode} />
      </motion.main>

      <Footer darkMode={darkMode} />

      <Toast
        message={notification}
        type={notificationType}
        onClose={() => setNotification(null)}
      />
    </div>
  );
}

export default App;
