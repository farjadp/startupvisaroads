'use client';
// ============================================================================
// Component: components/fa/FaRoute.tsx
// The progress layer for the Persian guides: each section of a guide is a
// stop, completed when the reader has seen it or opened its detail. The copy
// itself is rendered by FaPageLayout on the server; this file only adds state.
// ============================================================================
import React, { useEffect, useRef } from 'react';
import { useRoute } from '@/components/route/RouteProgress';

/** One section of a Persian guide, completed on view or when its detail is opened. */
export function FaStop({ id, message, className, children }: { id: string; message: string; className?: string; children: React.ReactNode }) {
  const { complete } = useRoute();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    // Seen = half the section, or half the screen for a section taller than
    // two screens, held for a moment so a fast scroll past does not count.
    const io = new IntersectionObserver(
      ([e]) => {
        const need = Math.min(e.boundingClientRect.height, window.innerHeight) * 0.5;
        if (e.isIntersecting && e.intersectionRect.height >= need) {
          timer = setTimeout(() => complete(id, message), 1500);
          io.disconnect();
        }
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
    );
    io.observe(el);
    const onToggle = (e: Event) => {
      if (e.target instanceof HTMLDetailsElement && e.target.open) complete(id, message);
    };
    el.addEventListener('toggle', onToggle, true);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      el.removeEventListener('toggle', onToggle, true);
    };
  }, [id, message, complete]);

  return (
    <section ref={ref} id={id} className={className}>
      {children}
    </section>
  );
}
