'use client';

// ============================================================================
// components/fa/motion/useHydratedReducedMotion.ts
// The reduced-motion preference, safe to branch rendered markup on.
//
// useReducedMotion() is null on the server and true on the client's first
// render in a reduced-motion browser. Anything that changes what is rendered
// (an element, a style, an `initial` value) on that difference produces HTML
// the client disagrees with; React reports the mismatch and does not patch
// attributes, so an element server-rendered at opacity 0 stays invisible.
//
// This hook answers false during SSR and during hydration, then the real
// preference on the render straight after. Client-side navigations (no
// hydration) get the real value on the first render.
//
// Rule of thumb for the motion components:
//   - `initial` and anything else that ends up in markup: never branch on raw
//     useReducedMotion(). Use this hook, or keep it identical.
//   - `transition`, `animate`, `whileInView`, event handlers: not rendered to
//     markup, so raw useReducedMotion() is fine (and takes effect from the
//     first client render, e.g. duration 0 for an entrance).
// ============================================================================
import { useSyncExternalStore } from 'react';
import { useReducedMotion } from 'motion/react';

const subscribe = () => () => {};

export function useHydratedReducedMotion(): boolean {
  const reduced = useReducedMotion();
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  return hydrated && reduced === true;
}
