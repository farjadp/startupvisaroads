import { DMSerifDisplay_400Regular, DMSerifDisplay_400Regular_Italic } from '@expo-google-fonts/dm-serif-display';
import { SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { Vazirmatn_400Regular, Vazirmatn_500Medium, Vazirmatn_700Bold } from '@expo-google-fonts/vazirmatn';
import type { Script } from './tokens';

/** Bundled with the app (no network on first launch). Estedad is the Persian display face (SIL OFL). */
export const FONT_ASSETS = {
  DMSerifDisplay_400Regular,
  DMSerifDisplay_400Regular_Italic,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
  Vazirmatn_400Regular,
  Vazirmatn_500Medium,
  Vazirmatn_700Bold,
  'Estedad-Bold': require('../../assets/fonts/Estedad-Bold.ttf'),
  'Estedad-Black': require('../../assets/fonts/Estedad-Black.ttf'),
};

export type Weight = 'regular' | 'medium' | 'bold' | 'black';

/**
 * Family by script and use. Custom faces carry their weight in the file, so
 * fontWeight is only set for the system Chinese face (decision: system CJK
 * fonts in v1 rather than ~10 MB of bundled Noto SC per weight).
 */
export function fontFor(script: Script, display: boolean, weight: Weight, italic = false): { fontFamily?: string; fontWeight?: '400' | '500' | '700' | '900' } {
  if (script === 'han') {
    return { fontWeight: display ? '900' : weight === 'regular' ? '400' : weight === 'medium' ? '500' : '700' };
  }
  if (script === 'arabic') {
    if (display) return { fontFamily: weight === 'bold' ? 'Estedad-Bold' : 'Estedad-Black' };
    return { fontFamily: weight === 'regular' ? 'Vazirmatn_400Regular' : weight === 'medium' ? 'Vazirmatn_500Medium' : 'Vazirmatn_700Bold' };
  }
  if (display) return { fontFamily: italic ? 'DMSerifDisplay_400Regular_Italic' : 'DMSerifDisplay_400Regular' };
  return { fontFamily: weight === 'regular' ? 'SpaceGrotesk_400Regular' : weight === 'medium' ? 'SpaceGrotesk_500Medium' : 'SpaceGrotesk_700Bold' };
}
