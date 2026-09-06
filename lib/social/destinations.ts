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
  /**
   * Hard character limit, when the platform imposes one on this account.
   * Absent means long-form is available — an X Premium account, or Telegram.
   * This is per destination and not per platform because the two X accounts
   * differ: one is Premium and one is not.
   */
  charLimit?: number;
  /**
   * Appended to every message. Farjad asked that his personal account state
   * that the content was sent by his digital assistant — a disclosure, so it
   * is part of the message rather than an option.
   */
  signature?: string;
  /** Links to carry alongside the article's own, in order. */
  links?: string[];
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

  // LinkedIn. TWO apps, not one, so two access tokens:
  //   VisaRoads       (client 863609ky517yrf) → the VisaRoads page
  //   PersonalWebsite (client 785zxi5h7u7e6v) → the Ashavid page
  // The personal profile is authorised through whichever app the member
  // consents to; it is given its own key so the three never share a fate.
  //
  // A client secret is NOT one of these values. It identifies the app; posting
  // needs an access token from the OAuth authorisation-code flow, carrying
  // w_member_social for the profile and w_organization_social for a page,
  // where the member is also an admin of that page.
  //
  // ⚠️ EACH TOKEN LIVES TWO MONTHS — LinkedIn shows 5184000 seconds in the app
  // settings. Farjad chose a calendar reminder over a refresh flow, which is a
  // fair trade for three destinations, but it means they go quiet around
  // 5 Nov 2026. The digest is what turns that from a silent death into a line
  // in a message: a destination whose attempts all fail is named the next
  // morning.
  // Farjad's personal profile is deliberately NOT a destination. He asked for
  // the company pages only: a personal feed is a person talking, and filling
  // it automatically with brand posts costs the thing that makes it worth
  // following. Re-add it as an entry if that ever changes — nothing else has
  // to move, which is the point of keeping destinations as data.
  {
    id: 'linkedin-visaroads',
    platform: 'linkedin',
    label: 'LinkedIn — VisaRoads page',
    locales: ['fa', 'en'],
    credentials: ['LINKEDIN_TOKEN_VISAROADS', 'LINKEDIN_ORG_URN_VISAROADS'],
    autoPost: true,
  },
  {
    id: 'linkedin-ashavid',
    platform: 'linkedin',
    label: 'LinkedIn — AshaVid page',
    // AshaVid is the AI venture, not the immigration brand. English only:
    // its audience is not the Persian founder the /fa articles address.
    locales: ['en'],
    credentials: ['LINKEDIN_TOKEN_ASHAVID', 'LINKEDIN_ORG_URN_ASHAVID'],
    autoPost: true,
  },

  // X. Each destination carries its OWN consumer key as well as its own user
  // tokens. One app can serve both accounts — the PIN flow lets any account
  // authorise it — but the two X accounts here sit under two separate
  // developer accounts, each with its own project and app, so there is no
  // shared consumer key to point at. Per-destination keys work either way,
  // and a destination borrowing another app's key fails with an
  // authentication error that looks nothing like the real cause.
  //
  // An X Premium subscription grants none of this: Premium is the consumer
  // product. Posting programmatically needs a developer account, an app with
  // its permission set to Read and Write (the default is Read only, and a
  // token minted before that change stays read-only), and user tokens per
  // account. scripts/x-setup.ts runs the flow that produces the second
  // account's tokens.
  {
    id: 'x-farjad',
    platform: 'x',
    label: 'X — Farjad (Persian)',
    // Persian only. This is the personal account and it carries the Persian
    // lane; the English lane is AshaVid's. They are two audiences, not one
    // audience in two languages.
    locales: ['fa'],
    credentials: ['X_KEY_FARJAD', 'X_KEYSECRET_FARJAD', 'X_TOKEN_FARJAD', 'X_SECRET_FARJAD'],
    autoPost: true,
    // No charLimit: the account has Premium, so long-form is available and the
    // 240-character truncation in the legacy poster must not reach it.
    signature: 'ارسال‌شده توسط دستیار دیجیتال فرجاد',
    links: ['https://t.me/visaroads', 'https://farjadp.info', 'https://www.visaroads.com'],
  },
  {
    id: 'x-ashavid',
    platform: 'x',
    label: 'X — AshaVid (English)',
    // English only, for the same reason as the AshaVid LinkedIn page: it is
    // the AI venture, not the immigration brand.
    locales: ['en'],
    credentials: ['X_KEY_ASHAVID', 'X_KEYSECRET_ASHAVID', 'X_TOKEN_ASHAVID', 'X_SECRET_ASHAVID'],
    autoPost: true,
    // Not a Premium account — the profile still shows the "get verified"
    // prompt — so this lane lives inside the standard limit.
    charLimit: 280,
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
