/**
 * Reusable SVG wave dividers for organic section transitions.
 *
 * Variants:
 *   "dark-to-light"  — forest-900 → white/cream  (Hero → Features)
 *   "light-to-cream" — white → cream-50           (Features → Stats)
 *   "cream-to-light" — cream-50 → white           (Stats → next light section)
 *   "light-to-dark"  — cream-50 → forest-800      (CTA → Footer)
 *   "subtle"         — same-family subtle curve    (Stats → Map)
 *
 * flip: boolean — mirrors the wave vertically (for bottom of a section)
 */
export default function WaveDivider({ variant = 'dark-to-light', flip = false, className = '' }) {
  const colors = {
    'dark-to-light': { from: '#173228', to: '#f8faf6' },
    'light-to-cream': { from: '#ffffff', to: '#f8faf6' },
    'cream-to-white': { from: '#f8faf6', to: '#ffffff' },
    'cream-to-sage': { from: '#f8faf6', to: '#e9f1e7' },
    'sage-to-cream': { from: '#e9f1e7', to: '#f8faf6' },
    'light-to-dark': { from: '#f8faf6', to: '#1e4033' },
    'subtle': { from: '#f8faf6', to: '#f1f5ee' },
  };

  const { from, to } = colors[variant] || colors['dark-to-light'];

  return (
    <div
      className={`w-full leading-[0] overflow-hidden pointer-events-none ${flip ? 'rotate-180' : ''} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="w-full h-[60px] md:h-[80px] lg:h-[100px]"
      >
        {/* Background fill matching the section above */}
        <rect width="1440" height="120" fill={from} />

        {/* Organic wave path */}
        <path
          d="M0,40 C240,100 480,0 720,60 C960,120 1200,20 1440,80 L1440,120 L0,120 Z"
          fill={to}
        />

        {/* Secondary subtle curve for depth */}
        <path
          d="M0,60 C360,10 720,110 1080,40 C1260,10 1380,50 1440,70 L1440,120 L0,120 Z"
          fill={to}
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
