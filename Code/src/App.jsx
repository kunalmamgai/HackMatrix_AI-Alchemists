import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ChatBot from './components/ChatBot';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';

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
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

import './index.css';

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-forest-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function AppContent() {
  const { notification, notificationType, clear } = useNotification();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(clear, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, clear]);

  return (
    <div className="min-h-screen bg-cream-50 text-ink-900 transition-colors duration-300">
      {/* Skip to content — accessibility: keyboard users can jump past the navbar */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-forest-500 focus:text-white focus:outline-none focus:ring-2 focus:ring-forest-300"
      >
        Skip to main content
      </a>

      <Navbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <main id="main-content">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/device-search" element={<DeviceSearchPage />} />
              <Route path="/nearby-locations" element={<NearbyLocationsPage />} />
              <Route path="/pickup-network" element={<PickupNetworkPage />} />
              <Route path="/circular-economy" element={<CircularEconomyPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/disposables" element={<DisposablesPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
      </motion.div>

      <Footer />

      <ChatBot />

      <Toast
        message={notification}
        type={notificationType}
        onClose={clear}
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
