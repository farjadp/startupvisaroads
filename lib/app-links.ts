// Store listings for the VisaRoads mobile app (com.ashavid.visaroads). One
// place for every page, schema and file that links to a store. A listing is
// null until it is live: pages then say "coming soon" instead of linking.
export const APP_STORE_LINKS: { googlePlay: string | null; appStore: string | null } = {
  // Live since Nov 2026 (Farjad, 2 Nov 2026).
  googlePlay: 'https://play.google.com/store/apps/details?id=com.ashavid.visaroads',
  // Live since 17 Nov 2026. No storefront in the path, so Apple opens the
  // visitor's own country instead of the US store.
  appStore: 'https://apps.apple.com/app/visaroads-immigration-routes/id6823019451',
};

/** The numeric App Store id, for Apple's Smart App Banner on /app. */
export const APP_STORE_ID = '6823019451';
