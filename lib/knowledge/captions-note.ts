// ============================================================================
// lib/knowledge/captions-note.ts
// One sentence, in a file with no imports.
//
// It lives alone because the admin form is a client component and the YouTube
// adapter pulls cheerio in through its fetch helper. A note for a person does
// not need an HTML parser in the browser bundle to be read.
// ============================================================================

/**
 * What to tell someone before they try to register a video. Stated once, so
 * the form and the error message cannot drift apart.
 *
 * Measured 12 September 2026 against three videos carrying 1, 28 and 65
 * manual caption tracks: the watch page still lists the tracks, and every
 * fetch of one returns HTTP 200 with an empty body, with or without a browser
 * user agent. YouTube gates the endpoint behind a token its own player mints
 * in JavaScript.
 */
export const CAPTIONS_BLOCKED_NOTE =
  'YouTube stopped serving caption downloads to anything but its own player (measured 12 September 2026). Registering a video will almost certainly fail and tell you to paste the transcript instead, which works: open the video, choose "Show transcript", copy it, and use "Paste text".';
