// The art direction bans writing surfaces outright: flux renders paper as
// garbled pseudo-text. Three backlog scenes asked for a bank passbook, a stack
// of stapled documents and a closed notebook anyway, and because the scene is
// weighted ahead of the style block, the scene won — every Persian cover came
// out as a notebook beside a warm cup of tea.
import { describe, it, expect } from 'vitest';
import { FA_TOPICS } from '@/content/fa/topics';

/**
 * "no signage legible" is the scene ruling a writing surface out, not asking
 * for one, so the negated clauses come off before the check.
 */
const asked = (scene: string) => scene.replace(/\bno(?:thing)?\b[^,]*/gi, '');

const BANNED = /\b(passbook|passport|paper|papers|document|documents|notebook|book|letter|form|map|whiteboard|signage|newspaper|receipt)\b/i;
/** The palette is explicitly cool; these words pull flux straight into sepia. */
const WARM = /\b(tea|coffee|golden|amber|sunset|candle|lamplight)\b/i;

describe('backlog image scenes', () => {
  it('asks for nothing the art direction forbids', () => {
    for (const t of FA_TOPICS) {
      for (const scene of t.imageScenes) {
        expect(BANNED.test(asked(scene)), `${t.slug}: "${scene}"`).toBe(false);
        expect(WARM.test(asked(scene)), `${t.slug}: "${scene}"`).toBe(false);
      }
    }
  });

  it('gives every topic two different scenes, so the two visuals are not one picture twice', () => {
    for (const t of FA_TOPICS) {
      expect(t.imageScenes[0], t.slug).not.toBe(t.imageScenes[1]);
    }
  });
});
