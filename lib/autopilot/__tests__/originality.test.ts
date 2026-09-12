import { describe, it, expect } from 'vitest';
import { originality, tooClose, shingles } from '../originality';
import { seasonalHooks } from '../planner';

describe('seasonalHooks', () => {
  it('uses neutral verification hooks rather than claiming cadence or intake state', () => {
    const hooks = seasonalHooks(new Date('2026-03-15T12:00:00Z')).join(' ');
    expect(hooks).toContain('verify');
    expect(hooks).not.toMatch(/roughly every two weeks|opens? in|intake|slow down|exhaust|spend remaining/i);
  });
});

describe('originality', () => {
  const source = 'Immigration, Refugees and Citizenship Canada issued 3,500 invitations to apply in a healthcare draw on September 4, 2026 with a minimum score of 470 points for candidates.';
  it('flags a copied sentence', () => {
    const o = originality(`<p>Yesterday ${source}</p>`, source);
    expect(o.shared).toBeGreaterThan(6);
    expect(tooClose(o)).toBe(true);
    expect(o.sample).toContain('immigration refugees and citizenship canada');
  });
  it('passes an honest retelling', () => {
    const mine = '<p>IRCC ran a healthcare-targeted round on 4 September 2026. It sent 3,500 invitations; the cut-off sat at 470. For founders this matters less than for nurses.</p>';
    const o = originality(mine, source);
    expect(o.shared).toBe(0);
    expect(tooClose(o)).toBe(false);
  });
  it('ignores case, punctuation, tags and نیم‌فاصله', () => {
    const a = shingles('<b>Hello,</b> World! برنامه‌های استانی', 2);
    const b = shingles('hello world برنامه های استانی', 2);
    expect([...a]).toEqual([...b]);
  });
});
