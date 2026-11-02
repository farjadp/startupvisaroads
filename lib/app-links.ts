// Store listings for the VisaRoads mobile app (com.ashavid.visaroads). One
// place for every page, schema and file that links to a store. A listing is
// null until it is live: pages then say "coming soon" instead of linking.
export const APP_STORE_LINKS: { googlePlay: string | null; appStore: string | null } = {
  // Live since Nov 2026 (Farjad, 2 Nov 2026).
  googlePlay: 'https://play.google.com/store/apps/details?id=com.ashavid.visaroads',
  // Not on the App Store yet (iTunes lookup for the bundle id returned 0 results on 2 Nov 2026).
  appStore: null,
};
