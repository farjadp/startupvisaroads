// ============================================================================
// lib/social/destinations.ts
// Where a published article goes, as data.
//
// lib/socials.ts assumes one destination per platform: one LinkedIn author,
// one X account. Farjad wants three LinkedIn destinations and two X accounts,
// which under that assumption is three code paths and two more. As data it is
// a list, one destination can be disabled without touching the others, and
// adding the AshaVid page is an entry rather than a branch.
//
// `configured` exists because "never set up" and "tried and failed" need
// different responses from a human. Every social system in this repo was found
// today built, wired and silently doing nothing because nobody could tell the
// two apart.
// ============================================================================

export type Platform = 'telegram' | 'linkedin' | 'x';
export type Locale = 'en' | 'fa';

export type Destination = {
  /** Stable id; also the value stored in SocialPost.destination. */
  id: string;
  platform: Platform;
  /** Human name, for the digest and the admin console. */
  label: string;
  /** Article locales this destination accepts. */
  locales: Locale[];
  /** Every credential key that must be present before a send is attempted. */
  credentials: string[];
  /**
   * Whether a published article posts here without a human. Auto-posting was
   * Farjad's decision; this flag is the escape hatch, so one destination can
   * be moved to review without a redesign.
   */
  autoPost: boolean;
};

export const DESTINATIONS: Destination[] = [
  {
    id: 'telegram-channel',
    platform: 'telegram',
    label: 'Telegram @visaroads',
    // Persian only. The channel is «مهاجرت از طریق استارتاپ ویزا» — Persian
    // name, Persian description, Persian audience — so an English article
    // would arrive as noise. Widen this array if that changes; nothing else
    // has to move.
    locales: ['fa'],
    // @herosjourney_bot ("Farjad's Digital Twins"), already an administrator
    // of the channel. Deliberately not the support bot: when that token died
    // today it took every lead form with it, and publishing must not be able
    // to break lead capture.
    credentials: ['TELEGRAM_CHANNEL_BOT_TOKEN', 'TELEGRAM_CHANNEL_ID'],
    autoPost: true,
  },

  // LinkedIn. One app, one access token, three author URNs — the personal
  // profile needs w_member_social, each company page needs
  // w_organization_social plus page-admin rights on that page.
  //
  // ⚠️ THE TOKEN EXPIRES IN ABOUT SIXTY DAYS. Farjad chose a calendar reminder
  // over a refresh flow, which is a legitimate trade for three destinations —
  // but it means that on roughly 5 Nov 2026 these three go quiet. The digest
  // is what turns that from a silent death into a line in a message: a
  // destination whose attempts all fail is reported the next morning.
  {
    id: 'linkedin-farjad',
    platform: 'linkedin',
    label: 'LinkedIn — Farjad',
    locales: ['fa', 'en'],
    credentials: ['LINKEDIN_ACCESS_TOKEN', 'LINKEDIN_AUTHOR_URN'],
    autoPost: true,
  },
  {
    id: 'linkedin-visaroads',
    platform: 'linkedin',
    label: 'LinkedIn — VisaRoads page',
    locales: ['fa', 'en'],
    credentials: ['LINKEDIN_ACCESS_TOKEN', 'LINKEDIN_ORG_URN_VISAROADS'],
    autoPost: true,
  },
  {
    id: 'linkedin-ashavid',
    platform: 'linkedin',
    label: 'LinkedIn — AshaVid page',
    // AshaVid is the AI venture, not the immigration brand. English only:
    // its audience is not the Persian founder the /fa articles address.
    locales: ['en'],
    credentials: ['LINKEDIN_ACCESS_TOKEN', 'LINKEDIN_ORG_URN_ASHAVID'],
    autoPost: true,
  },
];

export function destinationsFor(locale: Locale): Destination[] {
  return DESTINATIONS.filter((d) => d.locales.includes(locale));
}

/**
 * True only when every credential the destination needs has a non-empty value.
 * An unset environment variable reads as an empty string as often as it reads
 * as undefined, and a half-configured destination fails at send time with a
 * far less useful error than "not configured".
 */
export function configured(d: Destination, values: Record<string, string | undefined>): boolean {
  return d.credentials.every((k) => Boolean(values[k]?.trim()));
}
