'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      const timeout = setTimeout(() => {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: pathname }),
        }).catch(console.error);
      }, 500); // Slight delay so it doesn't block page load
      return () => clearTimeout(timeout);
    }
  }, [pathname]);

  return null;
}
