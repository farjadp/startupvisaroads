import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

describe('llms.txt', () => {
  const path = join(process.cwd(), 'public', 'llms.txt');

  it('exists as a static file', () => {
    expect(existsSync(path)).toBe(true);
  });

  it('declares the legal boundary', () => {
    const content = readFileSync(path, 'utf-8');
    expect(content).toContain('not lawyers');
    expect(content).toContain('RCIC');
  });

  it('links to official government sources, not fabricated URLs', () => {
    const content = readFileSync(path, 'utf-8');
    expect(content).toContain('https://www.canada.ca/');
    expect(content).toContain('https://www.uscis.gov/');
    expect(content).toContain('https://migri.fi/');
  });

  it('does not make success-rate or positive guarantee claims', () => {
    const content = readFileSync(path, 'utf-8');
    expect(content).not.toMatch(/%\s*success|we\s+guarantee\s+approval/i);
  });
});
