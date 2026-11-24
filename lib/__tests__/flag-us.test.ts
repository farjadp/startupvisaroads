// The US flag drawn in components/route/flags.tsx must be the real one
// (Executive Order 10834): a placeholder of stripes once read as "the wrong
// flag" on the pricing page.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FLAGS } from '@/components/route/flags';

describe('US flag', () => {
  const svg = renderToStaticMarkup(React.createElement(React.Fragment, null, FLAGS.us.draw('t')));

  it('has the 1.9 proportion', () => {
    expect(FLAGS.us.w / FLAGS.us.h).toBeCloseTo(1.9, 5);
  });

  it('has 50 stars', () => {
    expect(svg.match(/scale\(40\.04\)/g)).toHaveLength(50);
  });

  it('has 13 stripes: red field, six white stripes 1/13 high', () => {
    expect(svg).toContain('fill="#B22234"');
    expect(svg.match(/M0,\d+H2470/g)).toHaveLength(6);
    expect(svg).toContain('stroke-width="100"');
  });

  it('has a canton 7/13 high and 0.76 of the hoist wide, in Old Glory Blue', () => {
    expect(svg).toContain('<rect width="988" height="700" fill="#3C3B6E"');
  });
});
