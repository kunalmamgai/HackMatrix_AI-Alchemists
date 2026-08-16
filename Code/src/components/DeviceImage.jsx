import { useState } from 'react';

/**
 * Shared image renderer with a graceful branded fallback.
 * If `src` is missing or fails to load (hotlink death, offline demo, etc.),
 * it renders a forest-gradient tile with the supplied lucide icon instead of
 * a broken-image glyph.
 */
export default function DeviceImage({
  src,
  alt = '',
  icon: Icon = null,
  iconClassName = 'w-10 h-10 text-white/80',
  className = 'h-36 w-full object-cover',
}) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  if (showFallback) {
    return (
      <div
        role="img"
        aria-label={alt || 'Image unavailable'}
        className={`flex items-center justify-center bg-gradient-forest ${className}`}
      >
        {Icon ? <Icon className={iconClassName} aria-hidden="true" /> : null}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
