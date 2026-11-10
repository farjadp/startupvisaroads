import { describe, expect, it } from 'vitest';
import { certifiedQuestionFrom, dispositionFromJudgment, htmlToLines, parseDecisionHtml, parseDecisionText, remittedFromJudgment } from '../fc-parser';

// A synthetic decision laid out like the Court's PDFs (header, BETWEEN block,
// numbered paragraphs across a page break, JUDGMENT, solicitors of record).
// Names are invented.
const SYNTHETIC = `Date: 20990315
Docket: IMM-4242-98
Citation: 2099 FC 777
Ottawa, Ontario, March 15, 2099
PRESENT: The Honourable Madam Justice Example
BETWEEN:
KAVEH TESTPERSON
Applicant
and
THE MINISTER OF CITIZENSHIP AND
IMMIGRATION
Respondent
JUDGMENT AND REASONS
I. Overview
[1] The Applicant, Mr. Testperson, seeks judicial review of a refusal of his work permit
application under the start-up business stream.
II. Analysis
[2] The Officer said the language results were missing. They were on file. The finding is
Page: 2
unreasonable because it rests on a misreading of the record.
[3] The Court cannot follow the Officer’s reasoning on the funds.
A. Conclusion
[4] The application is allowed. Neither party proposed a question for certification.
JUDGMENT in IMM-4242-98
THIS COURT'S JUDGMENT is that:
1. The application for judicial review is allowed.
2. The matter is remitted for redetermination by a different officer.
3. There is no question for certification.
"A. Example"
Judge
FEDERAL COURT
SOLICITORS OF RECORD
DOCKET: IMM-4242-98
STYLE OF CAUSE: KAVEH TESTPERSON v THE MINISTER OF CITIZENSHIP AND IMMIGRATION
PLACE OF HEARING: TORONTO, ONTARIO`;

describe('parseDecisionText', () => {
  const p = parseDecisionText(SYNTHETIC);

  it('reads the header facts', () => {
    expect(p.citation).toBe('2099 FC 777');
    expect(p.courtFile).toBe('IMM-4242-98');
    expect(p.decisionDate).toBe('2099-03-15');
    expect(p.judge).toBe('Justice Example');
  });

  it('splits numbered paragraphs, joins page breaks and drops page headers', () => {
    expect(Object.keys(p.paragraphs).map(Number)).toEqual([1, 2, 3, 4]);
    expect(p.paragraphs[2]).toBe('The Officer said the language results were missing. They were on file. The finding is unreasonable because it rests on a misreading of the record.');
    expect(p.paragraphs[2]).not.toMatch(/Page:/);
  });

  it('keeps headings out of paragraph text and finds the analysis start', () => {
    expect(p.paragraphs[3]).toBe("The Court cannot follow the Officer's reasoning on the funds.");
    expect(p.headings.map((h) => h.text)).toContain('A. Conclusion');
    expect(p.analysisStartPara).toBe(2);
  });

  it('extracts the JUDGMENT block without the signature', () => {
    expect(p.judgmentText).toMatch(/^JUDGMENT in IMM-4242-98 THIS COURT'S JUDGMENT is that: 1\. The application for judicial review is allowed\./);
    expect(p.judgmentText).not.toMatch(/A\. Example"/);
    expect(p.paragraphs[4]).not.toMatch(/JUDGMENT/);
  });

  it('reads the certified question status', () => {
    expect(p.certifiedQuestionStatus).toBe('none');
    expect(p.certifiedQuestion).toBeNull();
  });

  it('keeps party names in memory only (never serialised)', () => {
    expect(p.private.partyNames).toContain('KAVEH TESTPERSON');
    expect(p.private.styleOfCause).toMatch(/TESTPERSON v THE MINISTER/);
    const json = JSON.stringify(p);
    expect(json).not.toMatch(/"private"/);
    expect(json).not.toMatch(/STYLE OF CAUSE|KAVEH TESTPERSON v/);
  });

  it('ignores bracketed numbers that are not the next paragraph', () => {
    const q = parseDecisionText('Citation: 2099 FC 1\n[1] First, citing [2019] 4 SCR 653.\n[3] not a paragraph start\n[2] Second.');
    expect(q.paragraphs).toEqual({ 1: 'First, citing [2019] 4 SCR 653. [3] not a paragraph start', 2: 'Second.' });
  });
});

describe('parseDecisionHtml', () => {
  it('parses the same structure from HTML blocks and entities', () => {
    const html = '<html><body><p>Citation: 2099 FC 5</p><p>[1] The&nbsp;Officer&rsquo;s reasons.</p><p>[2] Second <b>para</b>.</p><p>JUDGMENT in IMM-1-99</p><p>THIS COURT&#39;S JUDGMENT is that the application is dismissed. No question is certified.</p></body></html>';
    const p = parseDecisionHtml(html);
    expect(p.paragraphs).toEqual({ 1: "The Officer's reasons.", 2: 'Second para.' });
    expect(dispositionFromJudgment(p.judgmentText ?? '')).toBe('dismissed');
    expect(htmlToLines('<p>a</p><p>b</p>').split('\n').filter(Boolean)).toEqual(['a', 'b']);
  });
});

describe('dispositionFromJudgment', () => {
  it('allowed (granted / allowed / set aside)', () => {
    expect(dispositionFromJudgment('THIS COURT’S JUDGMENT is that this application is granted; the decision is set aside.')).toBe('allowed');
    expect(dispositionFromJudgment('1. The application for judicial review is allowed. 2. No question is certified.')).toBe('allowed');
    expect(dispositionFromJudgment('1. The judicial review application is granted.')).toBe('allowed');
    expect(dispositionFromJudgment('The decision of the Officer is set aside and the matter is returned for redetermination.')).toBe('allowed');
  });

  it('mandamus: "the application ... and the request for mandamus is granted / dismissed" (2026 FC 1370 wording)', () => {
    expect(dispositionFromJudgment('1. The application for judicial review and the request for an order of mandamus is granted. 2. A decision shall be rendered on the Applicant\'s application within 90 days of this judgment.')).toBe('allowed');
    expect(dispositionFromJudgment('1. The application for judicial review and the request for a writ of mandamus is dismissed.')).toBe('dismissed');
    expect(dispositionFromJudgment('The application for leave and judicial review and the application for mandamus are granted.')).toBe('allowed');
  });

  it('dismissed', () => {
    expect(dispositionFromJudgment('1. The application for judicial review is dismissed. 2. No question is certified.')).toBe('dismissed');
    expect(dispositionFromJudgment('THIS COURT ORDERS that the Application for Judicial Review is dismissed.')).toBe('dismissed');
  });

  it('allowed in part', () => {
    expect(dispositionFromJudgment('The application for judicial review is allowed in part.')).toBe('allowed_in_part');
    expect(dispositionFromJudgment('The application is partially granted.')).toBe('allowed_in_part');
  });

  it('consent', () => {
    expect(dispositionFromJudgment('On consent of the parties, the application for judicial review is allowed.')).toBe('consent');
    expect(dispositionFromJudgment('UPON the parties having consented, THIS COURT ORDERS that the application is allowed.')).toBe('consent');
  });

  it('unknown when both or neither', () => {
    expect(dispositionFromJudgment('The application in IMM-1-99 is allowed. The application in IMM-2-99 is dismissed.')).toBe('unknown');
    expect(dispositionFromJudgment('The hearing is adjourned.')).toBe('unknown');
    expect(dispositionFromJudgment('')).toBe('unknown');
  });
});

describe('remitted and certified question', () => {
  it('remitted', () => {
    expect(remittedFromJudgment('the decision is set aside and is to be considered by a different officer')).toBe(true);
    expect(remittedFromJudgment('The matters will be remitted for redetermination by an Immigration Officer')).toBe(true);
    expect(remittedFromJudgment('the matter is returned for redetermination by a different IRCC Officer')).toBe(true);
    expect(remittedFromJudgment('The application for judicial review is dismissed.')).toBe(false);
  });

  it('certified question', () => {
    expect(certifiedQuestionFrom('3. No question of general importance is certified.')).toEqual({ status: 'none', question: null });
    expect(certifiedQuestionFrom('and no question is certified.')).toEqual({ status: 'none', question: null });
    expect(certifiedQuestionFrom('2. There is no question for certification.')).toEqual({ status: 'none', question: null });
    const c = certifiedQuestionFrom('1. The application is dismissed. 2. The following question is certified: Does paragraph 89(b) apply to work permits? 3. No costs.');
    expect(c.status).toBe('certified');
    expect(c.question).toBe('Does paragraph 89(b) apply to work permits?');
    expect(certifiedQuestionFrom('1. The application is dismissed.').status).toBe('unknown');
  });
});
