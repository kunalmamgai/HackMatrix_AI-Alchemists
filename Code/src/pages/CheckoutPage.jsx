import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { payments, orders, ApiError } from '../api/client';
import { checkoutSchema, formatCardNumber, formatExpiry, isValidCardNumber } from '../utils/validation';
import { Trash2, Plus, Minus, CreditCard, HelpCircle, Check, AlertCircle, Loader } from 'lucide-react';
import DeviceImage from '../components/DeviceImage';
import Breadcrumb from '../components/Breadcrumb';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export default function CheckoutPage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [cardDetails, setCardDetails] = useState({ cardName: '', cardNumber: '', expiryDate: '', cvv: '' });
  const [upiId, setUpiId] = useState('');

  const totalPrice = getTotalPrice();

  useEffect(() => {
    if (searchParams.get('success') === 'true') { setOrderPlaced(true); clearCart(); }
    if (searchParams.get('cancelled') === 'true') setError('Payment was cancelled. Your cart items are still saved.');
  }, [searchParams, clearCart]);

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === 'cardNumber') formatted = formatCardNumber(value);
    else if (name === 'expiryDate') formatted = formatExpiry(value);
    else if (name === 'cvv') formatted = value.replace(/\D/g, '').slice(0, 4);
    setCardDetails((prev) => ({ ...prev, [name]: formatted }));
    if (fieldErrors[name]) setFieldErrors((p) => { const n = { ...p }; delete n[name]; return n; });
  };

  const validateForm = () => {
    setFieldErrors({});
    setError(null);
    if (paymentMethod === 'card') {
      const result = checkoutSchema.safeParse(cardDetails);
      if (!result.success) {
        const errors = {};
        result.error.errors.forEach((e) => { errors[e.path[0]] = e.message; });
        setFieldErrors(errors);
        return false;
      }
      if (!isValidCardNumber(cardDetails.cardNumber)) { setFieldErrors({ cardNumber: 'Invalid card number' }); return false; }
    }
    if (paymentMethod === 'upi' && !upiId.match(/^[\w.\-]+@[\w]+$/)) {
      setFieldErrors({ upiId: 'Enter a valid UPI ID (e.g. name@upi)' }); return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm() || cartItems.length === 0) return;
    setIsProcessing(true);
    setError(null);
    try {
      const orderData = await orders.create({
        items: cartItems.map((item) => ({ productId: item.backendId || item.id, quantity: item.quantity })),
        paymentMethod,
      });
      const { url } = await payments.createCheckout(orderData.order.id);
      if (url) { window.location.href = url; }
      else { setOrderPlaced(true); setTimeout(() => { clearCart(); navigate('/disposables'); }, 3000); }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) setError('Please log in to complete your order.');
      else setError(err.message || 'Failed to place order. Please try again.');
    } finally { setIsProcessing(false); }
  };

  if (!isLoggedIn) {
    return (
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center pt-20 px-4 bg-cream-50">
        <div className="text-center p-8 rounded-2xl shadow-xl max-w-md bg-white border border-sage-200">
          <div className="w-16 h-16 bg-gradient-forest rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg"><CreditCard className="w-8 h-8 text-white" /></div>
          <h2 className="text-2xl font-bold mb-3 text-ink-900">Sign in to complete your order</h2>
          <p className="text-ink-500 mb-6">Your cart is saved — {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} waiting for you.</p>
          <button onClick={() => navigate('/login')} className="btn-primary">Go to Login</button>
        </div>
      </motion.main>
    );
  }

  if (orderPlaced) {
    return (
      <motion.main initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="min-h-screen flex items-center justify-center pt-20 px-4 bg-cream-50">
        <div className="text-center p-12 rounded-2xl shadow-2xl max-w-md bg-white">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="mb-6">
            <div className="w-20 h-20 bg-gradient-forest rounded-full flex items-center justify-center mx-auto shadow-lg"><Check className="w-10 h-10 text-white" /></div>
          </motion.div>
          <h2 className="text-3xl font-bold mb-2 text-ink-900">Order Placed!</h2>
          <p className="text-lg text-ink-500">Your order has been confirmed. Redirecting...</p>
        </div>
      </motion.main>
    );
  }

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-20 pb-12 px-4 bg-cream-50">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Disposables', href: '/disposables' }, { label: 'Checkout' }].filter((i) => i.label !== 'Home')} />

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-danger-500 flex-shrink-0" />
            <p className="text-sm text-danger-700">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-danger-400 hover:text-danger-600">✕</button>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-8 shadow-xl bg-white">
              <h2 className="text-2xl font-bold mb-6 text-ink-900">Order Summary</h2>
              {cartItems.length === 0 ? (
                <div className="text-center py-12"><p className="text-ink-500 mb-4">Your cart is empty</p><button onClick={() => navigate('/disposables')} className="btn-secondary">Browse Products</button></div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4 p-4 rounded-xl border bg-sage-100 border-sage-200">
                      <DeviceImage src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h3 className="font-bold text-ink-900">{item.name}</h3>
                        <p className="text-sm text-ink-500">{item.category}</p>
                        <p className="font-semibold text-forest-500 text-lg">{item.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 rounded-lg bg-sage-200 hover:bg-sage-300"><Minus size={16} /></button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 rounded-lg bg-sage-200 hover:bg-sage-300"><Plus size={16} /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-2 rounded-lg text-danger-400 hover:bg-sage-100"><Trash2 size={18} /></button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-8 shadow-xl h-fit sticky top-24 bg-white">
            <h3 className="text-xl font-bold mb-6 text-ink-900">Payment Details</h3>
            <div className="mb-6 pb-4 border-b border-sage-200">
              <div className="flex justify-between mb-2 text-ink-500"><span>Subtotal:</span><span>₹{totalPrice}</span></div>
              <div className="flex justify-between mb-2 text-ink-500"><span>Tax (5%):</span><span>₹{Math.round(totalPrice * 0.05)}</span></div>
              <div className="flex justify-between mb-2 text-ink-500"><span>Shipping:</span><span>₹50</span></div>
              <div className="flex justify-between pt-4 font-bold text-lg text-ink-900"><span>Total:</span><span className="text-forest-500">₹{totalPrice + Math.round(totalPrice * 0.05) + 50}</span></div>
            </div>

            <div className="mb-6 space-y-3">
              <label className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-forest-800 bg-forest-800/10' : 'border-sage-300'}`}>
                <input type="radio" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4" />
                <CreditCard size={18} className="ml-3 mr-2 text-forest-500" />
                <span className="font-semibold text-ink-900">Credit/Debit Card</span>
              </label>
              <label className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-forest-800 bg-forest-800/10' : 'border-sage-300'}`}>
                <input type="radio" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4" />
                <HelpCircle size={18} className="ml-3 mr-2 text-forest-500" />
                <span className="font-semibold text-ink-900">UPI / Wallet</span>
              </label>
            </div>

            {paymentMethod === 'card' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 space-y-3">
                <div>
                  <input type="text" name="cardName" placeholder="Cardholder Name" value={cardDetails.cardName} onChange={handleCardChange} className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-forest-500 bg-sage-100 text-ink-900 ${fieldErrors.cardName ? 'border-danger-500' : 'border-sage-200'}`} />
                  {fieldErrors.cardName && <p className="text-xs text-danger-500 mt-1">{fieldErrors.cardName}</p>}
                </div>
                <div>
                  <input type="text" name="cardNumber" placeholder="Card Number" value={cardDetails.cardNumber} onChange={handleCardChange} className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-forest-500 bg-sage-100 text-ink-900 ${fieldErrors.cardNumber ? 'border-danger-500' : 'border-sage-200'}`} />
                  {fieldErrors.cardNumber && <p className="text-xs text-danger-500 mt-1">{fieldErrors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input type="text" name="expiryDate" placeholder="MM/YY" value={cardDetails.expiryDate} onChange={handleCardChange} className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-forest-500 bg-sage-100 text-ink-900 ${fieldErrors.expiryDate ? 'border-danger-500' : 'border-sage-200'}`} />
                    {fieldErrors.expiryDate && <p className="text-xs text-danger-500 mt-1">{fieldErrors.expiryDate}</p>}
                  </div>
                  <div>
                    <input type="text" name="cvv" placeholder="CVV" value={cardDetails.cvv} onChange={handleCardChange} className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-forest-500 bg-sage-100 text-ink-900 ${fieldErrors.cvv ? 'border-danger-500' : 'border-sage-200'}`} />
                    {fieldErrors.cvv && <p className="text-xs text-danger-500 mt-1">{fieldErrors.cvv}</p>}
                  </div>
                </div>
                <p className="text-xs text-ink-400 flex items-center gap-1"><CreditCard className="w-3 h-3" /> Card details are processed securely via Stripe — we never store them.</p>
              </motion.div>
            )}

            {paymentMethod === 'upi' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
                <input type="text" placeholder="yourname@upi" value={upiId} onChange={(e) => { setUpiId(e.target.value); if (fieldErrors.upiId) setFieldErrors((p) => { const n = { ...p }; delete n.upiId; return n; }); }} className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-forest-500 bg-sage-100 text-ink-900 ${fieldErrors.upiId ? 'border-danger-500' : 'border-sage-200'}`} />
                {fieldErrors.upiId && <p className="text-xs text-danger-500 mt-1">{fieldErrors.upiId}</p>}
              </motion.div>
            )}

            <button onClick={handlePlaceOrder} disabled={cartItems.length === 0 || isProcessing} className="w-full py-3 rounded-lg font-bold text-white bg-gradient-forest hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
              {isProcessing ? (<><Loader className="w-4 h-4 animate-spin" /> Processing...</>) : 'Place Order'}
            </button>
            <p className="text-xs text-ink-400 text-center mt-4">Secure checkout powered by Stripe. Your payment information is encrypted.</p>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
}
