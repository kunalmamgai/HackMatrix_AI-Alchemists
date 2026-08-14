// Motion tokens — centralized durations and easings (redesign report 4.5).
// Import these in every Framer Motion call site instead of raw numbers.

export const motionTokens = {
  instant: { duration: 0.15, ease: 'easeOut' }, // button press, checkbox toggle
  fast: { duration: 0.25, ease: 'easeOut' }, // hover states, tooltips
  base: { duration: 0.4, ease: 'easeInOut' }, // card reveal on scroll, tab switch
  slow: { duration: 0.7, ease: 'easeOut' }, // hero stagger-in
  scene: { duration: 1.2, ease: 'easeOut' }, // 3D scene, map fly-to
};

// Ready-to-use transition shorthand for the common cases
export const transitions = {
  instant: { duration: motionTokens.instant.duration, ease: motionTokens.instant.ease },
  fast: { duration: motionTokens.fast.duration, ease: motionTokens.fast.ease },
  base: { duration: motionTokens.base.duration, ease: motionTokens.base.ease },
  slow: { duration: motionTokens.slow.duration, ease: motionTokens.slow.ease },
  scene: { duration: motionTokens.scene.duration, ease: motionTokens.scene.ease },
};

// Viewport option reused across reveal-on-scroll animations
export const viewportOnce = { once: true, amount: 0.2 };
