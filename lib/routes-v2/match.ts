// "% match with the published criteria" (spec 2026-10-15 §4, Farjad's
// framing). Never a chance of approval: only criteria a profile can decide
// are counted, skipped answers count as unscored (not "not yet"), and every
// % comes with its coverage ("based on X of Y conditions"). Routes that are
// paused or closed get no % and no rank.
//
// Pure: currency conversion comes in as a function, so this file has no
// runtime imports and runs the same on the site, in the app and in tests.
import type { Criterion, ProfileField, RouteV2, Test, V2Currency } from './types';

/** The assessment's answers. Money fields are in US dollars. Absent = skipped. */
export type Profile = Partial<Record<ProfileField, number | string | boolean>>;

export type CriterionState = 'met' | 'close' | 'not-yet' | 'unscored';

export type CriterionResult = { key: string; state: CriterionState; weight: number };

export type MatchResult = {
  route: string;
  /** 0–100, or null when no criterion could be scored (or the route is paused/closed). */
  pct: number | null;
  /** Scoreable criteria the profile answered, out of all scoreable criteria. */
  coverage: { scored: number; of: number };
  /**
   * Weight the profile could score, out of the weight of every criterion
   * (scoreable or not). Under half → `thin` ("Few conditions can be checked
   * in advance") and never ranked above a route with fuller coverage (spec §4).
   */
  weight: { scored: number; of: number };
  thin: boolean;
  results: CriterionResult[];
  /** Paused or closed routes are listed, never ranked. */
  runnable: boolean;
};

export type ToUsd = (amount: number, currency: V2Currency) => number;

const MONEY: ProfileField[] = ['liquid', 'netWorth', 'investment', 'income', 'revenue'];
const WEIGHT_OF: Record<CriterionState, number> = { met: 1, close: 0.5, 'not-yet': 0, unscored: 0 };

const RANK: Record<CriterionState, number> = { met: 3, close: 2, 'not-yet': 1, unscored: 0 };

export function evaluate(c: Criterion, p: Profile, toUsd: ToUsd): CriterionState {
  if (!c.scoreable) return 'unscored';
  if (c.anyOf?.length) {
    // The best alternative decides; answered-but-failing beats skipped only when nothing better exists.
    const states = c.anyOf.map((t) => evaluateTest(t, c.closeAt, p, toUsd));
    const best = states.reduce((b, s) => (RANK[s] > RANK[b] ? s : b), 'not-yet' as CriterionState);
    if (best === 'met') return 'met';
    // A skipped alternative might be the one that is met, and untestable
    // alternatives (openEnded) might be too: only a met one can be trusted.
    if (c.openEnded || states.includes('unscored')) return 'unscored';
    return best;
  }
  if (!c.test) return 'unscored';
  return evaluateTest(c.test, c.closeAt, p, toUsd);
}

function evaluateTest(t: Test, closeAtIn: number | undefined, p: Profile, toUsd: ToUsd): CriterionState {
  const v = p[t.field];
  if (v === undefined || v === null || v === '') return 'unscored';
  const closeAt = closeAtIn ?? 0.8;

  switch (t.op) {
    case 'true':
      return v === true ? 'met' : 'not-yet';
    case 'in':
      return t.value.includes(String(v)) ? 'met' : 'not-yet';
    case 'between': {
      const n = Number(v);
      const [lo, hi] = t.value;
      if (n >= lo && n <= hi) return 'met';
      const band = (hi - lo) * 0.1 || 1;
      return n >= lo - band && n <= hi + band ? 'close' : 'not-yet';
    }
    case 'gte':
    case 'lte': {
      const n = Number(v);
      if (Number.isNaN(n)) return 'unscored';
      const thr = MONEY.includes(t.field) ? toUsd(t.value, t.currency ?? 'USD') : t.value;
      if (t.op === 'gte') return n >= thr ? 'met' : n >= thr * closeAt ? 'close' : 'not-yet';
      // An upper limit (age): close within half the gap closeAt leaves, e.g. 10% over.
      return n <= thr ? 'met' : n <= thr * (1 + (1 - closeAt) / 2) ? 'close' : 'not-yet';
    }
  }
}

export function match(route: RouteV2, p: Profile, toUsd: ToUsd): MatchResult {
  const runnable = route.status === 'open' || route.status === 'limited';
  const results = route.criteria.map((c) => ({ key: c.key, state: evaluate(c, p, toUsd), weight: c.weight }));
  const scoreable = route.criteria.filter((c) => c.scoreable && (c.test || c.anyOf?.length)).length;
  const scored = results.filter((r) => r.state !== 'unscored');
  const total = scored.reduce((s, r) => s + r.weight, 0);
  const got = scored.reduce((s, r) => s + r.weight * WEIGHT_OF[r.state], 0);
  const allWeight = route.criteria.reduce((s, c) => s + c.weight, 0);
  return {
    route: route.key,
    pct: runnable && total > 0 ? Math.round((got / total) * 100) : null,
    coverage: { scored: scored.length, of: scoreable },
    weight: { scored: total, of: allWeight },
    thin: total * 2 < allWeight,
    results,
    runnable,
  };
}

/**
 * Runnable routes with a %, best first. A route whose scored weight is under
 * half of all its criteria's weight (unscoreable included) sorts after the
 * well-covered ones, so one lucky answer cannot put it on top. Ties: the
 * family the user asked for, then fuller coverage.
 */
export function rank(routes: RouteV2[], p: Profile, toUsd: ToUsd, preferFamily?: RouteV2['family']): MatchResult[] {
  const byKey = new Map(routes.map((r) => [r.key, r]));
  return routes
    .map((r) => match(r, p, toUsd))
    .filter((m) => m.runnable && m.pct !== null)
    .sort((a, b) => {
      if (a.thin !== b.thin) return a.thin ? 1 : -1;
      if (a.pct !== b.pct) return (b.pct ?? 0) - (a.pct ?? 0);
      const fa = byKey.get(a.route)?.family === preferFamily ? 1 : 0;
      const fb = byKey.get(b.route)?.family === preferFamily ? 1 : 0;
      if (fa !== fb) return fb - fa;
      return b.weight.scored / b.weight.of - a.weight.scored / a.weight.of;
    });
}
