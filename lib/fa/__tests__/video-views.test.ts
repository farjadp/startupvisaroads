import { describe, it, expect } from 'vitest';
import { VIDEOS, VIEWS_CHECKED, VIEWS_FLOOR, viewsLabel, type Video } from '@/content/fa/videos';

const v = (views?: number): Video => ({ id: 'x', title: 't', tags: ['turkey'], views });

describe('viewsLabel', () => {
  // The label is a floor, not a figure. View counts only rise, so rounding
  // down keeps it true as the real number climbs — the whole reason we do not
  // render an exact count that would rot silently.
  it('rounds down to the nearest thousand', () => {
    expect(viewsLabel(v(13_977))).toBe('بیش از ۱۳ هزار بازدید');
    expect(viewsLabel(v(7_646))).toBe('بیش از ۷ هزار بازدید');
    expect(viewsLabel(v(41_387))).toBe('بیش از ۴۱ هزار بازدید');
  });

  it('never rounds up, however close', () => {
    expect(viewsLabel(v(1_999))).toBe('بیش از ۱ هزار بازدید');
    expect(viewsLabel(v(9_999))).toBe('بیش از ۹ هزار بازدید');
  });

  it('says nothing below the floor', () => {
    expect(viewsLabel(v(VIEWS_FLOOR - 1))).toBeNull();
    expect(viewsLabel(v(33))).toBeNull();
    expect(viewsLabel(v(undefined))).toBeNull();
  });

  it('shows a label at the floor exactly', () => {
    expect(viewsLabel(v(VIEWS_FLOOR))).toBe('بیش از ۱ هزار بازدید');
  });
});

describe('the catalogue', () => {
  it('records when the counts were read, so a stale set is visible', () => {
    expect(VIEWS_CHECKED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('gives every video a count', () => {
    for (const video of VIDEOS) expect(video.views, video.id).toBeTypeOf('number');
  });

  it('keeps both Türkiye videos above the floor', () => {
    for (const id of ['yKUnvR4dTbE', 'aDAvrHfP3LI'])
      expect(viewsLabel(VIDEOS.find((x) => x.id === id)!), id).not.toBeNull();
  });
});
