// ============================================================================
// app/[locale]/(public)/faq/en-faqs.ts
// The English FAQ: all 45 questions of content/fa/faq.ts, in the same eight
// groups and the same order, written for an international founder audience.
// Every answer's first sentence stands alone, as on the Persian page: this is
// the page an answer engine quotes.
//
// Persian-audience specifics (paying from Iran, Iranian translations, third-
// country biometrics, US entry restrictions) are kept, each marked with
// `note` so the page labels it "For applicants from Iran and other sanctioned
// countries" instead of making it the page's framing.
//
// Corrections against the Persian module, each checked 2026-10-29:
//  - Estonia means of subsistence: EUR 800 → EUR 880 a month (four times the
//    2026 subsistence level of EUR 220; politsei.ee, and the site's own
//    content/fa/europe-estonia.ts already says 880).
//  - Denmark first-year funds: "about DKK 154,000" → DKK 153,240 for a single
//    applicant (content/fa/europe-denmark.ts, nyidanmark.dk).
//  - Finland funds: "for one year" → for the whole permit period, with the
//    three 2026 regional rates (content/fa/europe-finland.ts, migri.fi).
//  - New Brunswick: age 22–55 → 19–59, CLB 5 → CLB 4, and "3 years'
//    ownership or 5 years' senior management" → two years of qualifying
//    experience in the last five; nomination after six months of operation
//    (gnb.ca Business Immigration Stream page).
//  - Nova Scotia: the CAD 150,000 investment is CAD 100,000 outside Halifax
//    Regional Municipality (liveinnovascotia.com/entrepreneur).
//  - "Where do I start?": six questions → seven (the assessment has seven),
//    and the routes it chooses between are the ones it now scores.
// IRCC's settlement-funds table (29 July 2025), the 10% / 50% / five-owner
// rules and CLB 5 were re-read on canada.ca the same day and are unchanged.
// ============================================================================

export type EnFaq = { q: string; a: string; note?: string };
export type EnFaqGroup = { id: string; heading: string; faqs: EnFaq[]; links: { label: string; href: string }[] };

export const FAQ_UPDATED = { iso: '2026-10-29', label: '29 Oct 2026' };
export const FAQ_PATH = '/faq';

export const FAQ_META = {
  title: 'Startup Visa FAQ: Canada, Europe, PNP and EB-2 NIW',
  description:
    'Direct answers on the paused Canada Start-up Visa, European startup visas, Atlantic Canada entrepreneur streams, costs, documents, EB-2 NIW and our mentorship.',
};

/** Official pages behind the figures. */
export const FAQ_SOURCES: { label: string; url: string }[] = [
  { label: 'IRCC — Start-up Visa Program', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa.html' },
  { label: 'IRCC — Start-up Visa eligibility and proof of funds', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa/eligibility.html' },
  { label: 'IRCC — About the Start-up Visa', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa/about.html' },
  { label: 'IRCC — Designated organizations', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa/eligibility/designated-organizations.html' },
  { label: 'Migri — Start-up entrepreneur (Finland)', url: 'https://migri.fi/en/start-up-entrepreneur' },
  { label: 'New to Denmark — Start-up Denmark', url: 'https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Start-up-Denmark' },
  { label: 'IND — Start-up residence permit (Netherlands)', url: 'https://ind.nl/en/residence-permits/work/start-up' },
  { label: 'Police and Border Guard Board — Start-up entrepreneurs (Estonia)', url: 'https://www.politsei.ee/en/instructions/residence-permit-for-business/for-start-up-entrepreneurs' },
  { label: 'Government of New Brunswick — Business Immigration Stream', url: 'https://www.gnb.ca/en/topic/family-home-community/immigration/provincial-nominee-program/business-immigration-stream.html' },
  { label: 'Nova Scotia Nominee Program — Entrepreneur', url: 'https://liveinnovascotia.com/entrepreneur' },
];

const SANCTIONS = 'For applicants from Iran and other sanctioned countries';

const suv: EnFaq[] = [
  {
    q: 'What is the Canada Start-up Visa?',
    a: 'The Canada Start-up Visa (SUV) is a federal permanent-residence route for founders whose startup is backed by a designated Canadian organization. Instead of personal investment, it relies on a letter of support from an incubator, an angel investor group or a venture capital fund.',
  },
  {
    q: 'Is the Canada Start-up Visa closed?',
    a: 'The Canada Start-up Visa has been paused since 30 June 2026, and IRCC is not accepting new applications. The last way in was to hold a 2025 commitment certificate and file by that date. Applications filed before then are still being processed, and if you are eligible you can still apply for an open work permit. IRCC says a targeted pilot will replace the programme, but it has not published the pilot’s criteria or opening date.',
  },
  {
    q: 'What is the new Canada start-up pilot?',
    a: 'IRCC has said the pause is a transition to a targeted entrepreneur pilot, and so far it has published no details: no cap, no processing target, no criteria and no opening date. The figures circulating online, a cap of about 2,000 people a year and a 12-month target, were reported by the immigration trade press in December 2025; IRCC has not published them. You cannot plan on these numbers.',
  },
  {
    q: 'Is the Canada Start-up Visa legitimate or a scam?',
    a: 'The Start-up Visa was, and is, an official Government of Canada programme, but it has been paused since 30 June 2026 and accepts no new applications. So anyone selling “Start-up Visa registration” or “a reserved place in the new programme” today is selling something that does not exist. A “guaranteed letter of support” or a “guaranteed visa” never means anything: no intermediary can guarantee the designated organization’s decision or IRCC’s.',
  },
  {
    q: 'How much money do you need for the Canada Start-up Visa?',
    a: 'The Canada Start-up Visa sets no minimum personal investment. What it required was settlement funds for your family: under IRCC’s table updated on 29 July 2025, CAD 15,263 for one person and CAD 28,362 for a family of four. On top of that come the real costs of setting up, the incubator programme, translation, travel and a lawyer.',
  },
  {
    q: 'What happens to a Start-up Visa application I have already filed?',
    a: 'Applications accepted before 30 June 2026 are still being processed; the pause does not mean they are refused. While yours is processed, you can apply for an open work permit if you are eligible. IRCC does not currently publish a processing time for this programme, so we do not quote one; the economic-class backlog given as the reason for the pause was reported by the specialist press at about 43,000 applications.',
  },
  {
    q: 'What is a designated organization in the Canada Start-up Visa?',
    a: 'A designated organization is a Canadian incubator, angel investor group or venture capital fund that IRCC has recognised as qualified to assess startups. Without a letter of support from one of them, there is no Start-up Visa application.',
  },
  {
    q: 'What language test does the Canada Start-up Visa require?',
    a: 'At least CLB 5 in English or French in all four skills, from an IRCC-approved test such as IELTS General Training or CELPIP General. IELTS Academic is not accepted, and the designated organization’s interview demands far more than this minimum.',
  },
  {
    q: 'Can I apply for the Start-up Visa with my co-founders?',
    a: 'Yes: up to five people can apply on one startup. Each must hold at least 10% of the voting rights, and all the applicants together with the designated organization must hold more than 50%; the language and settlement-funds requirements apply to each person separately.',
  },
  {
    q: 'What is the Start-up Visa work permit?',
    a: 'It is a work permit that lets a Start-up Visa applicant work in Canada before the final permanent-residence decision. IRCC says that if you are eligible you can still apply for an open work permit so you can work while your application is processed; “open” means it is not tied to one employer. Extending a Start-up Visa work permit is a separate route that is closed to new applicants: it is only for people who already hold that permit. The permit does not guarantee permanent residence. Check both points on IRCC’s site before you act.',
  },
  {
    q: 'If my startup fails, do I lose Canadian permanent residence?',
    a: 'No: once granted, Start-up Visa permanent residence does not depend on the startup’s commercial success. What IRCC looks at is whether, when you applied, you were genuinely and actively building the business.',
  },
];

const europe: EnFaq[] = [
  {
    q: 'Which European countries have a startup visa?',
    a: 'Denmark (Start-up Denmark), the Netherlands (startup visa), Finland (startup permit) and Estonia (startup visa) are the most active routes for non-EU founders. None of them requires an investment; in each, an expert body — a government panel, a facilitator or a committee — assesses your business.',
  },
  {
    q: 'What are the requirements for the Finland startup visa?',
    a: 'At least two founders who relocate to Finland, an eligibility statement from Business Finland, an internationally scalable business, and proof of means for the whole permit period: in 2026, EUR 1,210 a month for one person in the capital region, EUR 1,090 in other large cities and EUR 1,030 elsewhere. No investment is required.',
  },
  {
    q: 'How does the Denmark startup visa work?',
    a: 'Start-up Denmark’s expert panel assesses your business plan in about six weeks; if it approves, you get a residence and work permit for up to two years. A solo founder or a team of up to three is accepted, and there is no fixed capital threshold; first-year funds are DKK 153,240 for a single applicant.',
  },
  {
    q: 'What are the requirements for the Netherlands startup visa?',
    a: 'The key condition in the Netherlands is a signed agreement with an RVO-approved facilitator: an accelerator or official mentor who supports your startup for a year. No investment is required, but the product must be genuinely new to the Dutch market and you need means for the whole period. The first permit lasts up to 12 months, after which you apply for a self-employed residence permit.',
  },
  {
    q: 'How long does the Estonia startup visa take?',
    a: 'Estonia’s Startup Committee usually decides within 10 working days. After that, the D visa or temporary residence permit at a mission takes a few weeks to two months. The whole route can take under three months, and the means requirement is only EUR 880 a month.',
  },
  {
    q: 'Denmark, the Netherlands, Finland or Estonia: which one is for me?',
    a: 'A serious team of two and a strong ecosystem: Finland. A solo founder with a reasonable budget who wants a government assessment: Denmark. A founder who welcomes working with an accelerator and wants the Western European market: the Netherlands. Speed and the lowest cost with an MVP ready: Estonia. The free route assessment makes this choice from your own answers.',
  },
];

const atlantic: EnFaq[] = [
  {
    q: 'What are the requirements for the New Brunswick entrepreneur stream?',
    a: 'New Brunswick’s Business Immigration Stream asks for a personal net worth of at least CAD 500,000, an investment of at least CAD 150,000, at least one full-time job created, age 19 to 59, CLB 4, two years of qualifying business ownership or senior-management experience in the last five, and at least 65 points on the province’s selection grid. You can ask for nomination after six months of running the business.',
  },
  {
    q: 'What are the requirements for the Nova Scotia entrepreneur stream?',
    a: 'A net worth of at least CAD 600,000 (CAD 400,000 outside Halifax), an investment of at least CAD 150,000 (CAD 100,000 outside Halifax), ownership of at least 33%, three years of ownership or five years of senior management, and twelve months actively running the business on a work permit before nomination.',
  },
  {
    q: 'How long do the Atlantic Canada entrepreneur routes take?',
    a: 'A few months to a work permit, with a ready file and an invitation; realistically two to three and a half years to permanent residence, counting the period for meeting your commitments and federal processing.',
  },
  {
    q: 'Do I have to travel to Canada for the Atlantic entrepreneur routes?',
    a: 'An exploratory visit is not a legal requirement, but it earns points and in practice is almost essential.',
    note: 'For an applicant from Iran, the visit means a Canadian visitor visa: a separate application with a real chance of refusal, which you should work on before anything else.',
  },
];

const cost: EnFaq[] = [
  {
    q: 'What does the Canada Start-up Visa cost in total?',
    a: 'Not counting settlement funds, the total cost of the Start-up Visa route for a typical family commonly ran between CAD 30,000 and 70,000. That covers government fees, the incubator programme, preparation, a lawyer, translation and travel for biometrics, and it varies widely with your choice of designated organization and how much of the work you do yourself.',
    note: 'The estimate was built for a family applying from Iran, which includes travel to a third country for biometrics.',
  },
  {
    q: 'What are the IRCC government fees for the Start-up Visa?',
    a: 'For a family of four, IRCC government fees usually total CAD 4,000 to 5,000: the principal applicant’s processing fee, the right of permanent residence fee, the spouse’s and children’s fees, biometrics and the medical exam. Take the exact current figures from IRCC’s site.',
  },
  {
    q: 'How much does an incubator cost for the Start-up Visa?',
    a: 'Most designated incubator programmes charge a programme fee, commonly between CAD 10,000 and 40,000. The fee pays for a real programme, not for the letter of support; the letter is the result of an assessment and may not be issued.',
  },
  {
    q: 'Which fees in startup immigration are signs of a scam?',
    a: 'A fixed-price “guaranteed letter of support”, a “guaranteed visa”, a large payment before any assessment, a claim to an “exclusive designated organization”, and selling a “ready-made team” or a “ready-made startup” are all signs of a scam. None of these exists in the programme’s rules.',
  },
  {
    q: 'Can I pay IRCC fees from a sanctioned country such as Iran?',
    a: 'IRCC fees are paid online by international credit card only, and Iranian cards do not work. You need an account or card in a third country, and it is best to solve this before you start your application.',
    note: 'This applies to anyone whose banking is cut off by sanctions.',
  },
];

const docs: EnFaq[] = [
  {
    q: 'What documents do you need for the Canada Start-up Visa?',
    a: 'A valid passport, the designated organization’s letter of support, language test results, proof of settlement funds, your Canadian company documents, education and work records, police certificates, a medical exam, photos and the official forms, and family documents.',
    note: 'For applicants from Iran, every Persian document needs a certified translation.',
  },
  {
    q: 'What does a certified translation mean for documents from Iran?',
    a: 'It means a translation made, stamped and signed by a translator certified by Iran’s judiciary, submitted with a copy of the original document. An informal translation, or one you make yourself, is not accepted, and some documents also need the approval of the Justice Department and the Ministry of Foreign Affairs.',
    note: 'This answer is specific to documents issued in Iran.',
  },
  {
    q: 'How much are the settlement funds for the Canada Start-up Visa?',
    a: 'Settlement funds depend on the size of your family, and IRCC updates the table every year. In the table of 29 July 2025: CAD 15,263 for one person, CAD 19,001 for two, CAD 23,360 for three and CAD 28,362 for a family of four. The money must be available and transferable, have a provable source, and not be borrowed.',
  },
  {
    q: 'How do I prove settlement funds under sanctions?',
    a: 'Under sanctions, funds are proven with transparent account statements, documents showing where the money came from (a property sale, an inheritance, company profits) and usually an account in a third country with a record of legal transfers. Informal transfers and cash with no history cannot be proven, and the process takes several months.',
    note: 'This applies to applicants from Iran and other countries under banking sanctions.',
  },
  {
    q: 'Where do Iranian applicants give biometrics and attend interviews for Canada?',
    a: 'Canada has no active embassy in Iran, so Iranian applicants give biometrics, take the medical exam and attend any interview in a third country, usually Dubai, Yerevan, Ankara or Tbilisi. The travel, that country’s visa and the cost need to be in your plan from the start.',
    note: 'This answer is specific to applicants living in Iran.',
  },
];

const pnp: EnFaq[] = [
  {
    q: 'What is a Canadian Provincial Nominee Program (PNP)?',
    a: 'A Provincial Nominee Program lets each Canadian province nominate people who fit its economic needs for permanent residence. A provincial nomination is not residence on its own, but it carries great weight and adds 600 points in Express Entry.',
  },
  {
    q: 'Is a PNP better than the Canada Start-up Visa?',
    a: 'Neither is better: they were designed for two different kinds of applicant. A PNP suits a conventional business with capital, or a specialist a province needs; the Start-up Visa suited an innovative startup with no large personal investment. Choosing the wrong one costs years and tens of thousands of dollars. Note that the Start-up Visa has been paused since 30 June 2026.',
  },
  {
    q: 'What is the minimum investment for a Canadian provincial entrepreneur route?',
    a: 'It depends on the province and region: from about CAD 100,000 in small communities to over CAD 1 million in the big cities, plus a separate minimum net worth. The figures change every year and must be taken from each province’s official site.',
  },
  {
    q: 'Which Canadian province is best for entrepreneur immigration?',
    a: 'There is no “best” province; the right one depends on your capital, your type of business and whether you are ready to live outside a big city. The smaller provinces and Atlantic Canada have lower thresholds and less competition; Ontario and British Columbia have bigger networks and more competition.',
  },
];

const usa: EnFaq[] = [
  {
    q: 'What is the EB-2 NIW?',
    a: 'The EB-2 NIW is a US immigrant visa for professionals whose work has national importance and who are therefore exempted from needing an employer and a job offer. You petition for yourself, and you are assessed against the three prongs of the Dhanasar decision.',
  },
  {
    q: 'Is the EB-2 NIW possible for Iranian nationals?',
    a: 'Approval of an EB-2 NIW petition (Form I-140) is possible for Iranian nationals and happens every year. The obstacle is the visa stage: the entry restrictions on Iranian nationals in force since 2025 have severely limited immigrant-visa issuance at consulates for people living in Iran; those already in the US in lawful status are least affected.',
    note: 'The same visa-stage question applies to nationals of any country under US entry restrictions.',
  },
  {
    q: 'What is the difference between the EB-2 NIW and the EB-1A?',
    a: 'The EB-1A is for people of extraordinary ability at the very top of their field and has much harder criteria; the EB-2 NIW is for a strong professional whose work has national importance. Many applicants refused an EB-1A are approved for the NIW.',
  },
  {
    q: 'Do I need a PhD for the EB-2 NIW?',
    a: 'No: the minimum for the EB-2 NIW is a master’s degree, or a bachelor’s degree plus five years of progressive experience. A PhD makes the case stronger but is not required, and founders with a strong executive record have been approved too.',
  },
];

const us: EnFaq[] = [
  {
    q: 'What does VisaRoads do?',
    a: 'VisaRoads prepares founders and their businesses for assessment by designated organizations and startup immigration routes: an honest assessment, business plan, financial model, pitch deck and interview practice. VisaRoads Inc., an Ashavid company, is based in Toronto and is not an immigration law firm.',
  },
  {
    q: 'Is VisaRoads an immigration lawyer?',
    a: 'No: VisaRoads is not an immigration lawyer or a regulated Canadian immigration consultant (RCIC) and does not file immigration applications. Our work comes before the application — preparing the business and the founder — and the filing is done by a licensed lawyer or consultant.',
  },
  {
    q: 'How does the VisaRoads mentorship work?',
    a: 'The mentorship programme runs for eight weeks online, with a concrete deliverable each week: from diagnosis and market research to the business plan, financial model, pitch deck, interview simulation and roadmap. All deliverables are in English.',
    note: 'On the Persian-language programme, sessions are held in Persian.',
  },
  {
    q: 'How much do VisaRoads services cost?',
    a: 'The fee is set after a free assessment and a first conversation, based on the work actually needed, not one fixed price for everyone. A fixed price quoted before anyone has seen your business means nobody has looked at your business.',
  },
  {
    q: 'How do I contact VisaRoads?',
    a: 'The fastest way is Telegram (@farjadtalks). The main number, +1 (613) 515-0727, works for calls and WhatsApp, and the email addresses are farjad@visaroads.com and mohsen@visaroads.com. You can also take the free route assessment on the site, book a free online consultation, or register for the free webinar.',
  },
  {
    q: 'Where do I start?',
    a: 'With the free route assessment: seven short questions that tell you which route — a European startup visa, Türkiye’s tech visa, an Atlantic Canada entrepreneur stream or the EB-2 NIW — fits your situation today, and what is still missing. Sometimes the right answer is “not yet”.',
  },
];

export const FAQ_GROUPS: EnFaqGroup[] = [
  {
    id: 'canada-start-up-visa',
    heading: 'Canada Start-up Visa: where it stands now',
    faqs: suv,
    links: [{ label: 'Canada Start-up Visa guide', href: '/startup-visa-canada' }],
  },
  {
    id: 'europe',
    heading: 'European startup visas',
    faqs: europe,
    links: [
      { label: 'Finland', href: '/country/finland' },
      { label: 'Denmark', href: '/country/denmark' },
      { label: 'Netherlands', href: '/europe/netherlands' },
      { label: 'Estonia', href: '/europe/estonia' },
    ],
  },
  {
    id: 'atlantic-canada',
    heading: 'Atlantic Canada entrepreneur routes',
    faqs: atlantic,
    links: [
      { label: 'New Brunswick guide', href: '/pnp/new-brunswick' },
      { label: 'Nova Scotia guide', href: '/pnp/nova-scotia' },
    ],
  },
  {
    id: 'costs',
    heading: 'Costs',
    faqs: cost,
    links: [{ label: 'Canada Start-up Visa guide', href: '/startup-visa-canada' }],
  },
  {
    id: 'documents',
    heading: 'Documents, and notes for applicants from Iran',
    faqs: docs,
    links: [{ label: 'Canada Start-up Visa guide', href: '/startup-visa-canada' }],
  },
  {
    id: 'provincial-programs',
    heading: 'Provincial Nominee Programs',
    faqs: pnp,
    links: [{ label: 'All provincial entrepreneur programs', href: '/pnp' }],
  },
  {
    id: 'eb-2-niw',
    heading: 'US EB-2 NIW',
    faqs: usa,
    links: [
      { label: 'EB-2 NIW guide', href: '/usa/eb2-niw' },
      { label: 'US routes for founders', href: '/country/usa' },
    ],
  },
  {
    id: 'about-us',
    heading: 'About us and the mentorship',
    faqs: us,
    links: [
      { label: 'Free route assessment', href: '/which-path' },
      { label: 'The mentorship', href: '/mentorship' },
      { label: 'Book a free session', href: '/book-meeting' },
      { label: 'Free webinar', href: '/webinar' },
    ],
  },
];

export const FAQ_SANCTIONS_LABEL = SANCTIONS;
export const ALL_FAQS: EnFaq[] = FAQ_GROUPS.flatMap((g) => g.faqs);
