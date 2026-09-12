// ============================================================================
// lib/__tests__/canada-suv.test.ts
// Locks the Canada Start-up Visa facts to what canada.ca says, and locks out
// the specific wrong claims this repo has already shipped once.
//
// Two kinds of test here. The first checks lib/canada-suv.ts against IRCC's
// published figures. The second greps the actual pages, because the failures
// that mattered were not bad constants — they were correct constants sitting
// next to hardcoded prose that contradicted them: a settlement-funds figure
// stated three different ways, a "closed work permit" where IRCC says open,
// and an answer-engine page calling the programme «فعال» two lines after
// saying it was closed.
// ============================================================================
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  SUV_ORGS,
  SUV_RULES,
  SUV_SETTLEMENT_FUNDS,
  SUV_SETTLEMENT_FUNDS_UPDATED,
  SUV_SOURCES,
  SUV_STATE,
  SUV_UNOFFICIAL,
  settlementFundsFor,
} from '../canada-suv';

// ---------------------------------------------------------------------------
// The constants, against IRCC's own tables
// ---------------------------------------------------------------------------
describe('SUV facts match canada.ca', () => {
  it('states the pause with IRCC’s own date and word', () => {
    expect(SUV_STATE.label).toBe('Paused');
    expect(SUV_STATE.pausedOn).toBe('2026-06-30');
    expect(SUV_STATE.lastIntake).toEqual({ certificateYear: 2025, filingDeadline: '2026-06-30' });
    expect(SUV_STATE.certificateCutoff).toBe('2026-01-01');
    expect(SUV_STATE.certificateFilingWindowMonths).toBe(6);
    expect(SUV_STATE.inFlightStillProcessed).toBe(true);
  });

  it('keeps the open work permit available and the extension closed to new applicants', () => {
    // These two travel together. Splitting them is how the English page came
    // to say "closed Work Permit" while IRCC said the opposite.
    expect(SUV_STATE.openWorkPermit.availableWhileProcessing).toBe(true);
    expect(SUV_STATE.openWorkPermit.extensionClosedToNewApplicants).toBe(true);
  });

  it('carries the settlement-funds table verbatim', () => {
    expect(SUV_SETTLEMENT_FUNDS).toEqual({ 1: 15_263, 2: 19_001, 3: 23_360, 4: 28_362, 5: 32_168, 6: 36_280, 7: 40_392 });
    expect(SUV_SETTLEMENT_FUNDS_UPDATED).toBe('2025-07-29');
    expect(settlementFundsFor(4)).toBe(28_362);
    expect(settlementFundsFor(8)).toBe(40_392 + 4_112);
    expect(settlementFundsFor(9)).toBe(40_392 + 2 * 4_112);
    expect(settlementFundsFor(0)).toBe(15_263); // never returns undefined
  });

  it('carries the eligibility and organisation rules', () => {
    expect(SUV_RULES.minVotingRightsPerApplicant).toBe(10);
    expect(SUV_RULES.minCombinedVotingRights).toBe(50);
    expect(SUV_RULES.maxOwnersPerBusiness).toBe(5);
    expect(SUV_RULES.language.benchmark).toBe(5);
    expect(SUV_RULES.language.abilities).toHaveLength(4);
    expect(SUV_RULES.excludesQuebec).toBe(true);
    expect(SUV_ORGS.ventureCapitalMinimum).toBe(200_000);
    expect(SUV_ORGS.angelMinimum).toBe(75_000);
    expect(SUV_ORGS.incubatorPriorityCommittedCapital).toBe(75_000);
    expect(SUV_ORGS.groupApplicationsPerOrganisationPerYear).toBe(10);
    expect(SUV_ORGS.capInForceSince).toBe('2024-04-01');
  });

  it('publishes no processing time, because IRCC does not', () => {
    const source = readFileSync(join(process.cwd(), 'lib/canada-suv.ts'), 'utf8');
    // A months/years figure in this file would be invented. The only numbers
    // allowed near "month" are the certificate filing window and the
    // explicitly-unofficial reported target.
    expect(source).not.toMatch(/processingTime|avgProcessing|processingMonths/);
  });

  it('keeps the replacement pilot marked unpublished, with its figures attributed', () => {
    expect(SUV_UNOFFICIAL.officialDetailsPublished).toBe(false);
    expect(SUV_UNOFFICIAL.reportedOnly.attribution).toMatch(/press/i);
  });

  it('cites only canada.ca', () => {
    for (const url of Object.values(SUV_SOURCES)) {
      expect(url).toMatch(/^https:\/\/www\.canada\.ca\//);
    }
  });
});

// ---------------------------------------------------------------------------
// The pages, against the claims we have already had to remove once
// ---------------------------------------------------------------------------
function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name === '.git') continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx|json)$/.test(name) && !full.includes('__tests__')) out.push(full);
  }
  return out;
}

const ROOTS = ['app', 'components', 'content', 'lib', 'messages'];
const FILES = ROOTS.flatMap((r) => walk(join(process.cwd(), r))).map((path) => ({
  path: path.replace(`${process.cwd()}/`, ''),
  text: readFileSync(path, 'utf8'),
}));

const hits = (re: RegExp) => FILES.filter((f) => re.test(f.text)).map((f) => f.path);

describe('no page contradicts the SUV facts', () => {
  it('never offers a "closed work permit" for the Start-up Visa — IRCC says open', () => {
    // Scoped to SUV surfaces on purpose: Start-up Denmark's permit really is
    // a closed one, and that page is right to say so.
    const suv = FILES.filter((f) => /startup-visa-canada|canada-startup-visa|startupworkpermit/.test(f.path));
    expect(suv.filter((f) => /closed\s+work\s+permit/i.test(f.text)).map((f) => f.path)).toEqual([]);
  });

  it('quotes no success rate of our own', () => {
    // House rule: no company performance figures on the site. These exact
    // claims shipped once — a "98% / Success Rate" stat block, a "98% /
    // Approval Rate" one, and "we see a 95%+ probability".
    //
    // A stat block that NAMES ITS SOURCE is a different thing and stays:
    // the Finland page carries «~8% · Approval Rate · Business Finland,
    // 2024–2025», which is the programme's own published rate, cited. So the
    // rule is not "no percentages" — it is "no percentage about how well we
    // or an application does, with nothing behind it".
    const LABEL = /\d{1,3}\s*%[^\n]{0,60}(?:Success|Approval)\s+Rate|(?:Success|Approval)\s+Rate[^\n]{0,60}\d{1,3}\s*%/;
    const ATTRIBUTED = /\b(?:sub|source|cite|citation|per|according)\b\s*[:=]|Business Finland|IRCC|Migri|RVO|PIBA|Home Affairs|Statistics Canada/i;
    const unattributed: string[] = [];
    for (const f of FILES) {
      for (const line of f.text.split('\n')) {
        if (LABEL.test(line) && !ATTRIBUTED.test(line)) unattributed.push(`${f.path}: ${line.trim().slice(0, 80)}`);
      }
    }
    expect(unattributed).toEqual([]);

    // Our own odds, in any wording, carry no number.
    expect(hits(/\d{1,3}\s*%\s*\+?\s*(?:probability|chance)\b/i)).toEqual([]);
    expect(hits(/probability[^\n]{0,20}\d{1,3}\s*%/i)).toEqual([]);
  });

  it('states no processing time for the Start-up Visa', () => {
    // The figures that were live: "32+ Months", "30-40 Month Wait",
    // "12-18 months", "2-3 Years", "30+ months", "بالای سه سال".
    const suvFiles = FILES.filter((f) => /start-?up\s*visa|ویزای استارتاپ|\bSUV\b/i.test(f.text));
    const offenders = suvFiles.filter((f) =>
      /(?:\d{1,3}\s*\+?\s*(?:-|–|to|تا)\s*\d{1,3}\s*(?:month|mo\b|ماه)|\d{2,3}\s*\+\s*(?:month|ماه))/i.test(f.text) &&
      /start-?up\s*visa|ویزای استارتاپ|\bSUV\b/i.test(f.text),
    );
    // Allowed: files that name another programme's published timeline. None
    // of the SUV surfaces should carry a month range at all.
    const suvSurfaces = offenders.filter((f) =>
      /startup-visa-canada|canada-startup-visa|startupworkpermit|country\/canada|landing/.test(f.path),
    );
    expect(suvSurfaces.map((f) => f.path)).toEqual([]);
  });

  it('never calls the programme active, open or merely capped', () => {
    expect(hits(/برنامه‌ی رسمی و فعال/)).toEqual([]);
    expect(hits(/Capped\s*\/\s*Waitlist/i)).toEqual([]);
    expect(hits(/2026\s+allocation/i)).toEqual([]);
  });

  it('uses the current pause date, not the superseded 2025 intake dates', () => {
    // ۳۱ دسامبر ۲۰۲۵ and ۱۹ دسامبر ۲۰۲۵ were the old Persian framing. The
    // work-permit one was worse than stale: it told a reader with a pending
    // file that the open work permit was gone.
    expect(hits(/۱۹ دسامبر ۲۰۲۵/)).toEqual([]);
    expect(hits(/از ۳۱ دسامبر ۲۰۲۵ پرونده/)).toEqual([]);
  });

  it('never sells a relationship with a designated organisation', () => {
    // The site's own Persian pages call this a scam marker.
    expect(hits(/deep\s+relationships\s+with\s+Incubators/i)).toEqual([]);
    expect(hits(/SUV\s+Direct\s+Stream/i)).toEqual([]);
  });

  it('attributes the reported pilot figures wherever they appear', () => {
    // Only the written forms — a bare 2000 in code is a timeout, not a cap.
    // "2,000-word article" is a word count, not a cap.
    // Only the written forms — a bare 2000 in code is a timeout, not a cap —
    // and only on reader-facing surfaces: an engine comment listing example
    // figures is documentation, not a claim made to a reader.
    const written = [/۲٬۰۰۰/, /\b2,000\b(?!\s*-?\s*word)/];
    for (const f of FILES.filter((x) => /^(app|components|content|messages)\//.test(x.path))) {
      if (!written.some((re) => re.test(f.text))) continue;
      if (!/start-?up\s*visa|ویزای استارتاپ|پایلوت|pilot/i.test(f.text)) continue;
      // Any file quoting the cap must also say who reported it.
      expect(f.text, `${f.path} quotes the pilot cap without attribution`).toMatch(
        /گزارش رسانه|رسانه‌های تخصصی|trade-press|trade press|reportedOnly|SUV_UNOFFICIAL/,
      );
    }
  });
});
