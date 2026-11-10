import { describe, expect, it } from 'vitest';
import { DISCLAIMERS, htmlToText, scanRedLines } from '../redlines';

const rulesHit = (text: string, locale: 'en' | 'fa' = 'en') => [...new Set(scanRedLines(text, locale).map((h) => h.rule))];

describe('red lines: English positives, one block per rule', () => {
  const cases: [number, string[]][] = [
    [1, ['We offer guaranteed approval for founders.', 'We guarantee your visa.', 'Approval is guaranteed with our plan.', 'A sure-shot route to PR.']],
    [2, ['We got them their PR in 2024.', 'We secured their work permit last spring.', 'We helped the family get their visa.']],
    [3, ['The Court approved the visa after the hearing.', 'She won the appeal against IRCC.', 'He appealed the visa refusal to the Federal Court.']],
    [4, ['100% of our files succeed.', 'Our success rate is the best in Ontario.', '9 out of 10 founders choose us.', '47 of our clients are now in Canada.', '300+ approved clients.']],
    [5, ['Your case is like this one, so expect the same.', 'Like this applicant, you will win too.', 'You will get your visa as well.']],
    [6, ['We file your application with IRCC.', 'We submit all the forms on your behalf.', 'We represent you before the Court.']],
    [7, ['Our immigration advice is tailored.', 'We provide immigration advice to founders.', 'Book our immigration consultants today.']],
    [8, ['Full refund if refused.', 'A money-back guarantee on every plan.', 'It is risk-free: no visa, no fee.', 'We refund you if your visa is refused.']],
    [9, ['The officer was biased against him.', 'A lazy officer wrote two lines.', 'IRCC is racist toward founders.']],
    [10, ['VisaRoads is an official partner of IRCC.', 'Officially endorsed programme.', 'Our plan is approved by the Government of Canada.', 'A government-approved mentor.']],
    [11, ['Plans start at $2,500.', 'Only CAD 3000 for the full package.', 'It costs 1,200 dollars.', 'Our fees start from five hundred.']],
    [12, ['This is a typical result for our clients.', 'This could be you next year.', 'You can achieve the same results.']],
  ];
  for (const [rule, texts] of cases) {
    for (const t of texts) {
      it(`rule ${rule}: ${t}`, () => {
        expect(rulesHit(t)).toContain(rule);
      });
    }
  }
});

describe('red lines: Persian positives', () => {
  const cases: [number, string][] = [
    [1, 'با ما تضمین ویزا دارید.'],
    [1, 'قبولی قطعی در کمتر از یک سال.'],
    [1, 'ما قبولی را تضمین می‌کنیم و ویزای تضمینی می‌گیرید.'],
    [2, 'ما برایش ویزا گرفتیم.'],
    [2, 'اقامتشان را گرفتیم.'],
    [3, 'دادگاه ویزای او را صادر کرد.'],
    [3, 'او برنده پرونده شد.'],
    [4, 'نرخ موفقیت ما بالاست.'],
    [4, '۹ از ۱۰ متقاضی موفق شدند.'],
    [4, 'صد در صد موفق.'],
    [4, '۱۰۰٪ پرونده‌ها.'],
    [5, 'پرونده شما هم مثل همین است.'],
    [5, 'شما هم قبول می‌شوید.'],
    [6, 'پرونده‌تان را ثبت می‌کنیم.'],
    [6, 'ما وکیل شما هستیم.'],
    [7, 'مشاوره مهاجرتی ما رایگان است.'],
    [7, 'مشاوره مهاجرتی می‌دهیم.'],
    [8, 'بازگشت کامل وجه در صورت ریجکتی.'],
    [9, 'افسر مغرض بود.'],
    [10, 'ما نماینده رسمی هستیم.'],
    [10, 'مورد تأیید دولت کانادا.'],
    [11, 'هزینه فقط ۲۵۰۰ دلار است.'],
    [11, 'تعرفه خدمات ما ارزان است.'],
    [12, 'این نتیجه معمول مراجعان ماست.'],
    [12, 'این می‌تواند شما باشید.'],
  ];
  for (const [rule, t] of cases) {
    it(`rule ${rule}: ${t}`, () => {
      expect(rulesHit(t, 'fa')).toContain(rule);
    });
  }

  it('folds Arabic letter forms, ZWNJ variants and digits before matching', () => {
    expect(rulesHit('تضمين ويزا', 'fa')).toContain(1); // Arabic ي
    expect(rulesHit('مشاوره مهاجرتي ما', 'fa')).toContain(7);
    expect(rulesHit('تضمین میکنیم', 'fa')).toContain(1); // no ZWNJ
    expect(rulesHit('تضمین می کنیم', 'fa')).toContain(1); // space instead of ZWNJ
    expect(rulesHit('٢٥٠٠ دلار', 'fa')).toContain(11); // Arabic-Indic digits
  });
});

describe('red lines: no false positives on the mandatory texts', () => {
  it('the four disclaimers and the source-box line produce zero hits', () => {
    expect(scanRedLines(DISCLAIMERS.courtEn, 'en')).toEqual([]);
    expect(scanRedLines(DISCLAIMERS.clientEn, 'en')).toEqual([]);
    expect(scanRedLines(DISCLAIMERS.sourceBoxEn, 'en')).toEqual([]);
    expect(scanRedLines(DISCLAIMERS.courtFa, 'fa')).toEqual([]);
    expect(scanRedLines(DISCLAIMERS.clientFa, 'fa')).toEqual([]);
  });

  it('the hub explainer and the outcome block wording are clean', () => {
    const hub = 'The Federal Court does not hear an appeal of a visa refusal; it hears a judicial review. If the Court agrees, the decision goes back to a different officer. It does not grant the visa.';
    expect(scanRedLines(hub, 'en')).toEqual([]);
    expect(scanRedLines('Allowed: sent back for a new decision by a different officer. The Court did not grant the visa.', 'en')).toEqual([]);
    expect(scanRedLines('Dismissed: the refusal stands. Read the official decision.', 'en')).toEqual([]);
  });

  it('court-attributed findings and plain legal language are clean', () => {
    expect(scanRedLines('The Court found the officer was careless with the record [para 25].', 'en')).toEqual([]);
    expect(scanRedLines('The officer gave no reasons for the refusal.', 'en')).toEqual([]);
    expect(scanRedLines('There is no guarantee of approval in any case.', 'en')).toEqual([]);
  });

  it('the real refund undertaking is allowed; anything wider is not', () => {
    expect(scanRedLines('Refund only if we fail to get the evaluating body’s approval within 12 months.', 'en')).toEqual([]);
    expect(rulesHit('Refund if your visa is refused.')).toContain(8);
  });
});

describe('htmlToText / HTML input', () => {
  it('strips tags and decodes entities before scanning', () => {
    expect(htmlToText('<p>A&nbsp;<strong>b</strong></p>').trim()).toBe('A b');
    expect(rulesHit('<p>We <em>guarantee</em> your&nbsp;visa</p>')).toContain(1);
  });

  it('reports the matched text from the original input', () => {
    const hits = scanRedLines('Fine text. Plans start at $2,500 a year.', 'en');
    expect(hits[0]).toMatchObject({ rule: 11, match: '$2,500' });
  });
});
