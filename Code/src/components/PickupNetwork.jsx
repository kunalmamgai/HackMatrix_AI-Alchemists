import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, User, Shield, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';

const DEVICE_TYPES = ['Smartphone', 'Laptop', 'Tablet', 'Monitor', 'Battery', 'Headphones', 'Other'];
const CONDITIONS = ['Like New', 'Good', 'Fair', 'Poor', 'For Parts'];

export default function PickupNetwork({ darkMode, onNotification }) {
  const [formData, setFormData] = useState({
    deviceType: '',
    condition: '',
    quantity: '1',
    address: '',
    name: '',
    phone: '',
    pickupType: 'recycler',
  });

  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (onNotification) {
      onNotification('Pickup scheduled successfully! ✅');
    }
    setTimeout(() => {
      setFormData({
        deviceType: '',
        condition: '',
        quantity: '1',
        address: '',
        name: '',
        phone: '',
        pickupType: 'recycler',
      });
      setSubmitted(false);
      setCurrentStep(1);
    }, 3000);
  };

  const isStepComplete = (step) => {
    switch (step) {
      case 1:
        return formData.deviceType && formData.condition && formData.quantity;
      case 2:
        return formData.pickupType;
      case 3:
        return formData.name && formData.phone && formData.address;
      default:
        return false;
    }
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
    <section
      id="pickup"
      className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title mb-4">Pickup & Reuse Network</h2>
          <p className="section-subtitle">
            Schedule a convenient pickup for your used devices and connect with verified recyclers or repair enthusiasts
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Recycler Card */}
          <motion.div
            className={`rounded-2xl p-8 transition-all cursor-pointer transform ${
              formData.pickupType === 'recycler'
                ? darkMode
                  ? 'bg-gradient-eco/20 border-2 border-eco-500 scale-105 shadow-lg'
                  : 'bg-eco-50 border-2 border-eco-500 scale-105 shadow-lg'
                : darkMode
                ? 'bg-gray-700 border-2 border-gray-600 hover:border-eco-400'
                : 'bg-gray-50 border-2 border-gray-200 hover:border-eco-400'
            }`}
            onClick={() => setFormData({ ...formData, pickupType: 'recycler' })}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="p-4 rounded-xl bg-gradient-eco w-fit mb-4">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Verified Recycler
            </h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Professional certified e-waste recycling facility with government certifications
            </p>
            <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-eco-500 flex-shrink-0" />
                <span>Certified & insured</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-eco-500 flex-shrink-0" />
                <span>Data destruction guarantee</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-eco-500 flex-shrink-0" />
                <span>Eco-friendly processes</span>
              </li>
            </ul>
          </motion.div>

          {/* Repair Enthusiast Card */}
          <motion.div
            className={`rounded-2xl p-8 transition-all cursor-pointer transform ${
              formData.pickupType === 'repairer'
                ? darkMode
                ? 'bg-gradient-eco/20 border-2 border-eco-500 scale-105 shadow-lg'
                : 'bg-eco-50 border-2 border-eco-500 scale-105 shadow-lg'
                : darkMode
                ? 'bg-gray-700 border-2 border-gray-600 hover:border-eco-400'
                : 'bg-gray-50 border-2 border-gray-200 hover:border-eco-400'
            }`}
            onClick={() => setFormData({ ...formData, pickupType: 'repairer' })}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="p-4 rounded-xl bg-gradient-eco w-fit mb-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Repair Enthusiast
            </h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Community members skilled in repair and refurbishment of used electronics
            </p>
            <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-eco-500 flex-shrink-0" />
                <span>Expert community members</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-eco-500 flex-shrink-0" />
                <span>Give devices new life</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-eco-500 flex-shrink-0" />
                <span>Fair pricing & transparency</span>
              </li>
            </ul>
          </motion.div>

          {/* Trust & Safety Card */}
          <motion.div
            className={`rounded-2xl p-8 ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-eco-50 to-ocean-50'} border-2 border-eco-300`}
            variants={itemVariants}
          >
            <div className="p-4 rounded-xl bg-eco-500 w-fit mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Trust & Safety
            </h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              All partners are verified with ratings, reviews, and security certifications
            </p>
            <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-eco-500 flex-shrink-0" />
                <span>Verified members only</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-eco-500 flex-shrink-0" />
                <span>Real reviews & ratings</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-eco-500 flex-shrink-0" />
                <span>24/7 support available</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Pickup Form */}
        <motion.div
          className={`max-w-2xl mx-auto ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-2xl shadow-xl p-8 border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {submitted ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-5xl mb-4">✅</div>
              <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Pickup Scheduled!
              </h3>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                We've received your request. A {formData.pickupType === 'recycler' ? 'certified recycler' : 'repair enthusiast'} will contact you soon.
              </p>
              <p className={`text-sm mt-4 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Confirmation email sent to your phone number
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step Indicator */}
              <div className="flex justify-between mb-8">
                {[1, 2, 3].map((step) => (
                  <motion.button
                    key={step}
                    type="button"
                    onClick={() => setCurrentStep(step)}
                    disabled={!isStepComplete(step - 1) && step > 1}
                    className={`flex flex-col items-center ${
                      step <= currentStep
                        ? 'opacity-100 cursor-pointer'
                        : step > currentStep
                        ? 'opacity-40 cursor-not-allowed'
                        : 'opacity-60'
                    }`}
                  >
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                        step <= currentStep
                          ? 'bg-eco-500 text-white'
                          : darkMode
                          ? 'bg-gray-600 text-gray-300'
                          : 'bg-gray-300 text-gray-500'
                      }`}
                      whileHover={step <= currentStep ? { scale: 1.1 } : {}}
                    >
                      {step}
                    </motion.div>
                    <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {step === 1 ? 'Device' : step === 2 ? 'Partner' : 'Details'}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Progress Bar */}
              <div className={`h-1 rounded-full overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                <motion.div
                  className="h-full bg-gradient-eco"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / 3) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="space-y-6">
                {/* Step 1: Device Info */}
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        What device are you disposing?
                      </h3>

                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Device Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {DEVICE_TYPES.map((type) => (
                            <motion.button
                              key={type}
                              type="button"
                              onClick={() => setFormData({ ...formData, deviceType: type })}
                              className={`p-3 rounded-lg transition-all ${
                                formData.deviceType === type
                                  ? 'bg-eco-500 text-white border-2 border-eco-600'
                                  : darkMode
                                  ? 'bg-gray-600 text-gray-300 border-2 border-gray-600 hover:border-eco-400'
                                  : 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:border-eco-400'
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {type}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Device Condition
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {CONDITIONS.map((condition) => (
                            <motion.button
                              key={condition}
                              type="button"
                              onClick={() => setFormData({ ...formData, condition })}
                              className={`p-3 rounded-lg transition-all ${
                                formData.condition === condition
                                  ? 'bg-eco-500 text-white border-2 border-eco-600'
                                  : darkMode
                                  ? 'bg-gray-600 text-gray-300 border-2 border-gray-600 hover:border-eco-400'
                                  : 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:border-eco-400'
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {condition}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Quantity
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          min="1"
                          max="50"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-eco-500 ${darkMode ? 'bg-gray-600 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Partner Selection */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Choose your pickup partner
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Selected: <span className="font-semibold">{formData.pickupType === 'recycler' ? 'Verified Recycler' : 'Repair Enthusiast'}</span>
                      </p>

                      <div className={`p-4 rounded-lg border-2 border-yellow-400 ${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                        <div className="flex items-start space-x-2">
                          <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                          <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                            {formData.pickupType === 'recycler'
                              ? 'Certified recyclers follow strict environmental and data protection standards'
                              : 'Repair enthusiasts are community members dedicated to extending device lifespans'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Contact Details */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Your pickup details
                      </h3>

                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-4 py-2 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-eco-500 ${darkMode ? 'bg-gray-600 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-4 py-2 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-eco-500 ${darkMode ? 'bg-gray-600 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Pickup Address
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          rows="3"
                          className={`w-full px-4 py-2 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-eco-500 resize-none ${darkMode ? 'bg-gray-600 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                          placeholder="123 Main St, City, State 12345"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t border-gray-300">
                <motion.button
                  type="button"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    currentStep === 1
                      ? 'opacity-50 cursor-not-allowed'
                      : darkMode
                      ? 'bg-gray-600 text-white hover:bg-gray-500'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                  whileHover={currentStep !== 1 ? { scale: 1.05 } : {}}
                  whileTap={currentStep !== 1 ? { scale: 0.95 } : {}}
                >
                  Previous
                </motion.button>

                {currentStep !== 3 ? (
                  <motion.button
                    type="button"
                    onClick={() => isStepComplete(currentStep) && setCurrentStep(currentStep + 1)}
                    disabled={!isStepComplete(currentStep)}
                    className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all ${
                      isStepComplete(currentStep)
                        ? 'bg-gradient-eco text-white hover:shadow-glow'
                        : 'opacity-50 cursor-not-allowed bg-gray-400 text-white'
                    }`}
                    whileHover={isStepComplete(currentStep) ? { scale: 1.05 } : {}}
                    whileTap={isStepComplete(currentStep) ? { scale: 0.95 } : {}}
                  >
                    <span>Next</span>
                    <ArrowRight size={18} />
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    className="btn-primary flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Schedule Pickup</span>
                    <CheckCircle size={18} />
                  </motion.button>
                )}
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
