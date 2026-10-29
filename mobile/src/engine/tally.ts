// The route page's status tally (layout A trim, 27 Oct 2026): how many of a
// route's conditions the assessment found met, close or not yet, and how many
// it could not check here (skipped answers and every condition only the
// authority decides). Pure and type-only, so node --test can run it.
import type { CriterionResult, CriterionState } from '../../../lib/routes-v2/match.ts';

export type Tally = { met: number; close: number; notYet: number; unchecked: number };

export function tally(results: { state: CriterionState }[]): Tally {
  const out: Tally = { met: 0, close: 0, notYet: 0, unchecked: 0 };
  for (const r of results) {
    if (r.state === 'met') out.met++;
    else if (r.state === 'close') out.close++;
    else if (r.state === 'not-yet') out.notYet++;
    else out.unchecked++;
  }
  return out;
}

/** Each condition's status by key, for the rows under "The rules". */
export function statusByKey(results: CriterionResult[]): Map<string, CriterionState> {
  return new Map(results.map((r) => [r.key, r.state]));
}
