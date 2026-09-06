// The model call is not tested; the guard is. Everything that decides whether
// a post is fit for an account with no source page behind it is pure.
import { describe, it, expect } from 'vitest';
import { rejectKnowledge, knowledgeMessage, nextTheme, THEMES } from '../knowledge';

const good = {
  post: 'Estonia is more than e-Residency. There is a deep pool of B2B SaaS founders, and hiring across Europe is simpler than most people expect.',
  hashtags: ['#Estonia', '#SaaS'],
  topic: 'Estonia SaaS ecosystem and hiring',
};

describe('rejectKnowledge', () => {
  it('passes a post that stands on its own', () => {
    expect(rejectKnowledge(good)).toBeNull();
  });

  it('rejects the superlatives that turn an unsourced post into a false claim', () => {
    expect(rejectKnowledge({ ...good, post: 'Lund produces most of the country’s medical devices, which makes it worth a look for medtech founders moving to Sweden.' }))
      .toMatch(/superlative/);
    expect(rejectKnowledge({ ...good, post: 'Berlin is the leading city for founders in Europe, and the rents are still lower than in London or Paris today.' }))
      .toMatch(/superlative/);
  });

  it('keeps hashtags out of the body and demands two or three of them', () => {
    expect(rejectKnowledge({ ...good, post: `${good.post} #Estonia` })).toMatch(/hashtags belong/);
    expect(rejectKnowledge({ ...good, hashtags: ['#Estonia'] })).toMatch(/two or three/);
    expect(rejectKnowledge({ ...good, hashtags: ['#Estonia', 'SaaS'] })).toMatch(/malformed/);
  });

  it('rejects a post with no topic, since the next one could not avoid repeating it', () => {
    expect(rejectKnowledge({ ...good, topic: '  ' })).toMatch(/no topic/);
  });

  it('rejects a body that would not fit inside the limit with its hashtags', () => {
    expect(rejectKnowledge({ ...good, post: 'x'.repeat(240) })).toMatch(/too long/);
  });
});

describe('knowledgeMessage', () => {
  it('puts the hashtags below the post, not inside it', () => {
    const text = knowledgeMessage({ text: good.post, hashtags: good.hashtags, photoQuery: '', topic: good.topic });
    expect(text).toBe(`${good.post}\n\n#Estonia #SaaS`);
    expect(text.length).toBeLessThanOrEqual(280);
  });
});

describe('nextTheme', () => {
  it('moves through the rotation over a day rather than sitting on one angle', () => {
    const day = new Date('2026-09-07T00:00:00Z');
    const picked = new Set(
      [0, 4, 8, 12, 16, 20].map((h) => nextTheme([], new Date(day.getTime() + h * 3600_000))),
    );
    expect(picked.size).toBeGreaterThan(3);
    for (const t of picked) expect(THEMES).toContain(t);
  });
});
