// Glue between the pure engines and the screens: which road, its checks,
// its readiness, and the other roads that fit.
import { recommendPath, type PathId } from '@shared/fa/path-quiz';
import { RATES_TO_CAD } from '@shared/fa/programmes';
import { CHECKLIST, type StepId } from '@/content/checklist';
import { ROUTE_ORDER, ruleFor, type RouteKey } from '@/content/routes';
import { checksFor, completeAnswers, gapOf, levelOf, readiness, type Check, type PathfinderGap, type QuizKey, type StoredAnswers } from './readiness';

export type Outcome = RouteKey | 'too-early';

const PATH_TO_ROUTE: Record<PathId, Outcome> = {
  finland: 'finland',
  denmark: 'denmark',
  netherlands: 'netherlands',
  estonia: 'estonia',
  italy: 'italy',
  turkey: 'turkey',
  // The site's quiz sends Atlantic Canada to the New Brunswick guide; Nova Scotia appears among the other roads.
  atlantic: 'new-brunswick',
  eb2niw: 'eb2niw',
  'too-early': 'too-early',
};

export function outcomeFor(stored: StoredAnswers): { outcome: Outcome; skipped: QuizKey[] } {
  const { answers, skipped } = completeAnswers(stored);
  return { outcome: PATH_TO_ROUTE[recommendPath(answers).path], skipped };
}

export type RoadView = {
  key: RouteKey;
  checks: Check[];
  gaps: PathfinderGap[];
  steps: StepId[];
  stepsDone: StepId[];
  score: number;
  noThresholds: boolean;
  level: ReturnType<typeof levelOf>;
};

export function roadView(
  key: RouteKey,
  stored: StoredAnswers,
  done: StepId[] = [],
  engagement: { sourceOpened: boolean; newsRead: boolean },
): RoadView {
  const { answers } = completeAnswers(stored);
  const rule = ruleFor(key);
  const { checks, gaps } = rule ? checksFor(rule, answers, RATES_TO_CAD) : { checks: [], gaps: [] };
  const steps = CHECKLIST[key];
  const stepsDone = steps.filter((s) => done.includes(s));
  const r = readiness(checks, stepsDone.length, steps.length, engagement);
  return { key, checks, gaps, steps, stepsDone, score: r.score, noThresholds: r.noThresholds, level: levelOf(r.score) };
}

/** Up to three other roads with at most one condition not yet met; the gap is counted in conditions, never as a score race. */
export function otherRoads(primary: Outcome, stored: StoredAnswers): { key: RouteKey; notYet: number; close: number }[] {
  const { answers } = completeAnswers(stored);
  return ROUTE_ORDER.filter((k) => k !== primary && k !== 'eb2niw')
    .map((k) => {
      const rule = ruleFor(k)!;
      const { checks } = checksFor(rule, answers, RATES_TO_CAD);
      return { key: k, ...gapOf(checks), scored: checks.length };
    })
    .filter((r) => r.scored > 0 && r.notYet <= 1)
    .sort((a, b) => a.notYet - b.notYet || a.close - b.close)
    .slice(0, 3)
    .map(({ key, notYet, close }) => ({ key, notYet, close }));
}
