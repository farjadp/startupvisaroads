// ============================================================================
// lib/case-studies/outcomes.ts
// Court outcomes a case can carry. Kept free of server imports so components
// can use it. allowed / dismissed: a judicial review of a decision (a refusal
// is set aside and sent back, or it stands). mandamus_*: a delay case, where
// the Court orders (or refuses to order) IRCC to decide; nothing is sent back.
// ============================================================================
export type CaseOutcome = 'allowed' | 'dismissed' | 'mandamus_granted' | 'mandamus_refused';

export const CASE_OUTCOMES: readonly CaseOutcome[] = ['allowed', 'dismissed', 'mandamus_granted', 'mandamus_refused'];

/** The applicant won: drawn with the hollow circle. */
export const isFavourable = (o: CaseOutcome): boolean => o === 'allowed' || o === 'mandamus_granted';

export const asOutcome = (o: string | null | undefined): CaseOutcome | null =>
  (CASE_OUTCOMES as readonly string[]).includes(o ?? '') ? (o as CaseOutcome) : null;

/**
 * Outcome for a parsed decision. A JUDGMENT block that rules on a request for
 * mandamus is a delay case: it orders a decision (or refuses to); it does not
 * set a refusal aside, so it must not read as "sent back to an officer".
 */
export function courtOutcome(disposition: 'allowed' | 'dismissed', judgmentText: string | null | undefined): CaseOutcome {
  const mandamus = /\bmandamus\b/i.test(judgmentText ?? '');
  if (disposition === 'allowed') return mandamus ? 'mandamus_granted' : 'allowed';
  return mandamus ? 'mandamus_refused' : 'dismissed';
}
