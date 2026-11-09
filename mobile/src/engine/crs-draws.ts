// The last rounds of invitations, from the site (GET /api/app/draws, which
// reads IRCC's rounds feed), kept on the phone so the block still shows offline
// with the day it was saved (spec 2026-11-09 §4).
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseDraws, type SavedDraws } from './crs';

const URL = 'https://visaroads.com/api/app/draws';
const KEY = 'vr.draws.v1';

export async function cachedDraws(): Promise<SavedDraws | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedDraws;
    const feed = parseDraws(parsed);
    return feed && typeof parsed.savedAt === 'string' ? { ...feed, savedAt: parsed.savedAt } : null;
  } catch {
    return null;
  }
}

/** Fetches, checks and saves the rounds; throws when offline or the body is not the expected shape. */
export async function fetchDraws(): Promise<SavedDraws> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12_000);
  try {
    const res = await fetch(URL, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const feed = parseDraws(await res.json());
    if (!feed) throw new Error('Unexpected draws body');
    const saved: SavedDraws = { ...feed, savedAt: new Date().toISOString().slice(0, 10) };
    await AsyncStorage.setItem(KEY, JSON.stringify(saved)).catch(() => {});
    return saved;
  } finally {
    clearTimeout(timer);
  }
}
