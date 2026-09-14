import { describe, it, expect } from 'vitest';
import {
  classify,
  diversityPrompt,
  FAMILIES,
  pickDiverse,
  planDiversity,
  seedTags,
  tagsOf,
  violates,
  type Tagged,
} from '../diversity';

const t = (family: Tagged['family'], destination: Tagged['destination'], startupVisaHeadline = false, id = ''): Tagged & { id: string } => ({
  family,
  destination,
  startupVisaHeadline,
  id: id || `${family}/${destination}/${startupVisaHeadline}`,
});

describe('classify', () => {
  it('reads the destination from English and Persian titles', () => {
    expect(classify('Choosing the Right Provincial Nominee Program: Alberta vs BC').destination).toBe('canada');
    expect(classify('Get Finland’s Start-up Permit Without a Job Offer').destination).toBe('finland');
    expect(classify('اثبات تمکن مالی ویزای استارتاپ دانمارک').destination).toBe('denmark');
    expect(classify('مهاجرت به آمریکا با EB-2 NIW').destination).toBe('usa');
    expect(classify('How founders split equity').destination).toBe('general');
  });

  it('reads the family, most specific first', () => {
    expect(classify('اثبات تمکن مالی ویزای استارتاپ با حساب بانکی ایرانی').family).toBe('iranian-practicalities');
    expect(classify('What the Finland startup permit really costs').family).toBe('money-and-tax');
    expect(classify('Startup Denmark vs a Danish work permit').family).toBe('route-decision');
    expect(classify('Finding a rental flat in Helsinki').family).toBe('life-in-destination');
    expect(classify('How to split equity with a co-founder').family).toBe('founder-craft');
    expect(classify('Step-by-step process for the Estonia startup visa').family).toBe('route-mechanics');
  });

  it('flags a startup-visa headline in either language', () => {
    expect(classify('وضعیت استارتاپ ویزای کانادا').startupVisaHeadline).toBe(true);
    expect(classify('ویزای استارتاپ چیست').startupVisaHeadline).toBe(true);
    expect(classify('Finland Start-up Permit guide').startupVisaHeadline).toBe(true);
    expect(classify('Housing in Copenhagen for a founder').startupVisaHeadline).toBe(false);
  });
});

describe('tagsOf', () => {
  it('trusts tags written on the article over a guess from its title', () => {
    const a = { title: 'Something about Canada', topicSeed: `${seedTags({ family: 'founder-craft', destination: 'estonia' })}[kw:x] why — angle` };
    expect(tagsOf(a)).toMatchObject({ family: 'founder-craft', destination: 'estonia' });
  });
  it('classifies an article written before tags existed', () => {
    expect(tagsOf({ title: 'Alberta vs BC PNP', topicSeed: '[kw:pnp] why — angle' })).toMatchObject({ family: 'route-decision', destination: 'canada' });
  });
  it('ignores a malformed tag rather than trusting it', () => {
    expect(tagsOf({ title: 'Helsinki housing', topicSeed: '[family:nonsense] [dest:mars]' })).toMatchObject({ family: 'life-in-destination', destination: 'finland' });
  });
});

describe('planDiversity', () => {
  it('keeps the last two families and the last destination out', () => {
    const plan = planDiversity([t('money-and-tax', 'denmark'), t('route-mechanics', 'finland'), t('founder-craft', 'canada')]);
    expect(plan.avoidFamilies).toEqual(['money-and-tax', 'route-mechanics']);
    expect(plan.avoidDestinations).toEqual(['denmark']);
  });

  it('never puts "general" on cooldown, because it is not a place', () => {
    expect(planDiversity([t('founder-craft', 'general')]).avoidDestinations).toEqual([]);
  });

  it('puts never-used families first in the preference order', () => {
    const plan = planDiversity([t('money-and-tax', 'denmark')]);
    expect(plan.preferFamilies[plan.preferFamilies.length - 1]).toBe('money-and-tax');
    expect(plan.preferFamilies).toHaveLength(FAMILIES.length);
  });

  it('allows at most one startup-visa headline in any three articles', () => {
    expect(planDiversity([t('route-mechanics', 'canada', true)]).avoidStartupVisaHeadline).toBe(true);
    // Still blocked one article later: "not twice in a row" let half the days be startup visa.
    expect(planDiversity([t('founder-craft', 'general'), t('route-mechanics', 'canada', true)]).avoidStartupVisaHeadline).toBe(true);
    // Free again once two non-startup-visa articles have run.
    expect(planDiversity([t('founder-craft', 'general'), t('money-and-tax', 'estonia'), t('route-mechanics', 'canada', true)]).avoidStartupVisaHeadline).toBe(false);
    expect(planDiversity([]).avoidStartupVisaHeadline).toBe(false);
  });
});

describe('pickDiverse', () => {
  // The Persian backlog as it stood on 14 Sep 2026, in shape: mostly
  // startup-visa pieces, with a few others at the back.
  const backlog = [
    t('iranian-practicalities', 'denmark', true, 'funds'),
    t('iranian-practicalities', 'general', true, 'interview'),
    t('route-decision', 'general', false, 'mentor-vs-agency'),
    t('iranian-practicalities', 'general', true, 'documents'),
    t('route-decision', 'denmark', true, 'dk-or-fi'),
    t('route-mechanics', 'general', true, 'what-is'),
    t('route-mechanics', 'canada', true, 'canada-status'),
    t('life-in-destination', 'finland', false, 'move-to-finland'),
    t('founder-craft', 'general', false, 'equity'),
  ];

  it('never runs two startup-visa headlines back to back while there is anything else', () => {
    const order = pickDiverse(backlog, [], backlog.length);
    for (let i = 1; i < order.length; i++) {
      const bothSuv = order[i - 1].startupVisaHeadline && order[i].startupVisaHeadline;
      const othersLeft = order.slice(i).some((x) => !x.startupVisaHeadline);
      if (othersLeft) expect(bothSuv, `${order[i - 1].id} then ${order[i].id}`).toBe(false);
    }
  });

  it('does not repeat a family back to back when an alternative exists', () => {
    const order = pickDiverse(backlog, [], 5);
    for (let i = 1; i < order.length; i++) expect(order[i].family).not.toBe(order[i - 1].family);
  });

  it('continues from what was published, not from a clean slate', () => {
    // Yesterday was a startup-visa money piece about Denmark.
    const recent = [t('money-and-tax', 'denmark', true)];
    const [first] = pickDiverse(backlog, recent, 1);
    expect(first.startupVisaHeadline).toBe(false);
    expect(first.family).not.toBe('money-and-tax');
    expect(first.destination).not.toBe('denmark');
  });

  it('keeps two picks in the same batch apart', () => {
    const [a, b] = pickDiverse(backlog, [], 2);
    expect(a.family).not.toBe(b.family);
  });

  it('still returns something when every candidate breaks a rule', () => {
    // A day with a slightly repetitive article beats a day with none.
    const onlySuv = [t('route-mechanics', 'canada', true, 'a'), t('route-mechanics', 'canada', true, 'b')];
    expect(pickDiverse(onlySuv, [t('route-mechanics', 'canada', true)], 1)).toHaveLength(1);
  });

  it('returns every candidate when asked for more than exist', () => {
    expect(pickDiverse(backlog, [], 99)).toHaveLength(backlog.length);
  });

  it('keeps the backlog order on a tie, so a hand-set priority still wins', () => {
    const twins = [t('founder-craft', 'general', false, 'first'), t('founder-craft', 'general', false, 'second')];
    expect(pickDiverse(twins, [], 1)[0].id).toBe('first');
  });
});

describe('the planner instructions and their check', () => {
  const plan = planDiversity([t('money-and-tax', 'denmark', true), t('route-mechanics', 'finland')]);

  it('tells the model which families and places are off limits', () => {
    const p = diversityPrompt(plan);
    expect(p).toContain('Do NOT use these families today');
    expect(p).toContain('money-and-tax');
    expect(p).toContain('Do NOT make any brief about: denmark');
    expect(p).toMatch(/must NOT contain "startup visa"/);
    expect(p).toMatch(/One of the last 2 articles/);
  });

  it('throws out a brief that ignored them', () => {
    expect(violates(t('money-and-tax', 'canada'), plan)).toMatch(/family money-and-tax/);
    expect(violates(t('founder-craft', 'denmark'), plan)).toMatch(/destination denmark/);
    expect(violates(t('founder-craft', 'canada', true), plan)).toMatch(/startup-visa headline within 2/);
    expect(violates(t('founder-craft', 'canada'), plan)).toBeNull();
  });
});
