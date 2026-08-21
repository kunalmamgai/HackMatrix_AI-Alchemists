import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  X,
  TriangleAlert,
  ShieldAlert,
  Coins,
  Leaf,
  Cpu,
  Printer,
} from 'lucide-react';
import { devices } from '../data/devices';
import DeviceImage from './DeviceImage';
import DisposalChecklist from './DisposalChecklist';

const badgeClasses = (type) => {
  if (type === 'Hazardous') return 'bg-danger-500 text-white';
  if (type === 'Reuse/Recycle') return 'bg-gold-100 text-gold-700';
  return 'bg-forest-100 text-forest-700';
};

export default function DeviceDetail({ device, doneSteps, onToggleStep, onResetSteps, onSelectDevice, onBack }) {
  const navigate = useNavigate();

  const relatedDevices = devices
    .filter(
      (d) =>
        d.id !== device.id &&
        (d.disposal.type === device.disposal.type || d.category === device.category)
    )
    .slice(0, 3);

  return (
    <motion.div
      key="details"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="max-w-5xl mx-auto"
    >
      <button
        onClick={onBack}
        className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-colors text-forest-600 hover:bg-sage-100"
      >
        <X size={18} />
        <span>Back to search</span>
      </button>

      {/* Device hero */}
      <motion.div
        className="card bg-sage-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <DeviceImage
          src={device.image}
          alt={device.name}
          icon={device.icon}
          className="h-56 md:h-72 w-full object-cover"
          iconClassName="w-16 h-16 text-white/90"
        />
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h2 className="text-h2 text-ink-900">
              {device.name}
            </h2>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badgeClasses(device.disposal.type)}`}
            >
              {device.disposal.type}
            </span>
          </div>
          <p className="text-body text-ink-500 mb-0">
            {device.category}
          </p>
        </div>
      </motion.div>

      {/* Value band */}
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        <motion.div
          className="card bg-sage-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Coins className="w-6 h-6 text-gold-600 mb-2" aria-hidden="true" />
          <p className="text-sm text-ink-500 mb-1">Recovery value</p>
          <p className="text-stat text-forest-600">
            ₹{device.recoveryValue.toLocaleString('en-IN')}
          </p>
        </motion.div>
        <motion.div
          className="card bg-sage-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Leaf className="w-6 h-6 text-forest-500 mb-2" aria-hidden="true" />
          <p className="text-sm text-ink-500 mb-1">CO₂ avoided</p>
          <p className="text-stat text-ink-900">
            {device.carbonSaved}
            <span className="text-h3 font-semibold text-ink-400"> kg</span>
          </p>
        </motion.div>
        <motion.div
          className="card bg-sage-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Cpu className="w-6 h-6 text-forest-500 mb-2" aria-hidden="true" />
          <p className="text-sm text-ink-500 mb-1">What's recovered</p>
          <p className="text-sm font-medium text-ink-700 leading-relaxed">
            {device.disposal.value}
          </p>
        </motion.div>
      </div>

      {/* Checklist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="mt-6"
      >
        <DisposalChecklist
          steps={device.disposal.steps}
          doneSteps={doneSteps}
          onToggle={onToggleStep}
          onReset={onResetSteps}
        />
      </motion.div>

      {/* Safety tips */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {device.disposal.type === 'Hazardous' ? (
          <div className="rounded-2xl border-2 border-danger-500 bg-danger-50 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <TriangleAlert className="w-6 h-6 text-danger-500 flex-shrink-0" />
              <h4 className="text-xl font-bold text-danger-700">
                Highly Hazardous — Handle with Care
              </h4>
            </div>
            <ul className="space-y-3">
              {device.disposal.safety?.map((tip, index) => (
                <li key={index} className="flex gap-3 text-danger-800">
                  <span className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-danger-500" />
                  <span className="text-body">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-warning-300 bg-warning-100/60 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <ShieldAlert className="w-6 h-6 text-warning-600 flex-shrink-0" />
              <h4 className="text-xl font-bold text-ink-900">
                Safety Tips
              </h4>
            </div>
            <ul className="space-y-3">
              {device.disposal.safety?.map((tip, index) => (
                <li key={index} className="flex gap-3 text-ink-700">
                  <span className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-warning-500" />
                  <span className="text-body">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>

      {/* Related devices */}
      {relatedDevices.length > 0 && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <h3 className="text-h3 text-ink-900 mb-4">
            Similar devices to recycle
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {relatedDevices.map((relDevice) => (
              <button
                key={relDevice.id}
                type="button"
                onClick={() => onSelectDevice(relDevice)}
                className="card-interactive bg-sage-100 hover:bg-sage-200 text-left p-3"
              >
                <DeviceImage
                  src={relDevice.image}
                  alt={relDevice.name}
                  icon={relDevice.icon}
                  className="h-24 w-full object-cover rounded-lg"
                  iconClassName="w-7 h-7 text-white/80"
                />
                <div className="flex items-center justify-between mt-3 px-1">
                  <span className="font-semibold text-sm text-ink-900">
                    {relDevice.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${badgeClasses(relDevice.disposal.type)}`}
                  >
                    {relDevice.disposal.type}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action buttons */}
      <motion.div
        className="mt-8 flex flex-wrap gap-4 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <button onClick={() => navigate('/nearby-locations')} className="btn-primary flex-1 min-w-[180px]">
          Find Recycling Centers
        </button>
        <button onClick={() => navigate('/pickup-network')} className="btn-secondary flex-1 min-w-[180px]">
          Schedule Pickup
        </button>
        <button
          onClick={() => window.print()}
          className="btn-outline flex-1 min-w-[140px] inline-flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" aria-hidden="true" />
          Print guide
        </button>
      </motion.div>
    </motion.div>
  );
}
