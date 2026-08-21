import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle2 } from 'lucide-react';

export default function DisposalChecklist({ steps, doneSteps, onToggle, onReset }) {
  const progress = steps.length > 0 ? Math.round((doneSteps.size / steps.length) * 100) : 0;
  const allDone = steps.length > 0 && doneSteps.size === steps.length;

  return (
    <div className="card bg-sage-100">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center space-x-2">
          <RotateCcw className="w-5 h-5 text-forest-500 flex-shrink-0" />
          <h3 className="text-h3 text-ink-900">Step-by-Step Disposal Guide</h3>
        </div>
        <div className="flex items-center gap-3">
          {allDone && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest-500 text-white">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              Ready for pickup
            </span>
          )}
          {doneSteps.size > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-semibold text-ink-500 hover:text-forest-600 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between text-xs font-semibold text-ink-500 mb-1.5">
          <span>
            {doneSteps.size} of {steps.length} steps complete
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-sage-200 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-forest"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const isDone = doneSteps.has(index);
          return (
            <button
              key={index}
              type="button"
              onClick={() => onToggle(index)}
              aria-pressed={isDone}
              className={`w-full flex gap-4 items-start p-4 rounded-lg text-left transition-all border ${
                isDone
                  ? 'bg-forest-500/10 border-forest-400/40'
                  : 'bg-sage-200 border-transparent hover:border-forest-400/40'
              }`}
            >
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-colors ${
                  isDone ? 'bg-forest-500' : 'bg-gradient-forest'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={`flex-1 pt-1 text-ink-700 ${
                  isDone ? 'line-through opacity-60' : ''
                }`}
              >
                {step}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
