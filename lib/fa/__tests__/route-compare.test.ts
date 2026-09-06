import { describe, it, expect } from 'vitest';
import { valueOf } from '../compare';
import { RULES } from '../programmes';


const rule = (key: string) => RULES.find((r) => r.key === key)!;

describe('comparison sorting', () => {
  // Every sortable column is a barrier. "No threshold" is the easiest case,
  // so it has to sort as the lowest value — not as a missing one that falls
  // to the bottom, which would tell a reader with no capital that the free
  // routes are the ones out of reach.
  it('treats a route with no net-worth requirement as the lowest barrier', () => {
    expect(valueOf(rule('denmark'), 'netWorth')).toBe(0);
    expect(valueOf(rule('new-brunswick'), 'netWorth')).toBeGreaterThan(0);
  });

  it('orders the Canadian entrepreneur streams above the European permits on capital', () => {
    const byNetWorth = [...RULES].sort((a, b) => valueOf(a, 'netWorth') - valueOf(b, 'netWorth'));
    expect(byNetWorth.at(-1)!.key).toBe('nova-scotia');
    expect(byNetWorth.at(-2)!.key).toBe('new-brunswick');
  });

  it('reports the minimum team size, defaulting to one', () => {
    expect(valueOf(rule('finland'), 'founders')).toBe(2);
    expect(valueOf(rule('denmark'), 'founders')).toBe(1);
  });

  it('sorts language by the band the programme demands', () => {
    expect(valueOf(rule('new-brunswick'), 'clb')).toBe(5);
    expect(valueOf(rule('estonia'), 'clb')).toBe(0);
  });
});
