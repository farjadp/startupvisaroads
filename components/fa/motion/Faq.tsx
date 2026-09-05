'use client';

// Accordion with real height animation and a rotating mark. Only one open per
// group so the reader keeps their place; the summary stays a real button.
import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Plus } from 'lucide-react';
import type { FaFaq } from '@/lib/fa/content';

export default function Faq({ items, idPrefix = 'q' }: { items: FaFaq[]; idPrefix?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const reduced = useReducedMotion();
  return (
    <div className="border-t border-[#1a1a1a]/20">
      {items.map((f, k) => {
        const isOpen = open === k;
        const id = `${idPrefix}-${k}`;
        return (
          <div key={f.q} className="border-b border-[#1a1a1a]/20">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={id}
              onClick={() => setOpen(isOpen ? null : k)}
              className="w-full py-6 flex items-start justify-between gap-6 text-start group"
            >
              <span className={`font-estedad font-bold text-xl leading-snug transition-colors ${isOpen ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]/85 group-hover:text-[#1a1a1a]'}`}>{f.q}</span>
              <motion.span
                aria-hidden
                className="shrink-0 mt-1 w-8 h-8 border border-[#1a1a1a] grid place-items-center"
                animate={{ rotate: isOpen ? 45 : 0, backgroundColor: isOpen ? '#1a1a1a' : 'rgba(0,0,0,0)', color: isOpen ? '#CCFF00' : '#1a1a1a' }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <Plus className="w-4 h-4" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={id}
                  key="body"
                  initial={reduced ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-7 text-[#1a1a1a]/75 leading-[1.9] max-w-3xl">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
