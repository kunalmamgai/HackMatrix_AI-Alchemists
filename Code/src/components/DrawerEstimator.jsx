import { motion } from 'framer-motion';
import { useState } from 'react';
import { Coins, Leaf, RotateCcw, TreePine, Car, CheckCircle2 } from 'lucide-react';
import CountUp from './CountUp';
import { devices } from '../data/devices';

// Rough equivalence constants (for fun, demo-friendly framing)
const KG_PER_TREE_YEAR = 21; // one mature tree absorbs ~21 kg CO2 per year
const KM_PER_KG = 6.67; // typical car emits ~150 g CO2/km → 1 kg ≈ 6.67 km

export default function DrawerEstimator() {
  const [selected, setSelected] = useState(() => new Set());

  const toggleDevice = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedDevices = devices.filter((d) => selected.has(d.id));
  const totalValue = selectedDevices.reduce((sum, d) => sum + d.recoveryValue, 0);
  const totalCarbon = selectedDevices.reduce((sum, d) => sum + d.carbonSaved, 0);
  const treeYears = Math.round(totalCarbon / KG_PER_TREE_YEAR);
  const kmDriven = Math.round(totalCarbon * KM_PER_KG);

  return (
    <section id="drawer-estimator" className={`py-20 bg-cream-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 text-ink-900`}>
            What's in Your <span className="text-eco-500">Drawer?</span>
          </h2>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto text-ink-500`}>
            Tap the old devices you own and watch their recovery value and carbon savings add up.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          {/* Device picker */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {devices.map((device, index) => {
                const isSelected = selected.has(device.id);
                return (
                  <motion.button
                    key={device.id}
                    type="button"
                    onClick={() => toggleDevice(device.id)}
                    aria-pressed={isSelected}
                    className={`relative text-left rounded-2xl p-5 border-2 transition-all ${
                      isSelected
                        ? 'border-eco-500 bg-eco-500/10 shadow-lg'
                        : 'border-sage-200 bg-white hover:border-eco-500/50'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    {isSelected && (
                      <CheckCircle2
                        className="absolute top-3 right-3 w-6 h-6 text-eco-500"
                        aria-hidden="true"
                      />
                    )}
                    <device.icon
                      className={`w-8 h-8 mb-3 ${isSelected ? 'text-eco-500' : 'text-eco-400'}`}
                    />
                    <h3 className={`font-bold mb-0.5 text-ink-900`}>
                      {device.name}
                    </h3>
                    <p className={`text-xs mb-3 text-ink-500`}>
                      {device.category}
                    </p>
                    <div className={`flex items-center justify-between text-sm text-ink-700`}>
                      <span className="font-semibold text-eco-500">₹{device.recoveryValue.toLocaleString('en-IN')}</span>
                      <span className="text-xs">{device.carbonSaved} kg CO₂</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <p className={`mt-6 text-sm text-ink-400`}>
              *Estimates based on average recoverable materials and avoided-emissions figures. Actual values vary by model and condition.
            </p>
          </div>

          {/* Live total */}
          <motion.div
            className={`lg:sticky lg:top-24 rounded-3xl p-8 shadow-xl border-2 bg-white border-sage-200`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 text-ink-900`}>
              <Coins className="w-5 h-5 text-eco-500" />
              Your Drawer's Worth
            </h3>

            {selectedDevices.length === 0 ? (
              <div className={`text-center py-8 px-4 rounded-2xl border-2 border-dashed border-sage-200`}>
                <p className="text-4xl mb-3">🗄️</p>
                <p className={`text-sm text-ink-500`}>
                  Tap the devices you own to see their recovery value and carbon savings add up.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-5">
                  <div>
                    <p className={`text-sm mb-1 text-ink-500`}>
                      Devices selected
                    </p>
                    <p className={`text-3xl font-bold text-ink-900`}>
                      {selectedDevices.length}
                      <span className="text-lg font-semibold text-ink-400"> / {devices.length}</span>
                    </p>
                  </div>

                  <div className={`h-px bg-sage-100`} />

                  <div>
                    <p className={`text-sm mb-1 text-ink-500`}>
                      Recoverable material value
                    </p>
                    <p className="text-3xl font-bold text-eco-500">
                      <CountUp target={totalValue} prefix="₹" observe={false} />
                    </p>
                  </div>

                  <div>
                    <p className={`text-sm mb-1 text-ink-500`}>
                      Carbon emissions avoided
                    </p>
                    <p className={`text-3xl font-bold text-ink-900`}>
                      <CountUp target={totalCarbon} suffix=" kg" observe={false} />
                      <span className="text-base font-semibold text-ink-400"> CO₂e</span>
                    </p>
                  </div>

                  <div className={`rounded-2xl p-4 bg-cream-50`}>
                    <p className={`text-sm font-semibold mb-2 flex items-center gap-1.5 text-eco-600`}>
                      <Leaf className="w-4 h-4" />
                      That's roughly equivalent to:
                    </p>
                    <div className="space-y-1.5 text-sm">
                      <p className={`flex items-center gap-2 text-ink-700`}>
                        <TreePine className="w-4 h-4 text-eco-500" />
                        <CountUp target={treeYears} observe={false} /> {treeYears === 1 ? 'tree' : 'trees'} absorbing CO₂ for a year
                      </p>
                      <p className={`flex items-center gap-2 text-ink-700`}>
                        <Car className="w-4 h-4 text-eco-500" />
                        <CountUp target={kmDriven} observe={false} /> km not driven by car
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelected(new Set())}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-colors border-sage-200 text-ink-500 hover:border-red-500 hover:text-red-400"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
