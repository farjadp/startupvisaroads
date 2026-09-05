import { describe, it, expect } from 'vitest';
import { localeSwitchTarget } from '../paths';

describe('localeSwitchTarget', () => {
  it('switches a paired page to its twin, even with a different slug', () => {
    expect(localeSwitchTarget('/startup-visa-canada', 'fa')).toBe('/canada-startup-visa');
    expect(localeSwitchTarget('/canada-startup-visa', 'en')).toBe('/startup-visa-canada');
    expect(localeSwitchTarget('/mentorship', 'fa')).toBe('/mentorship');
  });

  it('sends an English-only page to the Persian home, not to a 301', () => {
    expect(localeSwitchTarget('/pnp/ontario', 'fa')).toBe('');
    expect(localeSwitchTarget('/usa/eb5', 'fa')).toBe('');
  });

  it('sends a Persian-only page to the English home', () => {
    expect(localeSwitchTarget('/which-path', 'en')).toBe('');
    expect(localeSwitchTarget('/canada-startup-visa/cost', 'en')).toBe('');
  });

  it('keeps home as home', () => {
    expect(localeSwitchTarget('/', 'fa')).toBe('');
    expect(localeSwitchTarget('', 'en')).toBe('');
  });

  it('sends a single-locale article to the other blog index', () => {
    expect(localeSwitchTarget('/blog/some-article', 'fa')).toBe('/blog');
    expect(localeSwitchTarget('/blog/some-article', 'en')).toBe('/blog');
  });
});
