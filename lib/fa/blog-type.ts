// ============================================================================
// lib/fa/blog-type.ts
// Typography tokens for the magazine, derived from the article's locale.
//
// The blog was built before the Persian site existed and hardcodes the two
// English faces throughout: DM Serif Display for headings, Space Grotesk for
// everything else. Neither carries Arabic-script glyphs, so every Persian
// headline, excerpt, category chip and paragraph fell back to whatever the
// reader's OS offered — which is why the magazine looked like a different
// site from the guides beside it.
//
// Headings inside the rendered article HTML are NOT handled here. The article
// body comes out of the database through dangerouslySetInnerHTML, the
// Tailwind Typography plugin is not installed, and globals.css hardcodes the
// serif face on .prose headings — so that one is fixed there, by direction.
//
// The label token also drops `uppercase` and the wide tracking for Persian:
// uppercase is a no-op on Arabic script, and the tracking pulls apart letters
// that are meant to join.
// ============================================================================

export type BlogType = {
  /** Headlines and titles. */
  display: string;
  /** Body copy, excerpts, metadata. */
  body: string;
  /** Small bold labels: category chips, "read more", pagination. */
  label: string;
};

export function blogType(isRtl: boolean): BlogType {
  if (isRtl) {
    return {
      display: 'font-estedad',
      body: 'font-vazir',
      label: 'font-vazir tracking-normal',
    };
  }
  return {
    display: 'font-serif',
    body: 'font-sans',
    label: 'font-sans uppercase tracking-widest',
  };
}
