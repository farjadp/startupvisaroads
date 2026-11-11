// ============================================================================
// lib/autopilot/images.ts
// Post imagery for the autopilot: the shared art direction prepended to the
// writer's scene, cover in 16:9 (the article page's frame), inline in 4:3.
//
// Storage gate: in production an image is only generated when object
// storage is configured. Without it, storeImage() falls back to a base64
// data URL — fine for a manual test, ruinous at five articles a day (three
// 600 KB blobs per row, 12 MB pages). In development the fallback is
// allowed so a local run can still be looked at. Verified 5 Sep 2026 that
// production serves from storage.googleapis.com/svr-media-visaroads-website.
// ============================================================================
import { generateAndSaveImage, imageProviders } from '@/lib/ai';
import { isStorageConfigured } from '@/lib/storage';
import { brandPrompt } from './art-direction';
import { makeBrandCover, type CoverSubject } from '@/lib/cover-art';

export type ImageRole = 'cover' | 'inline';

/**
 * True when generating an image would be wasteful or harmful right now.
 * The provider chain (Fal, then OpenAI) is checked as a whole: one dead
 * provider is a fallback, not a blocked run.
 */
export function imagesBlocked(): string | null {
  if (imageProviders().length === 0) return 'no image provider configured (FAL_KEY / OPENAI_API_KEY)';
  if (!isStorageConfigured() && process.env.NODE_ENV === 'production') return 'object storage not configured (S3_*); refusing to inline base64 in production';
  return null;
}

/**
 * Generate one branded image. Never throws — a missing image is a note in
 * the run, not a failed article.
 */
export async function generateBrandImage(scene: string, role: ImageRole): Promise<string | null> {
  const blocked = imagesBlocked();
  if (blocked) {
    console.warn(`autopilot/images: skipping ${role} — ${blocked}`);
    return null;
  }
  try {
    return await generateAndSaveImage(brandPrompt(scene), {
      raw: true,
      size: role === 'cover' ? 'landscape_16_9' : 'landscape_4_3',
      // The cover carries the article everywhere it is linked; buy the
      // better render for it and let Fal take the in-article photos.
      prefer: role === 'cover' ? ['openai', 'fal'] : ['fal', 'openai'],
    });
  } catch (e) {
    console.error(`autopilot/images: ${role} failed, continuing without it`, e);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Covers
// ---------------------------------------------------------------------------

export type CoverStyle = 'brand' | 'photo';

/**
 * Which kind of cover new articles get. 'brand' (the default since Farjad
 * chose it on 10 Nov 2026) is drawn in code by lib/cover-art: the country's
 * colour, its flag, the headline on a paper card. 'photo' is the old
 * generated photograph, kept as a switch so the look can be reverted with
 * COVER_STYLE=photo on Cloud Run, without a deploy.
 */
export function coverStyle(): CoverStyle {
  return process.env.COVER_STYLE?.trim().toLowerCase() === 'photo' ? 'photo' : 'brand';
}

/**
 * The cover for a new article. Never throws. `photoScene` is only used in
 * photo mode; the brand cover is built from the article itself.
 */
export async function generateCover(article: CoverSubject, photoScene: string): Promise<string | null> {
  if (coverStyle() === 'photo') return generateBrandImage(photoScene, 'cover');
  return makeBrandCover(article);
}
