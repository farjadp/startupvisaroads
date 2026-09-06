'use client';

// ============================================================================
// Component: components/fa/motion/CountUp.tsx
// Counts the numerals inside a Persian sentence up to their real value when
// the panel first scrolls into view. The value stays a sentence — «حدود
// ۱۵۳٬۷۰۰ کرون دانمارک» animates only the ۱۵۳٬۷۰۰ and leaves the words
// where they are, keeping the author's grouping separator.
//
// Under reduced motion, and before hydration, the final text is what renders:
// the number is the content, so it must never depend on an animation having
// run.
// ============================================================================
import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { splitNumerals, formatNumeral, type NumeralToken } from '@/lib/fa/format';

const DURATION = 900;
// Same decelerating curve as the reveals, so the panel reads as one gesture.
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function CountUp({ text, className }: { text: string; className?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [tokens, setTokens] = useState<NumeralToken[] | null>(null);
  const [t, setT] = useState(1);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const parsed = splitNumerals(text);
    if (!parsed.some((p) => p.value !== undefined)) return; // nothing to count
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        setTokens(parsed);
        setT(0);
        const start = performance.now();
        let raf = 0;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / DURATION);
          setT(easeOut(p));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text, reduced]);

  // Before the observer fires, while reduced motion is on, and once the
  // animation has finished, this is just the string the author wrote.
  if (!tokens || t >= 1) return <span ref={ref} className={className}>{text}</span>;

  return (
    <span ref={ref} className={className}>
      {tokens.map((tok, i) =>
        tok.value === undefined ? (
          <React.Fragment key={i}>{tok.text}</React.Fragment>
        ) : (
          <span key={i} className="tabular-nums">{formatNumeral(tok.value * t, tok.group)}</span>
        ),
      )}
    </span>
  );
}
