// Learning points (spec 2026-10-27 road map, Farjad's weighting): preparing
// counts more than quizzing. Points are derived from what is ticked, never
// stored, so unticking removes them, and they never touch the match %.
// Pure (extras come in as a lookup) so node:test runs it without the app's aliases.
import type { RouteExtras } from '../../../lib/routes-v2/extras-types.ts';

export type ExtrasLookup = (routeKey: string) => RouteExtras | undefined;

export const POINTS = { step: 10, doc: 5, quizRight: 5 } as const;

export type Progress = {
  journey: Record<string, string[]>;
  docs: Record<string, string[]>;
  quizBest: Record<string, { right: number; of: number }>;
};

/** Only keys that still exist in the route's data count (a renamed step drops out). */
function counted(routeKey: string, p: Progress, extrasOf: ExtrasLookup) {
  const e = extrasOf(routeKey);
  const stepKeys = new Set(e?.steps?.map((s) => s.key));
  const docKeys = new Set(e?.documents?.map((d) => d.key));
  const steps = (p.journey[routeKey] ?? []).filter((k) => stepKeys.has(k)).length;
  const docs = (p.docs[routeKey] ?? []).filter((k) => docKeys.has(k)).length;
  const right = p.quizBest[routeKey]?.right ?? 0;
  return { steps, docs, right, stepsOf: stepKeys.size, docsOf: docKeys.size, quizOf: e?.quiz?.length ?? 0 };
}

export function routePoints(routeKey: string, p: Progress, extrasOf: ExtrasLookup): number {
  const c = counted(routeKey, p, extrasOf);
  return c.steps * POINTS.step + c.docs * POINTS.doc + c.right * POINTS.quizRight;
}

export type RoadBadge = 'knows' | 'papers' | 'walked';

/** Badges for real milestones only: quiz all right, every document ticked, every step ticked. */
export function routeBadges(routeKey: string, p: Progress, extrasOf: ExtrasLookup): RoadBadge[] {
  const c = counted(routeKey, p, extrasOf);
  const out: RoadBadge[] = [];
  if (c.quizOf > 0 && c.right === c.quizOf) out.push('knows');
  if (c.docsOf > 0 && c.docs === c.docsOf) out.push('papers');
  if (c.stepsOf > 0 && c.steps === c.stepsOf) out.push('walked');
  return out;
}

/** Every route the user has touched, with its points; for the Me tab. */
export function allPoints(p: Progress, extrasOf: ExtrasLookup): { total: number; routes: { key: string; points: number; badges: RoadBadge[] }[] } {
  const keys = [...new Set([...Object.keys(p.journey), ...Object.keys(p.docs), ...Object.keys(p.quizBest)])];
  const routes = keys
    .map((key) => ({ key, points: routePoints(key, p, extrasOf), badges: routeBadges(key, p, extrasOf) }))
    .filter((r) => r.points > 0 || r.badges.length > 0)
    .sort((a, b) => b.points - a.points);
  return { total: routes.reduce((s, r) => s + r.points, 0), routes };
}
