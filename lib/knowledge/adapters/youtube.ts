// ============================================================================
// lib/knowledge/adapters/youtube.ts
// A YouTube video → its captions, as timestamped plain text.
//
// THIS DOES NOT CURRENTLY WORK, AND THAT IS NOT A BUG IN THIS FILE
//
// Measured on 12 Sep 2026, against three videos carrying 1, 28 and 65
// MANUAL caption tracks: the watch page still exposes the track list, and
// every fetch of a track's baseUrl returns HTTP 200 with an EMPTY BODY —
// with or without a browser user agent, with or without `fmt=json3`.
// YouTube now gates the timedtext endpoint behind a proof-of-origin token
// their player produces by running a JavaScript attestation. There is no way
// to mint one from a server.
//
// The supported route is no better: the Data API's captions.download needs
// the video OWNER's OAuth grant, which we will never have for IRCC's channel
// or a lawyer's webinar.
//
// So this module tries, and when it cannot, it says exactly that and sends
// the admin to the transcript-paste route — which is what Farjad asked for in
// the first place and the only path that cannot be taken away. The code stays
// because it is tested and costs nothing to keep: if YouTube reopens the
// endpoint it starts working with no change. Do not present it in the UI as a
// working feature. Whisper was considered and rejected: a sixty-minute video
// is minutes of wall clock, well over the 300 s cron budget.
//
// Timestamps become chunk locators for free: the text is emitted as
// `## 00:14:00` headings, which the chunker already turns into a heading
// path, so a citation reads «p.— · 00:14:00» without the chunker knowing
// anything about video.
// ============================================================================
import { fetchUrl } from './html';

export { CAPTIONS_BLOCKED_NOTE } from '../captions-note';

/** One block of captions, with the second it starts at. */
type Block = { at: number; text: string };

/** How much speech goes under one timestamp heading. */
const BLOCK_SECONDS = 60;

export class NoCaptions extends Error {
  constructor(detail: string) {
    super(`${detail} Paste the transcript as a text source instead: open the video, use "Show transcript" under it, copy the text, and add it here with "Paste text".`);
  }
}

/** `https://youtu.be/ID`, `watch?v=ID`, `/shorts/ID`, `/embed/ID` → the id. */
export function videoId(raw: string): string | null {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\./, '');
  const ok = (id: string | undefined) => (id && /^[\w-]{11}$/.test(id) ? id : null);
  if (host === 'youtu.be') return ok(u.pathname.split('/').filter(Boolean)[0]);
  if (host !== 'youtube.com' && host !== 'm.youtube.com' && host !== 'music.youtube.com') return null;
  const v = u.searchParams.get('v');
  if (v) return ok(v);
  const parts = u.pathname.split('/').filter(Boolean);
  if (parts[0] === 'shorts' || parts[0] === 'embed' || parts[0] === 'live' || parts[0] === 'v') return ok(parts[1]);
  return null;
}

export const isYouTubeUrl = (raw: string) => videoId(raw) !== null;

export const canonicalUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

// ---------------------------------------------------------------------------
// The player payload
// ---------------------------------------------------------------------------
export type CaptionTrack = { baseUrl: string; languageCode: string; kind?: string; name?: string };

/**
 * Pull `ytInitialPlayerResponse` out of the watch page.
 *
 * Exported and pure so the brittle part can be tested on a fixture rather
 * than against YouTube, which is the only way to tell "they changed the page"
 * from "our parser is wrong".
 */
export function playerResponse(html: string): Record<string, unknown> | null {
  const marker = 'ytInitialPlayerResponse';
  const at = html.indexOf(marker);
  if (at === -1) return null;
  const start = html.indexOf('{', at);
  if (start === -1) return null;
  // Brace-count rather than regex: the payload contains braces inside
  // strings, and a greedy match swallows the rest of the document.
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < html.length; i++) {
    const c = html[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (c === '\\') escaped = true;
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') inString = true;
    else if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(html.slice(start, i + 1)) as Record<string, unknown>;
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

export function captionTracks(player: Record<string, unknown>): CaptionTrack[] {
  const captions = player.captions as { playerCaptionsTracklistRenderer?: { captionTracks?: unknown[] } } | undefined;
  const tracks = captions?.playerCaptionsTracklistRenderer?.captionTracks;
  if (!Array.isArray(tracks)) return [];
  return tracks
    .map((t) => {
      const track = t as { baseUrl?: unknown; languageCode?: unknown; kind?: unknown; name?: { simpleText?: unknown } };
      return {
        baseUrl: typeof track.baseUrl === 'string' ? track.baseUrl : '',
        languageCode: typeof track.languageCode === 'string' ? track.languageCode : '',
        kind: typeof track.kind === 'string' ? track.kind : undefined,
        name: typeof track.name?.simpleText === 'string' ? track.name.simpleText : undefined,
      };
    })
    .filter((t) => t.baseUrl);
}

/**
 * A human-written track beats an auto-generated one, and our two languages
 * beat a third. `kind: 'asr'` is YouTube's marker for automatic speech
 * recognition, which mangles exactly the words that matter here — programme
 * names, authority names and numbers.
 */
export function pickTrack(tracks: CaptionTrack[], prefer: 'en' | 'fa' = 'en'): CaptionTrack | null {
  if (!tracks.length) return null;
  const score = (t: CaptionTrack) => {
    let s = 0;
    if (t.kind !== 'asr') s += 4;
    if (t.languageCode.startsWith(prefer)) s += 2;
    else if (t.languageCode.startsWith('en') || t.languageCode.startsWith('fa')) s += 1;
    return s;
  };
  return [...tracks].sort((a, b) => score(b) - score(a))[0];
}

// ---------------------------------------------------------------------------
// Track parsing
// ---------------------------------------------------------------------------
const decodeEntities = (s: string) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));

/** YouTube's json3 timed-text format. */
export function parseJson3(body: string): Block[] {
  let parsed: { events?: { tStartMs?: number; segs?: { utf8?: string }[] }[] };
  try {
    parsed = JSON.parse(body);
  } catch {
    return [];
  }
  const out: Block[] = [];
  for (const e of parsed.events ?? []) {
    const text = (e.segs ?? [])
      .map((s) => s.utf8 ?? '')
      .join('')
      .replace(/\s+/g, ' ')
      .trim();
    if (!text || text === '\n') continue;
    out.push({ at: Math.floor((e.tStartMs ?? 0) / 1000), text });
  }
  return out;
}

/** The older XML format, still what some tracks return. */
export function parseTimedTextXml(body: string): Block[] {
  const out: Block[] = [];
  for (const m of body.matchAll(/<text[^>]*\bstart="([\d.]+)"[^>]*>([\s\S]*?)<\/text>/g)) {
    // Tags become a space, not nothing: a caption line broken by <br/> glues
    // "province" to "said" otherwise.
    const text = decodeEntities(m[2].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
    if (!text) continue;
    out.push({ at: Math.floor(Number(m[1])), text });
  }
  return out;
}

export const timestamp = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/**
 * Caption blocks → the text the chunker reads. One `## hh:mm:ss` heading per
 * minute of speech, so every passage can cite the moment it came from.
 */
export function blocksToText(blocks: Block[], blockSeconds = BLOCK_SECONDS): string {
  if (!blocks.length) return '';
  const parts: string[] = [];
  let bucket = -1;
  let buffer: string[] = [];
  const flush = () => {
    if (!buffer.length) return;
    parts.push(`## ${timestamp(bucket * blockSeconds)}`, buffer.join(' '));
    buffer = [];
  };
  for (const b of blocks) {
    const which = Math.floor(b.at / blockSeconds);
    if (which !== bucket) {
      flush();
      bucket = which;
    }
    buffer.push(b.text);
  }
  flush();
  return parts.join('\n\n');
}

// ---------------------------------------------------------------------------
// The adapter
// ---------------------------------------------------------------------------
export type YouTubeExtracted = { title: string; text: string; url: string; language: string | null; auto: boolean };

/** Read a video's captions. Throws NoCaptions with a usable message when it cannot. */
export async function youtubeToText(rawUrl: string, prefer: 'en' | 'fa' = 'en'): Promise<YouTubeExtracted> {
  const id = videoId(rawUrl);
  if (!id) throw new NoCaptions('That is not a YouTube video URL.');
  const url = canonicalUrl(id);

  const page = await fetchUrl(url, 'text/html');
  if (!page.ok) throw new NoCaptions(`YouTube would not serve the page (${page.error}).`);
  const html = page.body.toString('utf8');

  const player = playerResponse(html);
  if (!player) throw new NoCaptions('The video page no longer contains the player data we read captions from — YouTube has changed it.');

  const status = (player.playabilityStatus as { status?: string; reason?: string } | undefined)?.status;
  if (status && status !== 'OK') {
    const reason = (player.playabilityStatus as { reason?: string }).reason;
    throw new NoCaptions(`YouTube will not play this video for us${reason ? ` (${reason})` : ''}.`);
  }

  const details = player.videoDetails as { title?: unknown } | undefined;
  const title = typeof details?.title === 'string' ? details.title : `YouTube video ${id}`;

  const track = pickTrack(captionTracks(player), prefer);
  if (!track) throw new NoCaptions('This video has no caption track.');

  // json3 first: it carries clean segments. Some tracks only answer in XML.
  const json = await fetchUrl(`${track.baseUrl}&fmt=json3`, 'application/json');
  let blocks: Block[] = json.ok ? parseJson3(json.body.toString('utf8')) : [];
  if (!blocks.length) {
    const xml = await fetchUrl(track.baseUrl, 'text/xml');
    if (xml.ok) blocks = parseTimedTextXml(xml.body.toString('utf8'));
  }
  if (!blocks.length) {
    throw new NoCaptions(
      `This video lists ${captionTracks(player).length} caption track(s), but YouTube served an empty one. It now requires a token its own player generates, which a server cannot produce, so caption download is effectively closed to us.`,
    );
  }

  return {
    title,
    text: blocksToText(blocks),
    url,
    language: track.languageCode.slice(0, 2) || null,
    auto: track.kind === 'asr',
  };
}
