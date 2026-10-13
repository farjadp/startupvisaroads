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
