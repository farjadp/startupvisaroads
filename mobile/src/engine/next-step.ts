// What Home ("Today") leads with (spec 2026-11-09 §6, amendment 6). Pure, so it
// is tested without React: the first followed route the user can run that
// still has an unticked road-map step; else, when every followed route is shut
// (paused, closed or closed to their passport), say so; else the best match of
// the last assessment, never a blocked route; else nothing yet.
import type { Step } from '../../../lib/routes-v2/extras-types.ts';
import type { MatchResult } from '../../../lib/routes-v2/match.ts';
import type { RouteV2 } from '../../../lib/routes-v2/types.ts';

export type NextStep =
  | { kind: 'step'; routeKey: string; stepIndex: number; stepCount: number; step: Step }
  /** Every runnable followed route has all its steps ticked. */
  | { kind: 'all-done'; routeKey: string }
  | { kind: 'all-blocked' }
  | { kind: 'best-match'; routeKey: string; close: number }
  | { kind: 'fresh' };

export type NextStepInput = {
  following: string[];
  journey: Record<string, string[]>;
  /** Citizenship code from the assessment, or null when skipped / not answered. */
  passport: string | null;
  /** The last assessment ranked (match.ts `rank`), or null when not assessed. */
  ranked: MatchResult[] | null;
  routeOf: (key: string) => Pick<RouteV2, 'key' | 'status' | 'blockedCitizenships'> | undefined;
  stepsOf: (key: string) => Step[] | undefined;
};

export function isRunnable(route: Pick<RouteV2, 'status' | 'blockedCitizenships'>, passport: string | null): boolean {
  const open = route.status === 'open' || route.status === 'limited';
  return open && !(passport && route.blockedCitizenships?.codes.includes(passport));
}

export function nextStep({ following, journey, passport, ranked, routeOf, stepsOf }: NextStepInput): NextStep {
  const followed = following.map(routeOf).filter((r) => !!r);
  const runnable = followed.filter((r) => isRunnable(r, passport));

  for (const r of runnable) {
    const steps = stepsOf(r.key) ?? [];
    const ticked = new Set(journey[r.key] ?? []);
    const stepIndex = steps.findIndex((s) => !ticked.has(s.key));
    if (stepIndex >= 0) return { kind: 'step', routeKey: r.key, stepIndex, stepCount: steps.length, step: steps[stepIndex] };
  }
  if (runnable.length) return { kind: 'all-done', routeKey: runnable[0].key };
  if (followed.length) return { kind: 'all-blocked' };

  if (ranked) {
    // rank() already drops blocked routes; checked again so a blocked route can never be offered.
    const best = ranked.find((m) => {
      const r = routeOf(m.route);
      return m.runnable && !m.blocked && !!r && isRunnable(r, passport);
    });
    if (best) return { kind: 'best-match', routeKey: best.route, close: best.results.filter((c) => c.state === 'close').length };
  }
  return { kind: 'fresh' };
}
