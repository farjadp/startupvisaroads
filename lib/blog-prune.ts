// ============================================================================
// lib/blog-prune.ts
// The October 2026 prune of the English blog. Every post below is from the
// June–July 2026 batch: 276–773 words, no link to any official source, and
// most of them near-duplicates of each other ("Navigating the Dutch Startup
// Visa…", "Launching Your Startup in Europe…", "The Ultimate Guide to…").
// Crawled on 2026-10-13; the 33 September–October posts are untouched.
//
// MERGED posts answer 301 to the guide that now covers the topic properly.
// GONE posts are off-topic for a startup-visa site (employer-of-record
// adverts, co-working rentals, asylum, UK routes we do not work on) and
// answer 410, so Google drops them instead of reading a redirect as a soft
// 404. Both sets are kept out of the sitemap.
//
// To restore a post, delete its line. Nothing is deleted from the database.
// ============================================================================

/** Post path -> the page that replaces it (301). */
export const PRUNE_MERGED: Record<string, string> = {
  // Canada Start-Up Visa, written before or around the 30 June 2026 pause.
  '/en/blog/navigating-canadas-start-up-visa-program-in-2026-essential-insights-for-founders': '/en/startup-visa-canada',
  '/en/blog/unveiling-the-startup-visa-application-backlog-challenges-and-strategic-shifts': '/en/startup-visa-canada',
  '/en/blog/navigating-the-complexities-of-canadas-start-up-business-class-2026-a-strategic-guide': '/en/startup-visa-canada',
  '/en/blog/understanding-canadas-paused-start-up-visa-program-what-entrepreneurs-need-to-know': '/en/startup-visa-canada',
  '/en/blog/new-improvements-to-canadas-start-up-visa-and-self-employed-persons-programs': '/en/startup-visa-canada',
  '/en/blog/canadas-start-up-visa-overhaul-whats-next-for-entrepreneurs': '/en/startup-visa-canada',
  '/en/blog/canadas-start-up-visa-dilemma-structural-failures-and-future-directions': '/en/startup-visa-canada',

  // Canada, provincial and Express Entry.
  '/en/blog/new-brunswick-business-immigration-stream-nbbis-fast-track-to-canadian-pr-in-6-months': '/en/pnp/new-brunswick',
  '/en/blog/entrepreneur-immigration-streams-in-canada-navigating-the-2026-landscape': '/en/pnp',
  '/en/blog/ultimate-guide-to-the-ontario-workforce-priority-stream-for-permanent-residence': '/en/pnp/ontario',
  '/en/blog/mastering-canadas-express-entry-category-based-selection-evolution-2024-2025': '/en/tools/express-entry',

  // Netherlands: twelve variations on one guide.
  '/en/blog/comprehensive-guide-to-facilitators-for-startups-in-the-netherlands': '/en/europe/netherlands',
  '/en/blog/launch-your-startup-in-the-netherlands-the-ultimate-guide-to-the-startup-visa-program': '/en/europe/netherlands',
  '/en/blog/navigating-the-dutch-startup-visa-process-a-comprehensive-guide': '/en/europe/netherlands',
  '/en/blog/launching-your-startup-in-europe-the-comprehensive-guide-to-the-netherlands-startup-visa': '/en/europe/netherlands',
  '/en/blog/navigating-the-dutch-startup-visa-a-comprehensive-guide-for-entrepreneurs': '/en/europe/netherlands',
  '/en/blog/the-ultimate-guide-to-the-netherlands-residence-permit-for-foreign-startups': '/en/europe/netherlands',
  '/en/blog/a-comprehensive-guide-to-establishing-a-startup-in-the-netherlands': '/en/europe/netherlands',
  '/en/blog/a-comprehensive-guide-to-funding-your-startup-in-the-netherlands': '/en/europe/netherlands',
  '/en/blog/applying-for-mvv-and-residence-permit-from-abroad-comprehensive-guide': '/en/europe/netherlands',
  '/en/blog/navigating-the-mvv-your-guide-to-long-term-stays-in-the-netherlands': '/en/europe/netherlands',
  '/en/blog/the-ultimate-guide-to-applying-for-an-mvv-visa-sticker-for-the-netherlands-from-canada': '/en/europe/netherlands',
  '/en/blog/comprehensive-guide-to-applying-for-a-dutch-visa-navigate-the-application-process-with-confidence': '/en/europe/netherlands',
  '/en/blog/comprehensive-guide-to-visa-types-for-the-netherlands-what-you-need-to-know': '/en/europe/netherlands',
  '/en/blog/navigating-the-netherlands-orientation-year-residence-permit': '/en/europe/netherlands',
  '/en/blog/navigating-change-inds-call-for-stable-policies-amidst-major-shifts': '/en/europe/netherlands',

  // Denmark.
  '/en/blog/understanding-the-denmark-startup-visa-a-comprehensive-guide': '/en/country/denmark',
  '/en/blog/ultimate-guide-to-the-start-up-denmark-scheme-innovate-and-expand-your-business-in-denmark': '/en/country/denmark',
  '/en/blog/comprehensive-guide-to-starting-your-business-in-denmark': '/en/country/denmark',
  '/en/blog/invest-and-settle-in-denmark-through-the-startup-denmark-visa-program': '/en/country/denmark',

  // Finland.
  '/en/blog/comprehensive-guide-to-family-residency-for-finland-startup-visa-applicants': '/en/country/finland',
  '/en/blog/financial-requirements-for-migrating-to-finland-via-the-startup-visa': '/en/country/finland',
  '/en/blog/comprehensive-guide-to-finlands-startup-visa-a-pathway-for-innovators': '/en/country/finland',

  // Türkiye.
  '/en/blog/comprehensive-guide-to-turkeys-startup-visa-and-tech-ecosystem': '/en/country/turkey',
  '/en/blog/exploring-turkeys-top-techno-parks-benefits-and-drawbacks': '/en/country/turkey',
  '/en/blog/navigating-the-turkiye-tech-visa-detailed-process-and-bottlenecks': '/en/country/turkey',
  '/en/blog/exploring-the-opportunities-and-advantages-of-turkeys-tech-visa': '/en/country/turkey',
  '/en/blog/turkey-tech-visa-an-essential-guide-for-global-founders-2025-2026': '/en/country/turkey',

  // United States.
  '/en/blog/key-differences-between-e-2-visa-and-international-entrepreneur-rule-ier': '/en/usa/e-2',
  '/en/blog/navigating-the-updated-international-entrepreneur-rule-a-comprehensive-guide-for-2024': '/en/country/usa',
  '/en/blog/a-comprehensive-guide-to-the-international-entrepreneur-rule-ier-in-the-usa': '/en/country/usa',

  // Australia, Estonia and the global overviews.
  '/en/blog/the-complete-guide-to-australias-subclass-858-national-innovation-visa': '/en/country/australia',
  '/en/blog/unlocking-your-business-potential-the-estonian-startup-visa': '/en/country',
  '/en/blog/comprehensive-guide-to-active-startup-visa-programs-globally': '/en/country',
};

/** Off-topic posts with no page to inherit them (410). */
export const PRUNE_GONE: ReadonlySet<string> = new Set([
  // Employer-of-record and hiring adverts.
  '/en/blog/mastering-us-recruitment-and-compliance-with-g-p-giatm',
  '/en/blog/mastering-us-hiring-with-an-employer-of-record-eor',
  '/en/blog/expanding-into-germany-with-g-p-eortm-a-comprehensive-guide-to-seamless-hr-management',
  '/en/blog/mastering-global-hiring-with-g-p-eor-a-comprehensive-guide',
  '/en/blog/navigating-the-complex-landscape-of-hiring-in-germany-with-g-p-eortm',
  '/en/blog/leveraging-ai-for-global-talent-and-compliance-a-competitive-edge-for-startups',
  // Office rentals.
  '/en/blog/finding-the-perfect-co-working-space-in-the-netherlands',
  '/en/blog/the-ultimate-guide-to-renting-a-meeting-room-in-the-netherlands',
  // Routes and topics outside what we do.
  '/en/blog/streamlining-asylum-processes-how-the-ind-is-reducing-application-waiting-times',
  '/en/blog/the-innovator-founder-visa-a-comprehensive-guide-for-aspiring-entrepreneurs-in-the-uk',
  '/en/blog/exploring-the-uk-global-entrepreneur-programme-your-launchpad-to-global-expansion',
  '/en/blog/navigating-the-uk-innovator-founder-and-scale-up-visa-endorsing-bodies',
  '/en/blog/navigating-european-expansion-choosing-between-the-uk-and-netherlands-for-startups',
  '/en/blog/visa-application-help-a-comprehensive-guide-for-success',
  '/en/blog/a-guide-to-canadas-latest-regulatory-developments-banking-appointments-and-environmental-protection',
  '/en/blog/quebecs-peq-program-reopening-in-2026-key-details-and-steps-to-apply',
  '/en/blog/understanding-the-c10-significant-benefit-work-permit-a-strategic-lmia-exempt-pathway',
]);
