import { animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function CountUp({ target, prefix = '', suffix = '', duration = 1.8, locale = 'en-IN', observe = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    // With observe=true, wait until the element scrolls into view (e.g. impact
    // stats far down the page). With observe=false, animate immediately and on
    // every target change — right for totals that only exist once the user is
    // interacting with them, so a short viewport can't keep them off-screen.
    if (observe && !inView) return;
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, target, duration, observe]);

  return (
    <span ref={ref}>
      {prefix}
      {Math.round(display).toLocaleString(locale)}
      {suffix}
    </span>
  );
}
