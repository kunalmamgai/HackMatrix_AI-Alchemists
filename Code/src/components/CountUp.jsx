import { animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function CountUp({ target, prefix = '', suffix = '', duration = 1.8, locale = 'en-IN', observe = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
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
