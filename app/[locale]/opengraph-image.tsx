import { ImageResponse } from 'next/og';
import { SITE_NAME } from '@/lib/seo';

// Default branded social/AI preview image, applied to every public page in
// this segment unless a page provides its own (e.g. an article cover image).
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = SITE_NAME;

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#1a1a1a',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 28, height: 28, backgroundColor: '#CCFF00', borderRadius: 6 }} />
          <div style={{ color: '#F2F0E9', fontSize: 28, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 700 }}>
            Startup Visa Roads
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#F2F0E9', fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>
            Your curated path to
          </div>
          <div style={{ color: '#CCFF00', fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>
            global residency.
          </div>
        </div>

        <div style={{ color: '#F2F0E9', opacity: 0.6, fontSize: 26, letterSpacing: 2 }}>
          Startup Visa · PNP · EB-1 / EB-2 NIW / EB-5 · Europe · Australia
        </div>
      </div>
    ),
    { ...size }
  );
}
