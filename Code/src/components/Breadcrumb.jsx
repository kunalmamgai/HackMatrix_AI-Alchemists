import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Reusable breadcrumb navigation.
 * @param {Array} items - Array of { label, href } objects. Last item is current page (not linked).
 *
 * Usage:
 *   <Breadcrumb items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Device Guide', href: '/device-search' },
 *     { label: 'iPhone 14' },
 *   ]} />
 */
export default function Breadcrumb({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {/* Always start with Home icon */}
        <li className="flex items-center">
          <Link
            to="/"
            className="text-ink-400 hover:text-forest-600 transition-colors p-1 rounded-md hover:bg-sage-100"
            aria-label="Home"
          >
            <Home size={16} />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight size={14} className="text-ink-300 flex-shrink-0" aria-hidden="true" />
              {isLast || !item.href ? (
                <span
                  className="text-ink-700 font-semibold"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="text-ink-400 hover:text-forest-600 transition-colors hover:underline underline-offset-2"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
