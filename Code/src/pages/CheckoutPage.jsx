import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, CreditCard, HelpCircle, Check } from 'lucide-react';

export default function CheckoutPage({ darkMode, isLoggedIn }) {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const totalPrice = getTotalPrice();

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'card' && (!cardDetails.cardName || !cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv)) {
      alert('Please fill in all card details');
      return;
    }
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      navigate('/disposables');
    }, 3000);
  };

  if (!isLoggedIn) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`min-h-screen flex items-center justify-center pt-20 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      >
        <div className={`text-center p-8 rounded-2xl shadow-xl max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Login Required
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
            Please login first to continue with checkout.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-eco text-white font-semibold py-2.5 px-5 rounded-lg hover:shadow-lg transition-all"
          >
            Go to Login
          </button>
        </div>
      </motion.main>
    );
  }

  if (orderPlaced) {
    return (
      <motion.main
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`min-h-screen flex items-center justify-center pt-20 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      >
        <div className={`text-center p-12 rounded-3xl shadow-2xl max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="mb-6">
            <div className="w-20 h-20 bg-gradient-eco rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Check className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Order Placed!</h2>
          <p className={`text-lg mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Your order has been confirmed. Redirecting...
          </p>
        </div>
      </motion.main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen pt-20 pb-12 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/disposables')}
          className={`flex items-center space-x-2 mb-8 px-4 py-2 rounded-lg transition-colors ${
            darkMode ? 'text-eco-400 hover:bg-gray-800' : 'text-eco-600 hover:bg-eco-50'
          }`}
        >
          <ArrowLeft size={20} />
          <span>Back to Products</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl p-8 shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Order Summary
              </h2>

              {cartItems.length === 0 ? (
                <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your cart is empty
                </p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center gap-4 p-4 rounded-xl border ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />

                      <div className="flex-1">
                        <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.name}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {item.category}
                        </p>
                        <p className={`font-semibold text-eco-500 text-lg`}>
                          {item.price}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className={`p-2 rounded-lg transition-colors ${
                            darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className={`p-2 rounded-lg transition-colors ${
                            darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Payment & Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl p-8 shadow-xl h-fit sticky top-24 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Payment Details
            </h3>

            {/* Pricing Summary */}
            <div className={`mb-6 pb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`flex justify-between mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span>Subtotal:</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className={`flex justify-between mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span>Tax (5%):</span>
                <span>₹{Math.round(totalPrice * 0.05)}</span>
              </div>
              <div className={`flex justify-between mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span>Shipping:</span>
                <span>₹50</span>
              </div>
              <div className={`flex justify-between pt-4 font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <span>Total:</span>
                <span className="text-eco-500">₹{totalPrice + Math.round(totalPrice * 0.05) + 50}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6 space-y-3">
              <label className="flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors"
                style={{
                  borderColor: paymentMethod === 'card' ? '#34d399' : darkMode ? '#4b5563' : '#e5e7eb',
                  backgroundColor: paymentMethod === 'card' ? darkMode ? 'rgba(52, 211, 153, 0.1)' : 'rgba(52, 211, 153, 0.05)' : 'transparent'
                }}
              >
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <CreditCard size={18} className="ml-3 mr-2 text-eco-500" />
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Credit/Debit Card
                </span>
              </label>

              <label className="flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors"
                style={{
                  borderColor: paymentMethod === 'upi' ? '#34d399' : darkMode ? '#4b5563' : '#e5e7eb',
                  backgroundColor: paymentMethod === 'upi' ? darkMode ? 'rgba(52, 211, 153, 0.1)' : 'rgba(52, 211, 153, 0.05)' : 'transparent'
                }}
              >
                <input
                  type="radio"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <HelpCircle size={18} className="ml-3 mr-2 text-eco-500" />
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  UPI / Wallet
                </span>
              </label>
            </div>

            {/* Card Details Form */}
            {paymentMethod === 'card' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 space-y-3">
                <input
                  type="text"
                  name="cardName"
                  placeholder="Cardholder Name"
                  value={cardDetails.cardName}
                  onChange={handleCardChange}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-eco-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                />
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number (16 digits)"
                  len="16"
                  value={cardDetails.cardNumber}
                  onChange={handleCardChange}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-eco-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={handleCardChange}
                    className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-eco-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                  <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={handleCardChange}
                    maxLength="3"
                    className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-eco-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
              </motion.div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0}
              className="w-full py-3 rounded-lg font-bold text-white bg-gradient-eco hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Place Order
            </button>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
}