import { describe, it, expect } from 'vitest';
import {
  blocksToText,
  canonicalUrl,
  captionTracks,
  isYouTubeUrl,
  NoCaptions,
  parseJson3,
  parseTimedTextXml,
  pickTrack,
  playerResponse,
  timestamp,
  videoId,
} from '../adapters/youtube';

describe('videoId', () => {
  it('reads every URL shape YouTube hands out', () => {
    expect(videoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(videoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(videoId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(videoId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(videoId('https://www.youtube.com/live/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(videoId('https://m.youtube.com/watch?v=dQw4w9WgXcQ&t=42s')).toBe('dQw4w9WgXcQ');
  });

  it('refuses anything that is not a video', () => {
    expect(videoId('https://www.youtube.com/@somechannel')).toBeNull();
    expect(videoId('https://www.youtube.com/playlist?list=PL123')).toBeNull();
    expect(videoId('https://vimeo.com/12345')).toBeNull();
    expect(videoId('https://www.youtube.com/watch?v=tooshort')).toBeNull();
    expect(videoId('not a url')).toBeNull();
    // A lookalike host is not YouTube.
    expect(videoId('https://youtube.com.evil.test/watch?v=dQw4w9WgXcQ')).toBeNull();
  });

  it('normalises to one canonical URL, so the same video cannot be registered twice', () => {
    const shapes = ['https://youtu.be/dQw4w9WgXcQ?t=10', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PL1'];
    const urls = shapes.map((s) => canonicalUrl(videoId(s) as string));
    expect(new Set(urls).size).toBe(1);
    expect(urls[0]).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(isYouTubeUrl(urls[0])).toBe(true);
  });
});

describe('playerResponse', () => {
  it('extracts the payload by counting braces, not by regex', () => {
    // The brace inside the string is the case a greedy or lazy regex gets
    // wrong: lazy stops early, greedy swallows the trailing script.
    const html = `<script>var ytInitialPlayerResponse = {"videoDetails":{"title":"A } brace in a title"},"x":{"y":1}};</script><script>other={}</script>`;
    const p = playerResponse(html);
    expect((p?.videoDetails as { title: string }).title).toBe('A } brace in a title');
  });

  it('survives an escaped quote before a brace', () => {
    const html = `ytInitialPlayerResponse = {"videoDetails":{"title":"quote \\" then } brace"}}`;
    expect(((playerResponse(html)?.videoDetails as { title: string }) ?? {}).title).toBe('quote " then } brace');
  });

  it('returns null when the page has changed shape', () => {
    expect(playerResponse('<html><body>no player here</body></html>')).toBeNull();
    expect(playerResponse('ytInitialPlayerResponse = {not json}')).toBeNull();
  });
});

describe('captionTracks and pickTrack', () => {
  const player = {
    captions: {
      playerCaptionsTracklistRenderer: {
        captionTracks: [
          { baseUrl: 'https://t/auto-en', languageCode: 'en', kind: 'asr', name: { simpleText: 'English (auto-generated)' } },
          { baseUrl: 'https://t/manual-fr', languageCode: 'fr', name: { simpleText: 'French' } },
          { baseUrl: 'https://t/manual-en', languageCode: 'en', name: { simpleText: 'English' } },
          { languageCode: 'de' }, // no baseUrl: unusable
        ],
      },
    },
  };

  it('reads the usable tracks and drops one with no url', () => {
    const tracks = captionTracks(player);
    expect(tracks).toHaveLength(3);
    expect(tracks.map((t) => t.languageCode)).toEqual(['en', 'fr', 'en']);
  });

  it('prefers a human track over auto-generated speech recognition', () => {
    // Auto captions mangle exactly the words that matter here: programme
    // names, authority names and numbers.
    expect(pickTrack(captionTracks(player), 'en')?.baseUrl).toBe('https://t/manual-en');
  });

  it('prefers the asked-for language among human tracks', () => {
    const fa = captionTracks({
      captions: { playerCaptionsTracklistRenderer: { captionTracks: [{ baseUrl: 'https://t/en', languageCode: 'en' }, { baseUrl: 'https://t/fa', languageCode: 'fa' }] } },
    });
    expect(pickTrack(fa, 'fa')?.baseUrl).toBe('https://t/fa');
    expect(pickTrack(fa, 'en')?.baseUrl).toBe('https://t/en');
  });

  it('takes an auto track rather than nothing', () => {
    const onlyAuto = captionTracks({ captions: { playerCaptionsTracklistRenderer: { captionTracks: [{ baseUrl: 'https://t/a', languageCode: 'en', kind: 'asr' }] } } });
    expect(pickTrack(onlyAuto)?.baseUrl).toBe('https://t/a');
  });

  it('returns nothing when there are no captions at all', () => {
    expect(captionTracks({})).toEqual([]);
    expect(pickTrack([])).toBeNull();
  });
});

describe('track parsing', () => {
  it('reads json3 segments and skips empty events', () => {
    const body = JSON.stringify({
      events: [
        { tStartMs: 0, segs: [{ utf8: 'The ' }, { utf8: 'letter of support' }] },
        { tStartMs: 5000, segs: [{ utf8: '\n' }] },
        { tStartMs: 7000, segs: [{ utf8: 'is valid for six months.' }] },
      ],
    });
    expect(parseJson3(body)).toEqual([
      { at: 0, text: 'The letter of support' },
      { at: 7, text: 'is valid for six months.' },
    ]);
  });

  it('returns nothing on malformed json rather than throwing', () => {
    expect(parseJson3('<html>not json</html>')).toEqual([]);
  });

  it('reads the older xml format and decodes entities and tags', () => {
    const xml = `<transcript><text start="12.5" dur="3">IRCC &amp; the province<br/>said &quot;no&quot;</text><text start="20">&#1601;&#1575;&#1585;&#1587;&#1740;</text></transcript>`;
    expect(parseTimedTextXml(xml)).toEqual([
      { at: 12, text: 'IRCC & the province said "no"' },
      { at: 20, text: 'فارسی' },
    ]);
  });
});

describe('timestamps become chunk locators', () => {
  it('formats hours, minutes and seconds', () => {
    expect(timestamp(0)).toBe('00:00:00');
    expect(timestamp(75)).toBe('00:01:15');
    expect(timestamp(3725)).toBe('01:02:05');
  });

  it('groups speech under one heading per minute, which the chunker reads as a locator', () => {
    const blocks = [
      { at: 0, text: 'First thing.' },
      { at: 30, text: 'Still the first minute.' },
      { at: 61, text: 'Second minute now.' },
      { at: 3601, text: 'An hour in.' },
    ];
    const text = blocksToText(blocks);
    expect(text).toBe('## 00:00:00\n\nFirst thing. Still the first minute.\n\n## 00:01:00\n\nSecond minute now.\n\n## 01:00:00\n\nAn hour in.');
  });

  it('handles an empty track', () => {
    expect(blocksToText([])).toBe('');
  });
});

describe('the failure message', () => {
  it('always points at the transcript-paste route, because that one cannot break', () => {
    const e = new NoCaptions('This video has no caption track.');
    expect(e.message).toContain('no caption track');
    expect(e.message).toContain('Paste the transcript as a text source');
    expect(e.message).toContain('Show transcript');
  });
});
