// ============================================================================
// content/contact.ts
// The company's main contact details — one source of truth for every page,
// both locales, the footer, the inner-page contact box and the Organization
// JSON-LD. Provided by the founder (2026-09-14). Personal lines per team
// member live in content/team.ts.
// ============================================================================

export const MAIN_CONTACT = {
  /** The main line. Phone and WhatsApp on the same number. */
  phone: '+1 (613) 515-0727',
  phoneE164: '+16135150727',
  tel: 'tel:+16135150727',
  whatsapp: 'https://wa.me/16135150727',
  emails: ['farjad@visaroads.com', 'mohsen@visaroads.com'] as const,
  email: 'farjad@visaroads.com',
  /** Partnerships and account questions go to the COO. */
  b2bEmail: 'mohsen@visaroads.com',
  telegram: 'https://t.me/farjadtalks',
  telegramHandle: '@farjadtalks',
  youtube: 'https://www.youtube.com/@ashavidgroup',
  youtubeHandle: '@ashavidgroup',
};

/**
 * The founder's own public profiles, as already linked from the Persian site
 * and the video schema. Used for the founder's schema.org Person `sameAs`,
 * which is what lets an answer engine tie "Farjad" on this site to the same
 * person on LinkedIn and YouTube.
 */
/**
 * The person who reviews articles after publication. Name and background as
 * given by the founder on 13 Oct 2026, who confirmed she is a real reviewer.
 * Nothing beyond what he stated: no photo, no profile links, no titles.
 */
export const REVIEWER = {
  name: 'Roya Jahanbin',
  nameFa: 'رویا جهان‌بین',
  role: 'Immigration specialist',
  roleFa: 'کارشناس مهاجرت',
  bio: 'Immigration specialist with more than 15 years at immigration firms, across most countries and routes.',
  bioFa: 'کارشناس مهاجرت با بیش از ۱۵ سال سابقه در مؤسسات مهاجرتی و آشنا با بیشتر کشورها و مسیرها.',
};

/** Articles are reviewed after publication; the credit appears once this much time has passed. */
export const REVIEW_LAG_DAYS = 7;

export const FOUNDER = {
  name: 'Farjad Pourmohammad',
  /** As the team page shows it. */
  shortName: 'Farjad P.M.',
  jobTitle: 'Startup Mentor & Founder of Ashavid',
  linkedin: 'https://www.linkedin.com/in/farjadpourmohammad/',
  youtube: 'https://www.youtube.com/@FarjadTalks',
  instagram: 'https://instagram.com/FarjadTalks',
  telegram: 'https://t.me/farjadtalks',
};
