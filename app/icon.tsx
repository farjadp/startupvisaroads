import { ImageResponse } from 'next/og';

// Branded favicon (auto-injected by Next into <head>).
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a1a',
          color: '#CCFF00',
          fontSize: 22,
          fontWeight: 800,
          borderRadius: 6,
        }}
      >
        S
      </div>
    ),
    { ...size }
  );
}
