import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';
  const icon = isSuccess ? CheckCircle : AlertCircle;
  const bgColor = isSuccess
    ? 'bg-eco-500'
    : 'bg-red-500';

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="fixed top-4 right-4 z-50"
          initial={{ opacity: 0, x: 100, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`${bgColor} text-white rounded-lg shadow-lg p-4 flex items-center space-x-3 max-w-sm`}>
            {motion.create(icon, {
              animate: { scale: [1, 1.1, 1] },
              transition: { duration: 0.5 },
            })}
            <span className="font-medium flex-1">{message}</span>
            <button
              onClick={onClose}
              className="hover:bg-white/20 rounded-lg p-1 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
