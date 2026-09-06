'use client';

// ============================================================================
// Component: components/fa/motion/SectionNav.tsx
// The sticky contents list, tracking which section the reader is actually in.
//
// A list of anchors that never says where you are is a table of contents for
// a printed page. On a 3,000-word guide the reader's real question is "how
// much of this is left", so the active item is marked and an acid rule runs
// down beside it.
// ============================================================================
import React, { useEffect, useState } from 'react';

export type NavItem = { id: string; label: string };

export default function SectionNav({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const nodes = items.map((i) => document.getElementById(i.id)).filter((n): n is HTMLElement => Boolean(n));
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        // The heading nearest the top of the viewport wins, so the marker
        // does not flicker between two sections that are both on screen.
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [items]);

  return (
    <ol className="space-y-1 text-sm">
      {items.map((it) => {
        const on = active === it.id;
        return (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              aria-current={on ? 'true' : undefined}
              className={`flex gap-3 py-1.5 leading-snug transition-colors ${on ? 'text-[#1a1a1a] font-bold' : 'text-[#1a1a1a]/55 hover:text-[#1a1a1a]'}`}
            >
              <span
                aria-hidden
                className={`mt-[0.6em] h-px shrink-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${on ? 'w-5 bg-[#CCFF00]' : 'w-2 bg-[#1a1a1a]/25'}`}
              />
              <span>{it.label}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
