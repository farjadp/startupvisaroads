import { describe, expect, it } from 'vitest';
import {
  MAX_PAGES,
  PAGE_SIZE,
  contactFor,
  isRoleAddress,
  matchRule,
  monthStart,
  nextStep,
  profileCheck,
  quizPassed,
  quotaFor,
  rankCandidates,
  tierOf,
} from '@/lib/rcip-finder/core';
import { clbFor, searchOccupations, teerOf } from '@/lib/rcip-finder/occupations';
import { TABLES } from '@/lib/rcip-finder/core';

describe('occupations', () => {
  it('finds curated occupations in Persian and English, and any NOC by code', () => {
    expect(searchOccupations('جوشکار', TABLES.nocs)[0].noc).toBe('72106');
    expect(searchOccupations('weld', TABLES.nocs)[0].noc).toBe('72106');
    expect(searchOccupations('PSW', TABLES.nocs).map((h) => h.noc)).toContain('33102');
    expect(searchOccupations('7310', TABLES.nocs).some((h) => h.noc.startsWith('7310'))).toBe(true);
    expect(searchOccupations('a', TABLES.nocs)).toEqual([]);
  });

  it('folds Arabic letter forms so ي and ك still match', () => {
    expect(searchOccupations('آشپز', TABLES.nocs)[0].noc).toBe('63200');
    expect(searchOccupations('كمك‌آشپز', TABLES.nocs).map((h) => h.noc)).toContain('65201');
  });

  it('reads TEER from the second digit and maps it to the IRCC language minimum', () => {
    expect(teerOf('72106')).toBe(2);
    expect(clbFor(0)).toBe(6);
    expect(clbFor(1)).toBe(6);
    expect(clbFor(2)).toBe(5);
    expect(clbFor(3)).toBe(5);
    expect(clbFor(4)).toBe(4);
    expect(clbFor(5)).toBe(4);
    expect(teerOf('7210')).toBeNull();
  });
});

describe('matching', () => {
  const rule = matchRule('72106');

  it('uses business-type keywords and the industries that post the job nationally', () => {
    expect(rule.core).toContain('welding');
    expect(rule.sectors[0]).toBe('31-33');
  });

  it('puts the main-work tier first, then advertised communities, closed listings last', () => {
    const c = (id: string, community: string, bt: string, sector: string | null, closedNote: string | null = null) => ({ id, community, name: id, businessTypeNorm: bt, sector, closedNote });
    const ranked = rankCandidates(
      [
        c('trailer', 'West Kootenay', 'trailer manufacturing', '31-33'),
        c('weld-closed', 'Sudbury', 'welding shop', '31-33', 'excluded'),
        c('weld-tb', 'Thunder Bay', 'welding shop', '23'),
        c('weld-sud', 'Sudbury', 'metal fabrication', '23'),
        c('pizza', 'Sudbury', 'pizza restaurant', '72'),
      ],
      rule,
    );
    expect(ranked.map((r) => r.id)).toEqual(['weld-sud', 'weld-closed', 'weld-tb', 'trailer']);
    expect(ranked[0].communityPostings).toBeGreaterThan(0);
    expect(tierOf({ businessTypeNorm: 'pizza restaurant', sector: '72' }, rule)).toBeNull();
  });

  it('caps a query at ten pages of twenty', () => {
    expect(PAGE_SIZE * MAX_PAGES).toBe(200);
  });

  it('checks language and experience against IRCC minimums without judging eligibility', () => {
    const p = profileCheck('72106', 4, 'lt1');
    expect(p.clbNeeded).toBe(5);
    expect(p.clbMeets).toBe(false);
    expect(p.experienceMeets).toBe(false);
    expect(profileCheck('72106', 5, '3plus')).toMatchObject({ clbMeets: true, experienceMeets: true });
  });
});

describe('contact policy', () => {
  const row = (contactSource: string, emails: string[], community = 'Sudbury') => ({
    community, contactSource, website: 'https://x.example', phone: '705 555 0100', emails: JSON.stringify(emails),
  });

  it('shows everything held under "all"', () => {
    expect(contactFor(row('ai_low', ['jane.doe@x.example']), 'all', [])?.emails).toEqual(['jane.doe@x.example']);
  });

  it('under "safe" drops named emails unless the community published them, low-confidence rows and blocked communities', () => {
    expect(contactFor(row('ai_verify', ['jane.doe@x.example', 'careers@x.example']), 'safe', [])?.emails).toEqual(['careers@x.example']);
    expect(contactFor(row('source_list', ['jane.doe@x.example']), 'safe', [])?.emails).toEqual(['jane.doe@x.example']);
    expect(contactFor(row('ai_low', ['info@x.example']), 'safe', [])).toBeNull();
    expect(contactFor(row('ai_verify', ['info@x.example'], 'Moose Jaw'), 'safe', ['Moose Jaw'])).toBeNull();
  });

  it('shows nothing under "off" or when no contact is held', () => {
    expect(contactFor(row('ai_verify', ['info@x.example']), 'off', [])).toBeNull();
    expect(contactFor({ community: 'Sudbury', contactSource: 'none', website: null, phone: null, emails: '[]' }, 'all', [])).toBeNull();
  });

  it('recognises role addresses', () => {
    expect(isRoleAddress('hr@x.ca')).toBe(true);
    expect(isRoleAddress('careers.sudbury@x.ca')).toBe(true);
    expect(isRoleAddress('john@x.ca')).toBe(false);
  });
});

describe('steps and quota', () => {
  it('opens one reveal per completed step, five at most, in order', () => {
    expect(quotaFor([])).toBe(0);
    expect(quotaFor(['account', 'profile'])).toBe(2);
    expect(quotaFor(['account', 'profile', 'guide', 'quiz', 'pledge', 'other'])).toBe(5);
    expect(nextStep(['account'])).toBe('profile');
    expect(nextStep(['account', 'profile', 'guide', 'quiz', 'pledge'])).toBeNull();
  });

  it('counts the month from the first day, UTC', () => {
    expect(monthStart(new Date('2026-11-26T15:00:00Z')).toISOString()).toBe('2026-11-01T00:00:00.000Z');
  });

  it('passes the quiz only with all three right', () => {
    expect(quizPassed({ q1: 'full', q2: 'clb5', q3: 'designated' })).toBe(true);
    expect(quizPassed({ q1: 'full', q2: 'clb4', q3: 'designated' })).toBe(false);
    expect(quizPassed(null)).toBe(false);
  });
});
