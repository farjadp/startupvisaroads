// ============================================================================
// content/en/europe-belgium.ts
// English twin of content/fa/europe-belgium.ts: Belgium's Flemish Innovation &
// Startup Permit (a fast-track professional card), plus the federal D visa
// and residence that sit on top of it. Same structure, same figures.
//
// Every figure was read on 2026-11-05 on the official pages themselves
// (vlaanderen.be, startupflanders.com, the Access Point partner list PDF,
// economy-employment.brussels, dofi.ibz.be); see `sources` and the header of
// the Persian file for what each page gave.
//
// NOT verified, and therefore not stated as fact: the Walloon page (the site
// refused both the browser pane and curl on 5 Nov 2026); the amount of the
// federal "contribution" fee for the D visa; whether one Access Point letter
// can cover several founders; what Access Points charge or require.
// No country of departure is described: each Belgian post sets its own rules.
// No VisaRoads price appears here, by rule.
// ============================================================================
import type { FaFaq, FaPage } from '@/lib/fa/content';

/** The questions asked before anyone has read anything. */
const COMMON_FAQS: FaFaq[] = [
  {
    q: 'Does Belgium have a startup visa?',
    a: 'Not by that name. Belgium has no national startup visa. What it has is the professional card, which each regional government issues to non-European entrepreneurs, and since 1 September 2026 the Flemish Region offers a fast version of it for innovative founders under the name Innovation & Startup Permit: the same professional card, decided within 30 days instead of 120, provided you have a cooperation letter from an approved incubator or knowledge institution. Residence is granted separately by the federal Immigration Office, through a D visa.',
  },
  {
    q: 'How much money do I need to show?',
    a: 'On the innovative route there is no fixed capital requirement for the company; the €22,838 you see quoted elsewhere is a condition of the "economic added value" category, not the innovative one. What you must show is personal means: "stable, sufficient and regular" income or resources of at least 110% of Belgium\'s guaranteed minimum wage, which is €2,408.79 a month from April 2026; the official page also gives an annual figure of €26,086.66 (from 1 March 2026). That is twice Finland\'s threshold.',
  },
  {
    q: 'How long does it take?',
    a: 'The decision on the card takes at most 30 days on the fast track and 120 days on the normal route, after which the card counts as approved. But that is only the card. Before it you need the Access Point letter, and after it the D visa from the embassy, which has its own timeline. The Flemish government itself says the whole procedure takes at least two months; with a legalised police certificate, translations and an embassy appointment, three to four months is more realistic. That is our estimate.',
  },
  {
    q: 'What is the Access Point letter, and what happens without it?',
    a: 'A letter on an official Dutch template, signed by an approved Flemish incubator, accelerator or research and knowledge institution, stating that it supports or cooperates with you. That letter triggers the 30-day route. Without it you can still apply for a professional card on innovative added value, but on the normal 120-day route. The official list has 59 organisations.',
  },
  {
    q: 'Does an incubator letter mean my residence is approved?',
    a: 'No. The letter only triggers the fast track. The decision on the card is taken by the Flemish economic migration office, and the decision on residence by the federal Immigration Office. Either can refuse.',
  },
  {
    q: 'How many of us can apply together?',
    a: 'The professional card is personal, not transferable, and covers only the activity written on it. So each founder files their own application, pays their own fees and proves their own means. Whether one Access Point letter can name several people is not stated on any official page, and the template is written for one person; ask the office itself before promising a team application.',
  },
  {
    q: 'What are the government fees?',
    a: 'Flemish professional card: €140 when you apply, and €90 per year of validity when the card is issued (€180 for a two-year card). Brussels charges the same €140 and €90. The D visa is separate: a consular fee set by the schedule of the embassy or consulate where you live, and an administrative "contribution" in euros paid to the Immigration Office, whose amount you should take from the Office\'s own page; we have not verified it.',
  },
  {
    q: 'What if I am refused?',
    a: 'In Flanders you can appeal to the minister within 30 days, but the appeal has no suspensive effect, and while it is pending no new application for the same activity is accepted. If the refusal becomes final, you can re-apply for the same activity after one year, and for a different activity at any time. In Brussels the wait is two years unless you bring new evidence or a different activity. That is why you should never file a half-ready file in Belgium.',
  },
];

/** The mechanics that decide a file, read from the Flemish and federal pages. */
const DEEP_DIVE_FAQS: FaFaq[] = [
  {
    q: 'How exactly do I prove "innovative added value"?',
    a: 'With evidence of at least one of three criteria: developing a new product, service or process that creates value for the company and the economy; applying a new or improved technology to an existing product, service or process; or cooperating with an incubator, accelerator or research and knowledge-dissemination organisation. These are alternatives, not three conditions at once. The third criterion is the Access Point letter itself; with the letter you meet the innovation condition and get the fast track.',
  },
  {
    q: 'What must the business plan contain?',
    a: 'At least: market and target group, market size, competitor analysis, SWOT analysis and marketing plan. Plus a financial plan in the official Flemish Excel template. The Startup.Flanders page asks for "market study, competitor and SWOT analysis, marketing and financial plan". Brussels caps the plan at 20 pages; Flanders has announced no page limit.',
  },
  {
    q: 'How do I prove "stable, sufficient and regular" means?',
    a: 'The reference is 110% of the guaranteed minimum monthly wage (GAMMI): €2,408.79 net a month from April 2026, and it must be in place "from the date the card is issued", for you or your family. The official page does not specify the type of evidence; in practice, a bank balance with a documented source, rental or contract income, or a combination. For a founder not yet drawing a salary from the company, that means provable savings for at least one year, about €29,000, separate from the company\'s money.',
  },
  {
    q: 'Which documents does a first application need?',
    a: 'A copy of your passport; a police certificate less than six months old from the country where you legally reside; a copy of a diploma of at least level 4 (secondary-school equivalent); proof of means; a full business plan with financial plan; for the innovative route, evidence of one of the three criteria and preferably the cooperation letter; and if you operate through a company, the (draft) articles of association, the deed appointing you and the shareholder register or UBO registration. The English Flemish application form is the version of 14 October 2026.',
  },
  {
    q: 'Do I need to register the company before applying?',
    a: 'No. Flanders accepts "draft articles of association" and says you may start the self-employed activity only after the card is issued. The card can be for a natural person (sole trader), a company with legal personality such as a BV/SRL, or a partnership. After arrival you register in the Crossroads Bank for Enterprises (KBO), get a company number, register for VAT and join a social insurance fund for the self-employed.',
  },
  {
    q: 'How must documents in other languages be translated?',
    a: 'Every document must be in Dutch, French, German or English. Official documents (government, university, bank) may only be translated by a sworn translator, and if the translator was sworn outside Belgium, the translation needs an apostille or legalisation by the issuing authority. Countries outside the Apostille Convention, Iran among them, need the full legalisation chain instead: their own justice ministry and foreign ministry, then the Belgian embassy. Both the original and the translation are attached.',
  },
  {
    q: 'How do I apply from outside Belgium?',
    a: 'You submit the file to the Belgian embassy or consulate in the country where you hold valid residence; you pay the €140 fee there and the embassy forwards the paper file to the regional office within five days. If you legally reside in Belgium, you apply through the WSE portal, by computer only. The decision is sent to you and to the same embassy, and you then request the D visa there.',
  },
  {
    q: 'What exactly does the embassy want for the D visa?',
    a: 'The federal Immigration Office\'s list is the same for everyone: the regional decision on the card, a medical certificate confirming you have none of the diseases listed in the annex to the 1980 Act, a police certificate less than six months old from your country of origin or residence, and proof of payment of the administrative contribution. Each embassy sets the practical details itself: in person or by post, the medical certificate template, the consular fee schedule in local currency, and whether documents need an apostille or consular legalisation. You fill in the form on VisaOnWeb and read that post\'s own page carefully; some posts, for example, require a passport valid for more than a year and accept applications no more than six months before travel.',
  },
  {
    q: 'What happens after the card is approved?',
    a: 'You get the D visa (temporary residence authorisation) from the embassy. Once the economic migration office receives a copy of the visa, it sends the card by registered post to the business counter (ondernemingsloket) you chose. On arrival you pay €90 per year of validity, collect the card and register with the municipality where you live, with the card and the visa; the federal Immigration Office issues the residence card.',
  },
  {
    q: 'How long is the card valid, and what does renewal require?',
    a: 'In Flanders between one and three years, depending on the merits of the file, and renewable; you must apply for renewal before it expires. Brussels is more explicit: the first card is usually a two-year "probation period", with a maximum of five years, and renewal depends on profitability (unless the losses come from investment), certificates showing no debts for tax, VAT and social security, the last two years\' tax returns and an accountant-certified balance sheet showing directors\' pay. The lesson is the same as in Finland: the permit is renewed, so the company has to be real.',
  },
  {
    q: 'How is Brussels different?',
    a: 'A separate professional card with the same two fees, no fast track and no Access Point. The project must contribute to the region\'s prosperity and offer goods or services that are not plentiful in Brussels: innovation, sustainable employment, better performance of organisations, sustainable development, or Brussels\' appeal to international institutions. Business plan at most 20 pages, about three months to review a complete file, and a two-year wait after a refusal. A Flemish card is also valid in Brussels and Wallonia, and vice versa.',
  },
  {
    q: 'What about Wallonia?',
    a: 'Wallonia also issues its own professional card through the Public Service of Wallonia (SPW) and has no startup fast track. The official Walloon page would not open for us when we checked on 5 November 2026; for that reason we do not give its figures or timelines here and only link to it. If you are heading for Liège or Namur, read that page yourself.',
  },
  {
    q: 'Can my family come with me?',
    a: 'The federal Immigration Office says the spouse or registered partner and minor children of someone with authorisation to work and stay more than 90 days can accompany them or join later, "under certain conditions". Those conditions sit in the section on family reunification with non-EU nationals holding limited residence and are not automatic: housing, income and insurance are checked. There is no guarantee your family arrives at the same time as the founder.',
  },
  {
    q: 'Do I get permanent residence after five years?',
    a: 'The law says that after five years of legal and continuous residence you can apply for EU long-term resident status (L card), with means of €1,038 plus €346 per dependant, health insurance, absences under six consecutive months and at most ten months in total. But the same page says the periods counted are those in which you were authorised to stay "for an unlimited period", and "purely temporary" residence does not count. How years on a one-to-three-year professional card are counted cannot be established from that page; a Belgian immigration lawyer has to answer it under Article 15bis of the 1980 Act. We do not promise "permanent residence after five years".',
  },
  {
    q: 'Can I rely on the Access Point list?',
    a: 'The list is official (August 2026, 59 organisations: imec.istart, Start it @KBC, Ghent University\'s IIC, the KU Leuven incubator, VIB, VITO, Flanders Make and others) but it gives only the name, website and VAT number; no fees, no admission criteria, no capacity. It also has some data errors, such as two organisations with the same VAT number. Check each organisation directly and do not copy the list verbatim into client material.',
  },
];

export const page: FaPage = {
  path: '/europe/belgium',
  title: 'Belgium Startup Visa 2026: Flanders Innovation & Startup Permit',
  description:
    'Flanders\' Innovation & Startup Permit since 1 Sep 2026: a professional card in 30 days with an Access Point letter, no fixed capital, €2,408.79/month means.',
  keywords: [
    'belgium startup visa',
    'flanders professional card',
    'innovation & startup permit',
    'belgium professional card for foreign entrepreneurs',
    'flanders startup visa',
    'belgium entrepreneur visa',
    'access point letter flanders',
  ],
  updated: '2026-11-05',

  image: 'belgium',
  imageAlt: 'The Antwerp skyline on a sunny day, the spire of the Cathedral of Our Lady rising above the houses along the Scheldt',
  gallery: [
    { src: 'belgium-2', alt: 'The row of historic Graslei houses in Ghent, reflected in the water of the Leie', caption: 'Ghent: IIC and Ghent University\'s technology transfer office, Tech Lane and Wintercircus are on the Access Point list.' },
    { src: 'belgium-3', alt: 'Leuven\'s Gothic town hall on the Grote Markt, with its richly carved facade and stone towers', caption: 'Leuven: the KU Leuven incubator, Bio-Incubator, imec and Leuven Mindgate; the densest cluster of knowledge institutions on the list.' },
  ],
  entity: {
    name: 'Innovation & Startup Permit (Professional Card, Flemish Region)',
    provider: 'Department of Work, Economy, Science, Innovation and Social Economy (WEWIS), Government of Flanders',
    country: 'Belgium',
  },
  facts: [
    { label: 'Permit type', value: 'Professional card with a fast track', note: 'Flanders, from 1 September 2026' },
    { label: 'Decision time', value: '30 days with an Access Point letter', note: 'Without the letter: 120 days, with tacit approval' },
    { label: 'Company capital', value: 'No fixed requirement', note: 'Economic route: €22,838' },
    { label: 'Personal means', value: '€2,408.79 a month', note: '110% of the minimum wage, from April 2026' },
    { label: 'Education', value: 'At least level 4', note: 'Secondary-school equivalent' },
    { label: 'Card fee', value: '€140 + €90 per year', note: 'D visa separate' },
    { label: 'Card validity', value: '1 to 3 years, renewable' },
    { label: 'After a refusal', value: '1-year wait for the same activity', note: 'Brussels: 2 years' },
    { label: 'Access Points', value: '59 organisations', note: 'August 2026 list' },
  ],
  hero: {
    eyebrow: 'Europe · Belgium · Flanders · Innovation & Startup Permit',
    headline: 'Belgium: a professional card in 30 days, if an incubator backs you',
    sub: 'Belgium has no startup visa; what it has is better than one, if you understand it properly. Since 1 September 2026 the Flemish Region offers non-European innovative founders the Innovation & Startup Permit: the same professional card the regional government issues to foreign self-employed people, but decided within 30 days instead of 120, provided you have a cooperation letter from one of 59 approved incubators and knowledge institutions. It asks for no fixed company capital, but it does ask for personal means twice those of Finland, and if you are refused you are barred from the same activity for a year. This page takes every figure and every deadline from the official pages of Flanders, Brussels and the Belgian Immigration Office, and says where no official answer exists yet.',
    cta: { label: 'Free route assessment', href: '/which-path' },
  },
  status: {
    tone: 'changed',
    title: 'New since 1 September 2026: a 30-day fast track in Flanders',
    body: 'The Flemish government has given the professional card procedure for innovative entrepreneurs the name "Innovation & Startup Permit" and says the conditions of the card are unchanged; what is new is faster processing for a file that includes a signed letter from a Flemish incubator, innovator or knowledge institution. The route is only for activity in Flanders; Brussels and Wallonia issue their own cards through the normal procedure.',
    cta: { label: 'Official Startup.Flanders page', href: 'https://www.startupflanders.com/en/permits' },
  },

  sections: [
    {
      heading: 'What the Belgian startup visa is, and what it is not',
      lead: {
        type: 'steps',
        caption: 'Three decisions, three authorities',
        steps: [
          { label: 'Professional card', who: 'The regional government', chip: '30 days with an Access Point letter' },
          { label: 'D visa', who: 'The federal Immigration Office', chip: 'Each post publishes its own timing' },
          { label: 'Residence card', who: 'The municipality and the business counter', chip: '€90 per year of card validity' },
        ],
      },
      keyFacts: [
        {
          value: '3 decisions',
          label: 'Professional card, D visa, residence card; from three authorities',
        },
        {
          value: '1 September 2026',
          label: 'Start of the Innovation & Startup Permit name and fast track',
        },
        {
          value: '30 days',
          label: 'Card decision with an Access Point letter',
        },
        {
          value: '1 to 3 years',
          label: 'Card validity, renewable',
        },
      ],
      table: {
        caption: 'Three decisions, three authorities',
        head: ['What', 'Who grants it', 'Where you apply', 'When'],
        rows: [
          [
            'Professional card (self-employment authorisation)',
            'The regional government: Flanders, Brussels or Wallonia',
            'The Belgian embassy in your country of residence, or the WSE portal from inside Belgium',
            'First; 30 days with an Access Point letter, 120 days without',
          ],
          [
            'D visa (temporary residence authorisation)',
            'The federal Immigration Office (IBZ)',
            'The same embassy, after a positive decision on the card',
            'Second; each post publishes its own timing',
          ],
          [
            'Residence card and start of activity',
            'The municipality where you live and the business counter',
            'In Belgium, after arrival',
            'Third; €90 per year of card validity',
          ],
        ],
        note: 'A Flemish card is also valid in Brussels and Wallonia, and vice versa; but you apply to the region where the address of your place of business is registered.',
      },
      body: [
        'In Belgium, authorisation to work as a self-employed person and authorisation to reside are two separate decisions by two separate governments. The work authorisation, the "professional card", is issued by a regional government: Flanders, Brussels, Wallonia or the German-speaking Community, depending on where the company\'s place of business is registered. Residence is granted by the federal Immigration Office, through a D visa you get from the Belgian embassy in your country of residence. The card is useless without the visa, and the visa is not issued without the card.',
        'What changed on 1 September 2026 is the name and the speed, not the conditions. Flanders Investment & Trade (FIT) has named the professional card procedure for innovative entrepreneurs the "Innovation & Startup Permit" so it is more visible internationally, and promises a decision within 30 days for a file that includes a cooperation letter from an approved Access Point. The official page itself states that the conditions of the professional card procedure remain unchanged.',
        'So if someone sells you a "Belgian startup visa" with direct residence, they are describing a programme that does not exist. What exists is a one-to-three-year card tied to you personally and to the activity written on it, which must be renewed, and which after five years may lead to long-term residence, with a legal question we explain further down.',
      ],
    },
    {
      heading: 'The four general conditions of the Flemish professional card',
      lead: {
        type: 'checks',
        label: 'The four general conditions',
        items: [
          { label: 'Nationality', note: 'Outside the European Economic Area and Switzerland' },
          { label: 'Education', note: 'At least level 4, a secondary-school diploma' },
          { label: 'Means', note: '€2,408.79 net a month, 110% of the minimum wage' },
          { label: 'Public order and the law', note: 'Registered in the Crossroads Bank for Enterprises' },
        ],
      },
      body: ['These are the same for all four added-value categories (economic, innovative, sporting, cultural):'],
      terms: [
        {
          term: 'Nationality',
          text: 'You are a national of a country outside the European Economic Area and Switzerland, and no exemption applies to you. Nationals of countries such as Iran are covered, and permanent residence in another (non-European) country does not exempt you.',
        },
        {
          term: 'Education',
          text: 'At least a level 4 qualification in the qualifications framework, i.e. the equivalent of a secondary-school diploma. A bachelor\'s degree is not required, but the diploma must be submitted with a sworn translation and legalisation.',
        },
        {
          term: 'Means',
          text: 'From the date the card is issued, "stable, sufficient and regular" resources for you or your family, at least equal to 110% of Belgium\'s guaranteed minimum monthly wage. From April 2026 that is €2,408.79 net a month; the annual figure published from 1 March 2026 is €26,086.66.',
        },
        {
          term: 'Public order and the law',
          text: 'You are no threat to public order and security, you register in the Crossroads Bank for Enterprises, and you comply with tax, social and company-law obligations. The business must be economically viable and must not harm the market or employment.',
        },
      ],
      callout: 'Take the means figure seriously: it is twice Finland\'s threshold and more than two and a half times Bulgaria\'s, and for a founder not yet drawing a salary from the company it means about €29,000 of documented savings for the first year, separate from the company\'s money.',
    },
    {
      heading: 'Innovative added value: three criteria, one is enough',
      lead: {
        type: 'tiles',
        tiles: [
          { value: '3', label: 'Criteria', sub: 'New product, new technology, or cooperation with an incubator' },
          { value: '1', label: 'Is enough', sub: 'They are alternatives, not conditions at once' },
          { value: '€0', label: 'Fixed company capital', sub: 'in the innovative category' },
          { value: '€22,838', label: 'Starting capital', sub: 'only in the economic added-value category' },
        ],
      },
      keyFacts: [
        {
          value: '3 criteria',
          label: 'New product, new technology, or cooperation with an incubator',
        },
        {
          value: '1 is enough',
          label: 'They are alternatives, not conditions at once',
        },
        {
          value: '€0',
          label: 'Fixed company capital in the innovative category',
        },
        {
          value: '€22,838',
          label: 'Only in the economic added-value category',
        },
      ],
      table: {
        caption: 'Innovative category versus economic category',
        head: ['Condition', 'Innovative added value (startup route)', 'Economic added value (traditional business)'],
        rows: [
          [
            'Starting capital in a personal account',
            'No fixed requirement',
            'At least €22,838 (indexed 1 January 2026)',
          ],
          [
            'Activity condition',
            'One of three criteria: new product/process, new technology on an existing product, or cooperation with an incubator/knowledge institution',
            'Job creation and investment, or a proven positive effect on the Flemish economic fabric',
          ],
          [
            'Business plan',
            'Full: target market, market size, competitors, SWOT, marketing, financial plan',
            'The same',
          ],
          ['30-day fast track', 'Yes, with an Access Point letter', 'No'],
          ['Personal means of €2,408.79 a month', 'Yes', 'Yes'],
        ],
      },
      body: [
        'The professional card is granted for an activity that brings added value to Flanders, and the startup route falls under the "innovative added value" category. For this category you must provide evidence of at least one of these three: developing a new product, service or process that creates value for the company and the economy; applying a new or improved technology to an existing product, service or process; or cooperating with an incubator, accelerator or research and knowledge-dissemination organisation.',
        'The point lost in most reports: in the innovative category there is no starting-capital requirement. The €22,838 figure (indexed from 1 January 2026, in an account in your own name) is a condition of the "economic added value" category, designed for traditional businesses with job creation and investment. Both categories require a full business plan.',
        'The third criterion is the Access Point letter itself. One letter both meets the substantive innovation condition and triggers the 30-day route. That is why the whole game in Flanders turns on this letter.',
      ],
    },
    {
      heading: 'Access Point: the letter that triggers the fast track',
      lead: {
        type: 'tiles',
        tiles: [
          { value: '59', label: 'Access Points', sub: 'on the official August 2026 list' },
          { value: '30 days', label: 'Decision with the letter' },
          { value: '120 days', label: 'Decision without it', sub: 'then tacit approval' },
          { value: 'Dutch', label: 'Official letter template', sub: 'Word or PDF, from the government' },
        ],
      },
      keyFacts: [
        {
          value: '59',
          label: 'Organisations on the official August 2026 list',
        },
        {
          value: '30 days',
          label: 'Decision with the letter',
        },
        {
          value: '120 days',
          label: 'Decision without the letter, then tacit approval',
        },
        {
          value: 'Dutch template',
          label: 'Letter only on the government\'s official Word or PDF template',
        },
      ],
      choice: {
        question: 'Do you have a cooperation letter?',
        options: [
          {
            title: 'Yes, an Access Point has signed',
            body: 'You attach the letter as is, on the official template; it meets the innovation condition and triggers the 30-day route. The file must be complete before you submit, because even with a letter a refusal brings a one-year bar.',
          },
          {
            title: 'No, not yet',
            body: 'You can still apply for the card on innovative added value, with evidence of one of the other two criteria, on the 120-day route. Or get the letter first; once the file is submitted it cannot be sped up.',
          },
        ],
      },
      checklist: {
        title: 'Before contacting an Access Point',
        intro: 'These organisations are incubators and universities, not immigration offices. They assess the project before signing a letter.',
        items: [
          'I have chosen three to five organisations from the list of 59 whose field matches my project (not just the best-known ones).',
          'I have read each one\'s website and know whether it requires an admission programme, a fee or equity; where it is unclear, I have asked.',
          'A ten-minute pitch in English is ready: the problem, the solution, why Flanders, why now.',
          'I have evidence of real work: a product prototype, early market data, a pilot customer or a patent.',
          'A draft business plan with the same five official sections is ready, so they can "help strengthen the file".',
          'I have downloaded the official letter template (Dutch Word/PDF) from the Flemish government site so they sign that, not a free-form letter.',
          'I have asked whether they will sign the letter for my co-founders too, or whether each person must apply separately.',
        ],
      },
      body: [
        'Startup.Flanders says you do not apply for this permit alone: you work with an incubator, accelerator or research and knowledge institution approved by the Flemish government. That partner assesses the quality of the project, helps strengthen the file and signs the cooperation letter. The letter has a fixed template, in Dutch, in Word or PDF format on the government site, and must be attached to the file as is. Without it you can still apply for the card on innovative added value, but you lose the 30-day route.',
        'The official list (August 2026) has 59 organisations: from university incubators such as Ghent\'s IIC and the KU Leuven incubator, the technology transfer offices of the universities of Ghent, Antwerp, Hasselt and Brussels, to imec.istart, Start it @KBC, VIB, VITO, Flanders Make, Janssen\'s JLABS, Corda Campus, The Beacon and sector clusters such as Catalisti, Flux50, Blauwe Cluster and Flanders’ FOOD. The list gives only the name, website and VAT number; nothing about fees, admission criteria, capacity or what they ask in return for a letter.',
      ],
      bullets: [
        'Get the letter before you submit, not after: without a letter the file goes on the 120-day route and cannot be sped up later.',
        'The letter template is written for one entrepreneur; whether one letter can cover several founders is not stated on any official page.',
        'The list has data errors (two organisations with one VAT number, one wrong website address); confirm each organisation directly.',
        'The main question is open: do these organisations want equity, charge a fee, or require you to join an acceleration programme in exchange for a letter? Each has its own answer, and it must be asked before promising anything to any client.',
      ],
    },
    {
      heading: 'The business plan and first-application documents',
      lead: {
        type: 'checks',
        label: 'What the business plan must contain',
        icon: 'number',
        items: [
          { label: 'Market and target group' },
          { label: 'Market size' },
          { label: 'Competitor analysis' },
          { label: 'SWOT analysis' },
          { label: 'Marketing plan' },
          { label: 'Financial plan', note: 'in the official Excel template' },
        ],
      },
      checklist: {
        title: 'Documents for a first Flemish professional card application',
        intro: 'The official list from the "first application" page. Every document not in English/Dutch/French/German needs a sworn translation and legalisation.',
        items: [
          'The English Flemish application form, version of 14 October 2026, completed and signed.',
          'A copy of my passport or foreign identity card.',
          'A police certificate dated less than six months ago, from the authority of the country where I legally reside.',
          'A copy of a diploma of at least level 4 (secondary-school equivalent).',
          'Proof of stable, sufficient and regular means from the date the card is issued: at least €2,408.79 a month.',
          'A full business plan: market and target group, market size, competitor analysis, SWOT, marketing plan.',
          'A financial plan in the official Flemish Excel template.',
          'Evidence of at least one of the three innovative added-value criteria.',
          'An Access Point cooperation letter on the official Dutch template (for the 30-day route).',
          'If through a company: the (draft) articles of association, the deed appointing me, the shareholder register or UBO registration.',
          'For every official document: a sworn translation + the original + an apostille or legalisation if the translator is outside Belgium.',
        ],
      },
      body: [
        'A full business plan must contain at least: market and target group, market size, competitor analysis, SWOT analysis and marketing plan, plus a financial plan in the official Excel template. The fixed documents for a first application are these:',
      ],
      callout: 'Every document must be in Dutch, French, German or English. Official documents may only be translated by a sworn translator, and a translation made outside Belgium needs an apostille or legalisation. Both the original and the translation are attached.',
    },
    {
      heading: 'The route, step by step',
      lead: {
        type: 'steps',
        steps: [
          { label: 'Profile', who: 'You', chip: '€2,408.79 a month' },
          { label: 'Business plan', who: 'You', chip: 'Official financial template' },
          { label: 'Access Point', who: 'One of 59 organisations', chip: 'Letter on the Dutch template' },
          { label: 'Submit', who: 'Embassy or WSE portal', chip: '€140 · forwarded within 5 days' },
          { label: 'Decision and D visa', who: 'Flanders, then the embassy', chip: '30 days with the letter, 120 without' },
          { label: 'Arrival and start', who: 'Business counter and municipality', chip: '€90 per year of validity' },
        ],
      },
      table: {
        caption: 'Timelines and fees at each step',
        head: ['Step', 'Who decides', 'Official timeline', 'Fee'],
        rows: [
          ['Access Point letter', 'The partner organisation', 'Not published; depends on the organisation', 'Not published'],
          ['Submitting the card application', 'The embassy receives it and forwards it within 5 days', '—', '€140'],
          ['Completing an incomplete file', 'The Flemish economic migration office', '30 days for you', '—'],
          [
            'Card decision',
            'The Flemish economic migration office',
            '30 days with the letter; 120 days without, then tacit approval',
            '—',
          ],
          [
            'D visa',
            'The federal Immigration Office, through the embassy',
            'Per that embassy\'s page',
            'Administrative contribution in euros + local consular fee',
          ],
          [
            'Card issued in Belgium',
            'The business counter',
            'After the visa copy is received, by registered post',
            '€90 per year of validity',
          ],
          ['Appeal against refusal', 'The Flemish minister for work', '30 days for you; no suspensive effect', '—'],
        ],
        note: 'The Flemish government says the whole procedure takes at least two months. Three to four months is our estimate.',
      },
      body: ['The six official Startup.Flanders steps, with the deadlines and fees given by the Flemish government and Immigration Office pages:'],
      bullets: [
        '1. Profile: non-European nationality, a diploma, means of €2,408.79 a month, and an activity that meets one of the three innovation criteria.',
        '2. Business plan: market study, competitor and SWOT analysis, marketing and financial plan, with the official financial template.',
        '3. Access Point: agreement with one of the 59 listed organisations and a signed letter on the Dutch template.',
        '4. Submitting the application: from abroad, at the Belgian embassy or consulate in your country of residence, with €140; the embassy forwards the file to Flanders within 5 days. From inside Belgium, on the WSE portal.',
        '5. Decision and D visa: at most 30 days with the letter, 120 days without it with tacit approval; then the D visa application at the same embassy with the regional decision, a medical certificate, a police certificate and the receipt for the administrative contribution.',
        '6. Arrival and start: the card is posted to the business counter you chose; on arrival you pay €90 per year of validity, collect the card, register with the municipality, register the company in the KBO and sign up for VAT and a social insurance fund for the self-employed.',
      ],
      callout: 'You may start the self-employed activity only after the card is issued. The Flemish government says the whole procedure takes at least two months; 30 days is only the card decision\'s share.',
    },
    {
      heading: 'Government fees',
      lead: {
        type: 'tiles',
        tiles: [
          { value: '€140', label: 'Card application', sub: 'on submission' },
          { value: '€90', label: 'Per year of validity', sub: 'when the card is issued' },
          { value: '€320', label: 'Two-year card, total' },
          { value: 'Separate', label: 'D visa fees', sub: 'administrative contribution and consular fee' },
        ],
      },
      keyFacts: [
        {
          value: '€140',
          label: 'When submitting the card application',
        },
        {
          value: '€90',
          label: 'Per year of validity, when the card is issued',
        },
        {
          value: '€320',
          label: 'Total for a two-year card',
        },
        {
          value: 'Separate',
          label: 'D visa administrative contribution and consular fee',
        },
      ],
      table: {
        caption: 'Official fees, item by item',
        head: ['Item', 'Amount', 'When and to whom'],
        rows: [
          ['Professional card application (Flanders and Brussels)', '€140', 'On submission, to the embassy or counter'],
          [
            'Card issue',
            '€90 per year of validity (€180 for two years, €270 for three)',
            'When collecting the card at the business counter',
          ],
          ['30-day fast track', 'No separate fee published', '—'],
          [
            'D visa administrative contribution',
            'Depends on the visa category; take the amount from the Immigration Office page',
            'Before the visa application, paid to the IBZ account in euros',
          ],
          ['D visa consular fee', 'Per the schedule of the embassy where you live, in local currency', 'When applying for the visa'],
          ['Legalisation or apostille of each document', 'Depends on the country and post', 'Before sending the file'],
          ['Changing or replacing the card (Brussels)', '€140', 'On application, with no issue fee'],
        ],
        note: 'Sworn translation, the medical certificate, company registration and any Access Point fee are separate and appear in no official table.',
      },
      body: [
        'The Flemish professional card has two fee items: €140 when you apply, and €90 per year of validity when the card is issued; a two-year card is €180, a three-year card €270. If you applied from abroad, you pay the €90s at the business counter on arrival. Brussels charges the same €140 and €90. No separate fee has been announced for the fast track.',
        'The D visa has two separate fees: an administrative "contribution" in euros paid into the Immigration Office\'s account in Belgium, whose amount depends on the visa category (we have not verified the current amount on the Office\'s page; take it from there), and a consular fee paid in local currency according to the schedule of the embassy or consulate where you live; legalising each document at Belgian posts carries its own fee. Sworn translation, apostille or legalisation of documents, the medical certificate, company registration and any Access Point fee are separate.',
      ],
    },
    {
      heading: 'Applying from outside Belgium: each embassy has its own rules',
      lead: {
        type: 'tiles',
        tiles: [
          { value: '5 days', label: 'Embassy forwards the file', sub: 'after the €140 fee' },
          { value: '6 months', label: 'Maximum document age', sub: 'police certificate and legalised documents' },
          { value: 'VisaOnWeb', label: 'Federal D visa form', sub: 'for every post' },
          { value: 'Each post', label: 'Sets its own rules', sub: 'submission method, fees and templates' },
        ],
      },
      keyFacts: [
        {
          value: '5 days',
          label: 'The embassy forwards the file after the €140 fee',
        },
        {
          value: '6 months',
          label: 'Maximum age of the police certificate and legalised documents',
        },
        {
          value: 'VisaOnWeb',
          label: 'The federal D visa form, for every post',
        },
        {
          value: 'Each post',
          label: 'Sets its own submission method, fees and templates',
        },
      ],
      checklist: {
        title: 'Before sending the file to the embassy',
        intro: 'Each Belgian post has its own procedure; this list is what you must have clarified at any post.',
        items: [
          'I have read this embassy\'s D visa page in full: in person or by post, number of copies, hours and method of submission.',
          'I know how much this post\'s consular fee is and how it is paid (cash, transfer, certified cheque).',
          'I know whether this post requires an apostille or consular legalisation, and for which documents.',
          'A police certificate from my country of residence, of the type this post accepts, less than six months old.',
          'A medical certificate on the template this post accepts, from a doctor this post recognises.',
          'My passport is valid until the end of the card period (some posts require more than a year).',
          'I have filled in the VisaOnWeb form and have a signed printout.',
          'The receipt for the administrative contribution paid to the Immigration Office account is attached.',
          'I have prepared the envelope or method for returning my passport and original documents, per this post\'s procedure.',
        ],
      },
      body: [
        'The core is the same for everyone: you submit the professional card file to the Belgian embassy or consulate in the country where you legally reside, pay the €140 there, the embassy forwards the file to the regional office within five days, and after a positive decision you request the D visa from the same post. The visa form is filled in on the federal VisaOnWeb system.',
        'But each post sets the practical details itself, and they differ from post to post: whether submission is in person or by post, the number of copies, the consular fee schedule in local currency and how to pay it, the medical certificate template and which doctors are accepted, the type of police certificate (for example, with fingerprints) and whether an apostille or consular legalisation is required, the minimum passport validity, and how many months before travel an application is accepted. None of this is on the Flemish pages; it is on that embassy\'s D visa page, and you must read it before preparing the file.',
      ],
      callout: 'Two rules hold at every post: the police certificate and every legalised document are valid for only six months, and if your country is not a party to the Apostille Convention, a full legalisation chain up to the Belgian embassy is needed instead of an apostille. Start your timeline from these two.',
    },
    {
      heading: 'After the card: D visa, arrival, company registration',
      lead: {
        type: 'steps',
        caption: 'From a positive decision to your first day of work',
        steps: [
          { label: 'Positive decision', who: 'You and the embassy are informed' },
          { label: 'D visa application', who: 'The same embassy', chip: 'Police certificate under six months old' },
          { label: 'Visa copy to the office', who: 'Card sent by registered post' },
          { label: 'Arrival in Belgium', who: 'Business counter', chip: '€90 per year of validity' },
          { label: 'Municipality', who: 'Registration, residence card' },
          { label: 'Company', who: 'KBO, VAT, social insurance fund' },
        ],
      },
      timeline: {
        caption: 'From a positive decision to your first day of work',
        items: [
          {
            when: 'Positive decision',
            what: 'You and the Belgian embassy in your country of residence are informed at the same time.',
          },
          {
            when: 'D visa application',
            what: 'At the same embassy: the regional decision, a medical certificate, a police certificate less than six months old, the receipt for the administrative contribution.',
          },
          {
            when: 'Visa copy to the office',
            what: 'The Flemish economic migration office receives the visa copy and sends the card by registered post to the business counter you chose.',
          },
          {
            when: 'Arrival in Belgium',
            what: '€90 per year of validity at the counter; collect the card.',
          },
          {
            when: 'Municipality',
            what: 'Register with the card and visa at the municipality where you live; the residence card comes from the federal Immigration Office.',
          },
          {
            when: 'Company',
            what: 'Registration in the Crossroads Bank for Enterprises (KBO) and a company number, VAT registration, membership of a social insurance fund for the self-employed; with employees, registration with social security.',
          },
        ],
      },
      body: [
        'With a positive decision, both you and the embassy are informed, and you request the "temporary residence authorisation", the D visa, from the same embassy. For this visa the federal Immigration Office wants the regional decision, a medical certificate confirming you have none of the diseases in the annex to the 1980 Act, a police certificate less than six months old and the receipt for the administrative contribution. Once the Flemish economic migration office has the visa copy, it sends the card by registered post to the business counter you chose on the form.',
        'In Belgium: €90 per year of validity and collecting the card at the counter; registering with the municipality where you live, with the card and visa, which leads to the residence card; registering the company or activity in the Crossroads Bank for Enterprises and getting a company number; VAT registration; and joining a social insurance fund for the self-employed. If the company hires staff, registration with the National Social Security Office is added. A Flemish card is also valid in Brussels and Wallonia.',
      ],
    },
    {
      heading: 'Validity, renewal, and the real test in year two',
      lead: {
        type: 'tiles',
        tiles: [
          { value: '1–3 yrs', label: 'Flemish card validity', sub: 'depending on the merits of the file' },
          { value: '2 yrs', label: 'Usual first card in Brussels', sub: 'a probation period' },
          { value: '5 yrs', label: 'Maximum validity in Brussels' },
          { value: '2 months', label: 'Before expiry', sub: 'deadline for the renewal application' },
        ],
      },
      keyFacts: [
        {
          value: '1 to 3 years',
          label: 'Validity of the Flemish card, depending on the merits of the file',
        },
        {
          value: '2 years',
          label: 'Usual probation period of a first card in Brussels',
        },
        {
          value: '5 years',
          label: 'Maximum validity in Brussels',
        },
        {
          value: '2 months',
          label: 'Before expiry: deadline for the renewal application',
        },
      ],
      checklist: {
        title: 'The renewal file, starting now',
        intro: 'The Brussels list, which is the most explicit; the Flemish logic is the same. Collect these from month one, not two months before expiry.',
        items: [
          'I have a Belgian accountant from month one who can certify two years of balance sheets and profit and loss accounts, showing directors\' pay.',
          'The company reaches profitability, or its losses come from investments I can explain as building future success.',
          'The last two years\' tax returns (parts I and II) are filed.',
          'I can obtain certificates of no debts for direct tax, VAT, the social insurance fund and social security; that is, I have paid everything on time.',
          'The last two years\' sales and receipts ledger is in order.',
          'An updated business plan (at most 20 pages in Brussels) and a fresh police certificate are ready.',
          'The renewal application is submitted at least two months before the card expires.',
        ],
      },
      body: [
        'The Flemish card is valid for one to three years, and the merits of the file set the length. It is personal, not transferable, and covers only the activity written on it; a change of address, of the nature of the business or of status requires an amendment request. You must request renewal before it expires.',
        'Brussels describes renewal more explicitly, and the Flemish logic is the same: the first card is usually a two-year probation period with a maximum of five years; to renew you must be profitable, unless the losses come from investments that contribute to future success, and you must provide certificates of no debts for direct tax, VAT, the social insurance fund and social security, the last two years\' tax returns, an accountant-certified balance sheet and profit and loss account showing the pay of directors and partners, and the last two years\' sales and receipts ledger. The renewal application goes in at least two months before expiry.',
      ],
      callout: 'This is the same lesson we saw in Finland: you get the first permit with a business plan, and the renewal with financial statements. A company that is innovative on paper and empty in its accounts fails in year two.',
    },
    {
      heading: 'Refusal, appeal, and a one-year bar',
      lead: {
        type: 'checks',
        label: 'The clock after a refusal in Flanders',
        icon: 'alert',
        items: [
          { label: '30 days to complete an incomplete file' },
          { label: '30 days to appeal, with no suspensive effect' },
          { label: 'One year before re-applying for the same activity', note: 'Brussels: two years' },
          { label: 'A different activity: any time' },
        ],
      },
      timeline: {
        caption: 'The clock after a refusal in Flanders',
        items: [
          {
            when: 'Incomplete-file email',
            what: '30 days from the next day to complete it; otherwise permanent inadmissibility, open only to the Council of State within 60 days.',
          },
          {
            when: 'Refusal or revocation decision',
            what: 'From the third working day after the sending date, 30 days to appeal to the minister for work; by letter or email.',
          },
          {
            when: 'While the appeal is pending',
            what: 'No suspensive effect; no new application for the same activity is accepted; if your right of residence ends, you must follow the Immigration Office\'s instructions.',
          },
          {
            when: 'Minister confirms the refusal',
            what: 'One year from notification before re-applying for the same activity. A different activity: any time. In Brussels: two years.',
          },
        ],
      },
      table: {
        caption: 'Refusal and appeal, Flanders versus Brussels',
        head: ['Topic', 'Flanders', 'Brussels'],
        rows: [
          ['Deadline to complete an incomplete file', '30 days from the day after the email', 'A decision of inadmissibility is issued'],
          [
            'Appeal against refusal or revocation',
            '30 days from the third working day after the decision is sent, to the minister for work; by letter or email',
            '30 days from notification, by registered letter in French or Dutch to the minister for employment',
          ],
          ['Effect of the appeal', 'Not suspensive; no new application for the same activity is accepted', '—'],
          ['Council of State', '60 days, only for an inadmissibility decision', '60 days after the minister\'s decision'],
          [
            'Re-applying for the same activity',
            'One year after notification of the final refusal',
            'Two years from the date of the previous application',
          ],
          ['Applying for a different activity', 'Any time', 'Any time; or immediately with new evidence or after a refusal for an incomplete file'],
        ],
      },
      body: [
        'If the file is incomplete, you get an email and have 30 days to complete it; after that the file becomes "permanently inadmissible" and only the Council of State can review it, within 60 days. If you are refused or the card is revoked (for example after a failed inspection), you can appeal to the Flemish minister for work within 30 days from the third working day after the decision was sent, by letter or email.',
        'Know three things about the appeal: while it is pending, any new application for the same activity is inadmissible; the appeal has no suspensive effect, and if your right of residence ends in the meantime you must follow the Immigration Office\'s instructions and probably leave; and if the minister confirms the refusal, you must wait one year from notification for the same activity, although you can apply for a different activity at any time. In Brussels the wait is two years from the date of the previous application, unless the refusal was for an incomplete file, you have new evidence, or you propose a different activity.',
      ],
      callout: 'For our work this is the most important rule on the page: a weak file in Belgium is not just refused, it bars the client from that activity for a year. Until the file is ready, we do not submit.',
    },
    {
      heading: 'Brussels and Wallonia: the same card, no fast track',
      lead: {
        type: 'checks',
        label: 'Three regions, one card',
        icon: 'number',
        columns: 3,
        items: [
          { label: 'Flanders', note: '30 days with an Access Point letter; 59 Access Points' },
          { label: 'Brussels', note: 'No fast track; about 3 months; a 20-page plan' },
          { label: 'Wallonia', note: 'Its own card, no fast track; figures not verified' },
        ],
      },
      choice: {
        question: 'Which region?',
        options: [
          {
            title: 'Flanders',
            body: 'Antwerp, Ghent, Leuven, Bruges. The only region with the 30-day route and 59 Access Points. Card for one to three years. After a refusal, one year.',
          },
          {
            title: 'Brussels',
            body: 'The capital and the international institutions. No fast track; plan at most 20 pages; about three months; first card a two-year probation; after a refusal, two years.',
          },
          {
            title: 'Wallonia',
            body: 'Liège, Namur, Charleroi. Has its own card, no fast track. Read its official page yourself; we could not review it and quote no figures.',
          },
        ],
      },
      table: {
        caption: 'Three regions, one card',
        head: ['Feature', 'Flanders', 'Brussels', 'Wallonia'],
        rows: [
          [
            'Authority',
            'WEWIS, economic migration office',
            'Brussels Economy and Employment',
            'SPW, employment department',
          ],
          ['Startup fast track', 'Yes, 30 days with an Access Point letter', 'No', 'No'],
          ['Access Point', '59 approved organisations', 'None', 'None'],
          ['Normal decision time', '120 days, then tacit approval', 'About 3 months for a complete file', 'Not verified'],
          ['Business plan limit', 'Not published', '20 pages', 'Not verified'],
          ['Fee', '€140 + €90 a year', '€140 + €90', 'Not verified'],
          ['First card', '1 to 3 years', 'Usually 2 years probation, maximum 5', 'Not verified'],
          ['Wait after a refusal', '1 year', '2 years', 'Not verified'],
        ],
        note: 'The Wallonia column is empty because its official page would not open for us on 5 November 2026. We have not guessed anything.',
      },
      body: [
        'Brussels issues its own professional card for the same €140 and €90, with no fast track and no Access Point. The project must contribute to the region\'s prosperity and offer goods or services that are not plentiful in Brussels, and achieve at least one of these: improving existing sales channels, improving the performance of the region\'s companies and organisations, innovation in the design and distribution of goods and services or scientific research, sustainable creation of salaried jobs, a cultural offering, sustainable development, or Brussels\' appeal to international institutions. The business plan or its summary is at most 20 pages, review of a complete file takes three months, an appeal is by registered letter in French or Dutch within 30 days, and then the Council of State within 60 days.',
        'Wallonia also issues its own professional card through the Public Service of Wallonia (SPW, employment department) and has specific forms for applicants abroad. The official Walloon page would not open for us when we checked on 5 November 2026; for that reason we quote no timelines or figures from it. If you are heading for Liège, Namur or Charleroi, read that page yourself before any decision. In all three regions, one region\'s card is also valid in the other two.',
      ],
    },
    {
      heading: 'Family',
      lead: {
        type: 'checks',
        label: 'Who can come with you',
        items: [
          { label: 'Spouse or registered partner' },
          { label: 'Minor children' },
        ],
      },
      body: [
        'The federal Immigration Office says a third-country national who has authorisation to work and stay more than 90 days can bring their spouse or registered partner and minor children with them or have them join later, "under certain conditions". Those conditions are defined in the section on family reunification with non-EU nationals holding limited residence and normally include adequate housing, income and health insurance. Reunification is not automatic, and there is no guarantee your family arrives at the same time as you. Each family member needs a separate D visa with evidence of the family relationship, and the card\'s 110% means figure is defined for "you or your family".',
      ],
    },
    {
      heading: 'Long-term residence: five years, with an open legal question',
      lead: {
        type: 'tiles',
        tiles: [
          { value: '5 yrs', label: 'Legal and continuous residence', sub: 'before applying for the L card' },
          { value: '6 / 10 mo', label: 'Absences allowed', sub: 'any single one / in total over five years' },
          { value: '5 months', label: 'Decision deadline', sub: 'silence means approval' },
          { value: '12 months', label: 'Outside the EU', sub: 'and the status is lost' },
        ],
      },
      keyFacts: [
        {
          value: '5 years',
          label: 'Legal and continuous residence before applying',
        },
        {
          value: '6 / 10 months',
          label: 'Maximum single absence / total absences over five years',
        },
        {
          value: '5 months',
          label: 'Decision deadline; silence means approval',
        },
        {
          value: '12 months',
          label: 'Outside the EU: status lost',
        },
      ],
      table: {
        caption: 'EU long-term resident status (L card) in Belgium',
        head: ['Condition', 'Official figure or rule'],
        rows: [
          ['Length of residence', '5 years of legal and continuous residence, immediately before the application'],
          [
            'Which years count',
            'Periods of residence "for an unlimited period"; half of any period of study; "purely temporary" residence does not count',
          ],
          ['Permitted absences', 'Each absence under 6 consecutive months, and at most 10 months in total over the 5 years'],
          ['Means', '€1,038 for one person + €346 per dependant (the page\'s figure, probably out of date)'],
          ['Insurance', 'Health insurance covering Belgium'],
          ['Authority and form', 'The municipality where you live, Annex 16; decision by the Immigration Office'],
          ['Decision deadline', '5 months; no decision means approval and issue of the L card'],
          ['Loss', '12 consecutive months outside the EU, or 6 years outside Belgium, or fraud'],
        ],
      },
      body: [
        'EU long-term resident status (L card) in Belgium is granted after five years of legal and continuous residence immediately before the application, on these conditions: a valid residence permit, stable and regular means of at least €1,038 for one person plus €346 per dependant, health insurance covering Belgium, and no threat to public order. Absences of less than six consecutive months and at most ten months in total over five years do not break continuity. The application goes to the municipality with Annex 16; if the Immigration Office does not decide within five months, the municipality issues the L card itself. The status is lost after 12 consecutive months outside the EU, or six years outside Belgium.',
        'This is where the open question lies. The same page says the periods counted are those in which you were authorised to stay "for an unlimited period", half of any period of study counts, and residence "for purely temporary reasons" does not. Where a one-to-three-year professional card and the residence tied to it fall in this classification cannot be established from that page; it depends on the interpretation of Article 15bis of the Act of 15 December 1980 and on the Office\'s practice. Until a Belgian immigration lawyer has said in writing that professional card years count, do not write "permanent residence after five years" in any client material. The €1,038 figure is also clearly older than the card\'s €2,408 figure; do not use it for calculations.',
      ],
    },
    {
      heading: 'Applicants from sanctioned countries (e.g. Iran)',
      lead: {
        type: 'checks',
        label: 'Four issues for applicants from sanctioned countries',
        icon: 'alert',
        items: [
          { label: 'Legalising documents', note: 'Iran is not a party to the Apostille Convention' },
          { label: 'Means and banking' },
          { label: 'Police certificate', note: 'from your country of legal residence' },
          { label: 'An Access Point letter from a distance' },
        ],
      },
      checklist: {
        title: 'The legalisation chain for documents from a non-Apostille country such as Iran',
        intro: 'Iran is not a party to the Apostille Convention; this route replaces the apostille and must be followed for every official document.',
        items: [
          'The list of documents to be legalised is closed: diploma or degree, police certificate, financial documents (property deed, bank certificate), company documents.',
          'A sworn translation of each document by an official judiciary-certified translator into English (or Dutch/French).',
          'Certification of the translation by the judiciary\'s office for official translators.',
          'Certification by the country\'s foreign ministry.',
          'Legalisation of the same document by the Belgian embassy in that country (in Tehran, for Iranian documents).',
          'Both the original and the certified translation are attached to the file.',
          'Dates checked: the police certificate and every legalised document must be less than six months old when sent.',
          'If I live outside my country of nationality, the police certificate comes from that country of residence, with its apostille or legalisation, and the file goes to the Belgian embassy there.',
        ],
      },
      body: [
        'These four issues appear in no official table, but for an applicant from a sanctioned country such as Iran they decide the timing and outcome of the file:',
      ],
      terms: [
        {
          term: 'Legalising documents',
          text: 'Iran is not a party to the Apostille Convention. So every Iranian document, from diploma and transcript to police certificate and financial documents, needs the full legalisation chain: sworn translation, certification by the justice ministry and the foreign ministry, then legalisation by the Belgian embassy in Tehran. This chain takes time and money that appear in no official table; plan it at the start of the route, not the end.',
        },
        {
          term: 'Means and banking',
          text: 'The €2,408 a month must be "stable, sufficient and regular" and provable. A balance in an account in your home country with a documented source, a property sale deed or rental income is acceptable if translated and legalised, but moving that money to Belgium after arrival is a separate problem, and opening a Belgian bank account with a passport from a sanctioned country is not easy. If you have an account and banking history outside your home country, build on that.',
        },
        {
          term: 'Police certificate',
          text: 'It is required from your "country of legal residence": if you live in Iran, that means an Iranian police certificate with the legalisation chain; if you live elsewhere, a certificate from that country with its apostille or legalisation. The place to apply is likewise the Belgian embassy in that country of residence, not necessarily Tehran; each post\'s submission and payment procedure differs, and you must coordinate with that post before preparing the file.',
        },
        {
          term: 'An Access Point letter from a distance',
          text: 'Most of these organisations are incubators and universities and assess the project before signing a letter. An online pitch, an MVP or early market data, and a team that can work with them in Dutch or English improve the chances of a letter. Without a letter the 120-day route remains open.',
        },
      ],
    },
    {
      heading: 'Belgium compared with Finland, Bulgaria and the Netherlands',
      lead: {
        type: 'compare',
        caption: 'Four European routes',
        heads: ['Country', 'In its favour', 'Against it'],
        rows: [
          { code: 'be', country: 'Belgium', plus: '30 days with the letter; no fixed capital', minus: '€2,408.79 a month; a one-year bar after a refusal', self: true },
          { code: 'fi', country: 'Finland', plus: 'Business Finland assesses; means about half of Belgium\'s', minus: 'A high refusal rate and a months-long assessment' },
          { code: 'bg', country: 'Bulgaria', plus: '€1,860 for thirty days; a free certificate within 30 days', minus: 'Starts with a one-year certificate' },
          { code: 'nl', country: 'Netherlands', plus: 'Free to re-apply after a refusal', minus: 'A one-year residence permit' },
        ],
      },
      choice: {
        question: 'Which route fits your situation?',
        options: [
          {
            title: 'A big market, and savings for year one',
            body: 'Flanders: €29,000 of documented means, no fixed capital, a 30-day decision with an incubator letter, but a one-year bar after a refusal.',
          },
          {
            title: 'Little money, start with a one-year certificate',
            body: 'Bulgaria: €1,860 in an account for thirty days, a free certificate within 30 days, a 50% share in the company after the visa.',
            cta: {
              label: 'Bulgaria guide',
              href: '/europe/bulgaria',
            },
          },
          {
            title: 'Assessment by the government itself',
            body: 'Finland: Business Finland assesses the project, not an incubator; means about half of Belgium\'s; but a high refusal rate and a months-long assessment.',
            cta: {
              label: 'Finland guide',
              href: '/europe/finland',
            },
          },
        ],
      },
      table: {
        caption: 'Four European routes at a glance',
        head: ['Criterion', 'Belgium (Flanders)', 'Finland', 'Bulgaria', 'Netherlands'],
        rows: [
          [
            'What is issued',
            'Professional card for 1 to 3 years + D visa',
            'Startup residence permit for up to 2 years',
            'One-year certificate + D visa + residence',
            'One-year residence permit',
          ],
          [
            'Who assesses the project',
            'Access Point (incubator/university) + the regional office',
            'Business Finland, a government agency',
            'The innovation ministry\'s expert council',
            'An approved facilitator + RVO',
          ],
          [
            'Personal means',
            '€2,408.79 a month',
            'About €1,030 to €1,210 a month',
            '€1,860, 30 days in an account',
            'Per the RVO rate',
          ],
          ['Fixed company capital', 'None (innovative)', 'None', 'None', 'None'],
          ['Decision time', '30 days with the letter; 120 without', 'Months (two stages)', '30 days for the certificate', 'About 90 days'],
          [
            'After a refusal',
            '1-year bar for the same activity',
            'Free to re-apply',
            'Free to re-apply',
            'Free to re-apply',
          ],
        ],
        note: 'The Finland, Bulgaria and Netherlands figures come from their own guides on this site; each one\'s review date is on its own page.',
      },
      body: [
        'Belgium has the highest means threshold of the four (€2,408 a month against about €1,210 for Finland and €1,860 for the whole period in Bulgaria) but the fastest decision, if you have the letter: 30 days, against 30 days for Bulgaria\'s certificate and months for a Business Finland assessment. It asks for no fixed capital, like Bulgaria and unlike its own economic category. In exchange, dependence on a third party, the incubator, is structural in Belgium, as with the Dutch facilitator and unlike Finland, where the government agency itself assesses.',
        'If you want a big market and a central position in Europe and you have the first year\'s savings, Flanders makes sense. If money is tight and you can start with a one-year certificate, Bulgaria. If you want the government itself, not an incubator, to assess the project, Finland. We have set all three side by side on the comparison page.',
      ],
    },
    {
      heading: 'Our role',
      lead: {
        type: 'checks',
        label: 'What we do',
        items: [
          { label: 'Identifying the category' },
          { label: 'A business plan in the Flemish format' },
          { label: 'Choosing and approaching an Access Point' },
          { label: 'A documents and legalisation plan' },
          { label: 'Year-two readiness' },
        ],
      },
      body: [
        'We are not immigration lawyers or licensed consultants, and we do not file Belgian applications. Our work is the part the Access Point and the economic migration office judge:',
      ],
      bullets: [
        'Identifying the category: innovative or economic, Flanders or Brussels, and whether you meet the means and level 4 diploma conditions, before a single euro is spent.',
        'A business plan in the Flemish format: market, market size, competitors, SWOT, marketing, and a financial plan in the official Excel template, written so both the incubator and the office can read it.',
        'Choosing and approaching an Access Point: which of the 59 organisations fits your field, what it wants, and how to present the project to it so the letter gets signed.',
        'A documents and legalisation plan: the translation and legalisation chain for documents from non-Apostille countries, the procedure of the embassy in your country of residence, and the timing of certificates that are valid for only six months.',
        'Year-two readiness: a company financial structure that passes renewal, not just issue.',
      ],
      callout: 'The legal filing is done by you or by a lawyer or licensed consultant. And if the file is not ready, we stop it from being submitted: a one-year bar costs more than a two-month delay.',
    },
  ],

  faqs: [...COMMON_FAQS, ...DEEP_DIVE_FAQS],
  faqGroups: [
    { heading: 'Frequently asked questions', faqs: COMMON_FAQS },
    { heading: 'Innovation, documents, embassy, renewal, family and long-term residence, in detail', faqs: DEEP_DIVE_FAQS },
  ],

  closing: [
    { label: 'Free route assessment', href: '/which-path' },
    { label: 'Compare with Finland', href: '/europe/finland' },
    { label: 'Compare with Bulgaria', href: '/europe/bulgaria' },
    { label: 'Book a consultation', href: '/book-meeting' },
  ],

  sources: [
    { label: 'Startup.Flanders — Innovation & Startup Permit', url: 'https://www.startupflanders.com/en/permits' },
    { label: 'Flanders.be — Professional card for foreign entrepreneurs (fast track from 1 Sep 2026)', url: 'https://www.vlaanderen.be/en/working-enterprise-and-investment/working/professional-card-for-foreign-entrepreneurs' },
    { label: 'Flanders.be — Requirements for a professional card', url: 'https://www.vlaanderen.be/en/working-enterprise-and-investment/working/professional-card-for-foreign-entrepreneurs/requirements-for-a-professional-card' },
    { label: 'Flanders.be — Applying for your first professional card', url: 'https://www.vlaanderen.be/en/working-enterprise-and-investment/working/professional-card-for-foreign-entrepreneurs/applying-for-your-first-professional-card' },
    { label: 'Flanders.be — Forms and documents (application form updated 14 Oct 2026)', url: 'https://www.vlaanderen.be/en/working-enterprise-and-investment/working/professional-card-for-foreign-entrepreneurs/professional-card-forms-and-documents' },
    { label: 'Startup.Flanders — Innovation & Startup Access Points, partner list (PDF, Aug 2026)', url: 'https://www.startupflanders.com/sites/fit_domains/files/2026-08/innovationstartuppermit_partnerlist_en.pdf' },
    { label: 'Brussels Economy and Employment — Professional card for non-European nationals', url: 'https://economy-employment.brussels/professional-card' },
    { label: 'Wallonie.be — Obtenir une carte professionnelle (not reachable on 5 Nov 2026)', url: 'https://www.wallonie.be/fr/demarches/obtenir-une-carte-professionnelle-pour-travailleur-etranger-independant' },
    { label: 'Immigration Office (IBZ) — Work: regional authorisation, residence, family', url: 'https://dofi.ibz.be/en/themes/third-country-nationals/work' },
    { label: 'Immigration Office (IBZ) — Professional card: D visa documents', url: 'https://dofi.ibz.be/en/themes/ressortissants-dun-pays-tiers/travail/professional-card' },
    { label: 'Immigration Office (IBZ) — Acquisition of long-term resident status in Belgium', url: 'https://dofi.ibz.be/en/themes/third-country-nationals/long-term-resident/acquisition-long-term-resident-status-belgium' },
    { label: 'FPS Foreign Affairs — VisaOnWeb, the federal visa application portal', url: 'https://visaonweb.diplomatie.be' },
  ],
};
