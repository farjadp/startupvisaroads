// ============================================================================
// content/en/c10-work-permit.ts
// /en/c10-work-permit — the significant benefit work permits under R205(a):
// C10 (general), C11 (business owners seeking only temporary residence) and
// C60 (provincial business candidates). Written 2026-10-13 because "c10
// significant benefit permit" and its variants were the site's largest query
// cluster in Search Console (~170 impressions in 90 days), served only by a
// thin June post. Every rule below was read on canada.ca and the IRCC fee
// list on that date (see `sources`). No VisaRoads price, by rule.
// ============================================================================
import type { FaPage } from '@/lib/fa/content';

export const page: FaPage = {
  path: '/c10-work-permit',
  title: 'C10 Significant Benefit Work Permit (2026): C10, C11 or C60?',
  description:
    'What the C10 significant benefit work permit is, why IRCC reserves it for exceptional cases, and why founders usually need C11 (51% owners, up to 18 months) or C60 (provincial business candidates) instead.',
  keywords: [
    'c10 significant benefit permit',
    'c10 work permit canada',
    'c10 work permit requirements',
    'significant benefit work permit canada',
    'c11 work permit entrepreneur',
  ],
  updated: '2026-10-13',
  entity: {
    name: 'Significant benefit work permit [R205(a) – C10]',
    provider: 'Immigration, Refugees and Citizenship Canada',
    country: 'Canada',
  },
  facts: [
    { label: 'Legal basis', value: 'R205(a)', note: 'Immigration and Refugee Protection Regulations' },
    { label: 'LMIA', value: 'Not required', note: 'an LMIA-exempt work permit' },
    { label: 'C11 ownership', value: 'At least 51%', note: 'business owners seeking only temporary residence' },
    { label: 'C11 maximum', value: '18 months' },
    { label: 'Provincial business candidates', value: 'Code C60', note: 'with a provincial 205(a) support letter' },
    { label: 'Government fees', value: 'CAD 155 + CAD 230', note: 'work permit and employer compliance fee' },
  ],
  hero: {
    eyebrow: 'Canada · Work permits · R205(a)',
    headline: 'C10: the work permit for the exceptional case, not the shortcut',
    sub: 'C10 lets an officer issue a work permit without a labour market test when the work brings Canada a clear, compelling and documented benefit. IRCC says it should not be used for convenience. Most founders are not looking for C10 at all: they need C11 or C60. This guide explains which is which.',
    cta: { label: 'Compare the entrepreneur routes', href: '/pnp' },
  },

  sections: [
    {
      heading: 'What is the C10 significant benefit work permit?',
      body: [
        'C10 is the administrative code IRCC uses for work permits issued under paragraph 205(a) of the Immigration and Refugee Protection Regulations on the ground of "significant benefit". It is exempt from the Labour Market Impact Assessment (LMIA): instead of showing that no Canadian could do the job, the applicant shows that their work would create or maintain significant social, cultural or economic benefits or opportunities for Canadians and permanent residents.',
        'IRCC describes the authority as giving officers flexibility to respond in unique or exceptional situations, where the benefit is clear, compelling and documented. Its instructions add, as an "Important" note: this authority should not be used for the sake of convenience.',
      ],
    },
    {
      heading: 'What counts as a significant benefit?',
      body: [
        'The benefit has to reach beyond the applicant, their family and their employer: officers must be reasonably convinced the work would have positive effects on the broader community, region or country. It does not need to be Canada-wide, or even province-wide, to be significant.',
        'On the economic side, IRCC\'s instructions point to things like advancing a Canadian industry through market expansion, job creation or innovation, stimulating remote areas, and creating employment or training opportunities. There are also social and cultural grounds.',
      ],
      callout: 'IRCC states that a copy and paste from its own website or instructions is not sufficient evidence. The benefit has to be shown for this person, in this role.',
    },
    {
      heading: 'C10, C11 or C60: which one is yours?',
      body: ['Three codes sit under the same paragraph 205(a), and they are easy to confuse:'],
      bullets: [
        'C10 — significant benefit, general. For exceptional cases that do not fit a more specific category. Supported by an offer of employment submitted through the Employer Portal.',
        'C11 — business owners seeking only temporary residence: someone who wants to run, including establish, their own business in Canada and then leave. Only when the applicant controls at least 51% of the business, for a maximum of 18 months at a time. IRCC\'s examples are seasonal businesses such as bed and breakfasts and wildlife guiding.',
        'C60 — provincial business candidates (and Quebec self-employed applicants with a CSQ) seeking eventual permanent residence. The province approves you and gives you a support letter for a work permit; you then run the business, usually for up to 2 years (3 in Quebec), before you can be nominated.',
      ],
      callout: 'If your goal is permanent residence through a business, C11 is the wrong door: IRCC directs people who intend to stay to the provincial business streams, which issue C60 work permits.',
    },
    {
      heading: 'C10 work permit requirements and evidence',
      body: [
        'There is no fixed checklist, because C10 is case by case. IRCC gives examples of the evidence officers look for: an employment letter explaining how the foreign worker\'s work will bring a significant benefit to Canada, and, for cultural benefit, recognition such as awards. For C11, the business plan must be a concrete start-up plan rather than a market study, the business funds must be shown separately from the funds the family will live on, and officers keep discretion over how much is enough.',
        'The decision belongs to an officer, at IRCC or at the Canada Border Services Agency. Officers assess each application on its own facts, and no approval rate is published.',
      ],
    },
    {
      heading: 'Fees and the employer compliance fee',
      body: [
        'IRCC\'s fee list sets the work permit fee at CAD 155 per person and the employer compliance fee at CAD 230, plus CAD 85 per person for biometrics. Because C10, C11 and C60 are employer-specific, LMIA-exempt permits, an offer of employment is submitted through the Employer Portal and the compliance fee is paid there.',
      ],
    },
    {
      heading: 'For founders: the route behind the code',
      body: [
        'A founder who wants to settle in Canada will normally reach a 205(a) work permit through a provincial entrepreneur stream. Alberta, Manitoba, Nova Scotia and New Brunswick each approve the candidate, sign a performance agreement, and issue the support letter for the work permit; after the operating period, the province decides on nomination. Our guides to those streams carry the thresholds and steps from each province\'s own pages.',
        'Canada\'s federal Start-up Visa had its own code (A77) and is paused for new applications. It is not a C10 route.',
      ],
    },
    {
      heading: 'Where we come in',
      body: [
        'We are not immigration lawyers or licensed consultants, and we do not file work permit applications. We mentor founders on the business side: the plan, the financial model and the evidence of benefit that an officer or a province assesses. For the application itself, work with a licensed representative.',
      ],
    },
  ],

  faqs: [
    {
      q: 'What is a C10 work permit in Canada?',
      a: 'An LMIA-exempt work permit issued under paragraph 205(a) of the Immigration and Refugee Protection Regulations when the work would create or maintain significant social, cultural or economic benefits for Canadians. IRCC reserves it for unique or exceptional situations where the benefit is clear, compelling and documented.',
    },
    {
      q: 'Can an entrepreneur get a C10 work permit?',
      a: 'Usually the right code is not C10. A business owner who wants only temporary residence applies under C11 (at least 51% ownership, up to 18 months). A business owner who wants permanent residence goes through a provincial business stream, which issues C60 work permits with a provincial support letter.',
    },
    {
      q: 'Does a C10 work permit need an LMIA?',
      a: 'No. It is LMIA-exempt, but it still needs an offer of employment submitted through the Employer Portal and the employer compliance fee.',
    },
    {
      q: 'How much does a C10 work permit cost?',
      a: 'IRCC\'s fee list sets CAD 155 per person for the work permit and CAD 230 for the employer compliance fee, plus CAD 85 per person for biometrics.',
    },
    {
      q: 'How long is a C11 work permit valid?',
      a: 'Up to 18 months. For an extension, the officer must be satisfied that the work is still temporary and that it continues to provide a significant benefit.',
    },
    {
      q: 'Is the C10 permit the same as the Start-up Visa work permit?',
      a: 'No. The Start-up Visa work permit had its own code, A77, and the Start-up Visa programme is paused for new applications.',
    },
  ],

  closing: [
    { label: 'Compare the five entrepreneur provinces', href: '/pnp' },
    { label: 'Canada Start-up Visa status', href: '/startup-visa-canada' },
    { label: 'Talk to us', href: '/contact' },
  ],

  sources: [
    { label: 'IRCC — Significant benefit to Canada [R205(a) – C10]', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/operational-bulletins-manuals/temporary-residents/foreign-workers/exemption-codes/canadian-interests-significant-benefit-general-guidelines-r205-c10.html' },
    { label: 'IRCC — Business owners seeking only temporary residence [R205(a) – C11]', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/operational-bulletins-manuals/temporary-residents/foreign-workers/exemption-codes/entrepreneurs-self-employed-seeking-only-temp-residence-r205-c11.html' },
    { label: 'IRCC — Provincial business candidates [R205(a) – C60]', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/operational-bulletins-manuals/temporary-residents/foreign-workers/exemption-codes/canadian-interests-significant-benefit-entrepreneurs-self-employed-candidates-seeking-operate-business-r205-c11.html' },
    { label: 'Immigration and Refugee Protection Regulations, section 205', url: 'https://laws-lois.justice.gc.ca/eng/regulations/SOR-2002-227/section-205.html' },
    { label: 'IRCC — Fee list', url: 'https://ircc.canada.ca/english/information/fees/fees.asp' },
  ],
};
