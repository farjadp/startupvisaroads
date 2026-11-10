import { describe, expect, it } from 'vitest';
import { asOutcome, courtOutcome, isFavourable } from '../outcomes';
import { COPY } from '../../../components/case-studies/copy';

describe('court outcomes', () => {
  it('a mandamus judgment is a delay outcome, not "sent back"', () => {
    const j = '1. The application for judicial review and the request for an order of mandamus is granted. 2. A decision shall be rendered on the Applicant\'s application within 90 days of this judgment.';
    expect(courtOutcome('allowed', j)).toBe('mandamus_granted');
    expect(courtOutcome('dismissed', 'The application for judicial review and the request for a writ of mandamus is dismissed.')).toBe('mandamus_refused');
  });
  it('an ordinary judicial review keeps allowed / dismissed', () => {
    expect(courtOutcome('allowed', 'The application is granted; the decision is set aside.')).toBe('allowed');
    expect(courtOutcome('dismissed', 'The application for judicial review is dismissed.')).toBe('dismissed');
    expect(courtOutcome('allowed', null)).toBe('allowed');
  });
  it('accepts only known values and marks who won', () => {
    expect(asOutcome('mandamus_granted')).toBe('mandamus_granted');
    expect(asOutcome('granted')).toBeNull();
    expect(isFavourable('mandamus_granted')).toBe(true);
    expect(isFavourable('mandamus_refused')).toBe(false);
  });
  it('every outcome has a label and a line in both languages; mandamus never says "sent back"', () => {
    for (const lang of ['en', 'fa'] as const) {
      for (const o of ['allowed', 'dismissed', 'mandamus_granted', 'mandamus_refused'] as const) {
        expect(COPY[lang].outcomeLabel[o]).toBeTruthy();
        expect(COPY[lang].outcomeLine[o]).toBeTruthy();
      }
    }
    expect(COPY.en.outcomeLine.mandamus_granted).not.toMatch(/sent back|different officer/i);
    expect(COPY.fa.outcomeLine.mandamus_granted).not.toMatch(/افسر دیگری/);
  });
});

import { lintFa } from '../persian-lint';
describe('fa lint: mandamus is not damages', () => {
  it('flags «جبران خسارت» next to مانداموس (2026 FC 1370 draft v1)', () => {
    expect(lintFa('دستور مانداموس یک جبران خسارت یا حکم اختیاری از سوی دادگاه است.').some((i) => i.rule === 'mandamus-damages')).toBe(true);
    expect(lintFa('دستور مانداموس یک راهکار قضایی اختیاری است.').some((i) => i.rule === 'mandamus-damages')).toBe(false);
  });
});
