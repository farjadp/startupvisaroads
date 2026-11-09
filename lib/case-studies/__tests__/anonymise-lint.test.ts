import { describe, expect, it } from 'vitest';
import { findPii, nameTokens, redact } from '../anonymise';
import { faParaRef, lintFa, normaliseFaForMatching } from '../persian-lint';

// All personal data below is planted and invented.
describe('anonymiser: planted data', () => {
  const names = ['KAVEH TESTPERSON', 'Shirin Example-Nadi', 'شیرین نمونه'];

  it('splits names into tokens and drops style-of-cause words', () => {
    expect(nameTokens(['KAVEH TESTPERSON v THE MINISTER OF CITIZENSHIP AND IMMIGRATION'])).toEqual(['TESTPERSON', 'KAVEH']);
  });

  it('finds names by token, any case, en and fa', () => {
    const kinds = findPii('Mr. Testperson met kaveh and Ms. Nadi; شیرین گفت', { mode: 'A', names }).map((f) => [f.kind, f.match]);
    expect(kinds).toEqual([['name', 'Testperson'], ['name', 'kaveh'], ['name', 'Nadi'], ['name', 'شیرین']]);
  });

  it('matches Persian names written with Arabic letters', () => {
    expect(findPii('شيرين آمد', { mode: 'A', names }).map((f) => f.kind)).toEqual(['name']);
  });

  it('finds initials but not U.S./B.C.', () => {
    const f = findPii('The applicant K.T. lives in B.C., not the U.S.; Mr. K said so.', { mode: 'A' });
    expect(f.map((x) => x.match)).toEqual(['K.T.', 'Mr. K']);
    expect(findPii('آقای ک. گفت و ش. ن. نوشت', { mode: 'A' }).filter((x) => x.kind === 'initials')).toHaveLength(2);
  });

  it('finds UCI, application, passport, receipt numbers and contacts', () => {
    const text = 'UCI: 11-2233-4455, application W307123456, passport K12345678, receipt no. RC-998877, email a.b@example.com, phone +1 416 555 0199, @kaveh_founder, instagram.com/kavehx';
    const kinds = findPii(text, { mode: 'A' }).map((f) => f.kind);
    for (const k of ['uci', 'application_number', 'passport', 'receipt', 'email', 'phone', 'handle', 'social_url']) expect(kinds).toContain(k);
  });

  it('finds Persian-digit identifiers', () => {
    expect(findPii('شماره پرونده ۱۱-۲۲۳۳-۴۴۵۵ است', { mode: 'A' }).map((f) => f.kind)).toContain('uci');
  });

  it('does not flag court files, neutral citations, year ranges or money', () => {
    expect(findPii('IMM-1293-24, 2025 FC 12, 2019 SCC 65, 2023-2024, $36,023.72, para 25, section 205(a)', { mode: 'A' })).toEqual([]);
  });

  it('type B blocks exact dates, ages and places; type A only reviews them', () => {
    const text = 'On January 17, 2023 the 34-year-old founder moved to Tehran; ۱۷ دی ۱۴۰۱ در تهران.';
    const b = findPii(text, { mode: 'B' });
    expect(b.map((f) => f.kind).sort()).toEqual(['age', 'exact_date', 'exact_date', 'place', 'place']);
    expect(b.every((f) => f.severity === 'block')).toBe(true);
    expect(findPii(text, { mode: 'A' }).every((f) => f.severity === 'review')).toBe(true);
  });

  it('finds case-specific terms (employer, incubator)', () => {
    const f = findPii('She worked at Acme Widgets Ltd and joined the Northstar Incubator.', { mode: 'B', terms: ['Acme Widgets', 'northstar incubator'] });
    expect(f.map((x) => x.match)).toEqual(['Acme Widgets', 'Northstar Incubator']);
  });

  it('respects the allow list (judge as author)', () => {
    expect(findPii('Justice Example wrote the reasons.', { mode: 'A', names: ['Example'], allow: ['Justice Example'] })).toEqual([]);
  });

  it('redact replaces every planted item and leaves nothing for a second pass', () => {
    const raw = 'Kaveh Testperson (UCI 1122334455, kaveh@example.com) from Tehran signed on 2023-01-17 with Acme Widgets.';
    const opts = { mode: 'B' as const, names, terms: ['Acme Widgets'] };
    const r = redact(raw, opts);
    expect(r.text).toBe('[name] [name] (UCI [id], [contact]) from [place] signed on [date] with [redacted].');
    expect(findPii(r.text, opts)).toEqual([]);
  });
});

describe('persian lint', () => {
  const rules = (t: string) => lintFa(t).map((i) => i.rule);

  it('clean Persian passes', () => {
    expect(lintFa('دادگاه گفت افسر شواهد را نادیده گرفته است (بند ۲۳). رأی 2025 FC 12 در سایت دادگاه هست؛ «متن کامل» را بخوانید.')).toEqual([]);
  });

  it('flags Arabic ي/ك and Arabic-Indic digits', () => {
    expect(rules('اين كار')).toEqual(expect.arrayContaining(['arabic-ye', 'arabic-kaf']));
    expect(rules('بند ٢٣')).toContain('arabic-digits');
  });

  it('flags missing نیم‌فاصله in می and ها/تر', () => {
    expect(rules('دادگاه می شود')).toContain('mi-space');
    expect(rules('افسر میشود')).toContain('mi-joined');
    expect(rules('پرونده ها و مهم ترین نکته')).toEqual(expect.arrayContaining(['suffix-space']));
    expect(rules('می‌شود و پرونده‌ها و مهم‌ترین')).toEqual([]);
    expect(rules('میز و میزان و میلیون')).toEqual([]);
  });

  it('flags Latin quotes and dashes', () => {
    expect(rules('افسر گفت "نه" — پایان')).toEqual(expect.arrayContaining(['latin-quotes', 'em-dash']));
  });

  it('paragraph refs need Persian digits; citations stay Latin', () => {
    expect(rules('بند 23')).toContain('para-ref-latin-digits');
    expect(rules('[para 23]')).toContain('para-ref-english');
    expect(rules('۲۰۲۵ FC ۱۲')).toContain('citation-persian-digits');
    expect(rules('رأی اف سی')).toContain('citation-transliterated');
    expect(faParaRef([23])).toBe('بند ۲۳');
    expect(faParaRef([4, 7, 12])).toBe('بندهای ۴، ۷ و ۱۲');
  });

  it('normaliseFaForMatching preserves length', () => {
    const s = 'تضمين‌ ويزا ٢٥ ۲۵ ك';
    expect(normaliseFaForMatching(s)).toHaveLength(s.length);
    expect(normaliseFaForMatching(s)).toBe('تضمین  ویزا 25 25 ک');
  });
});
