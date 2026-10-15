import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { useStore } from '@/state/store';
import { palettes, type Mode, type Palette } from './tokens';

type Theme = { mode: Mode; c: Palette };
const Ctx = createContext<Theme>({ mode: 'paper', c: palettes.paper });

/** `force` pins a subtree to one mode: the onboarding screens are always ink, whatever the device. */
export function ThemeProvider({ children, force }: { children: ReactNode; force?: Mode }) {
  const { state } = useStore();
  const system = useColorScheme();
  const mode: Mode = force ?? (state.mode === 'system' ? (system === 'dark' ? 'night' : 'paper') : state.mode);
  const value = useMemo(() => ({ mode, c: palettes[mode] }), [mode]);
  // A mode chosen in the app also sets the native appearance, so system chrome (the iOS 26 glass tab bar,
  // alerts, keyboard) matches it instead of turning light under a night screen (HIG; WCAG 1.4.3).
  const chosen = state.mode;
  useEffect(() => {
    if (force) return;
    Appearance.setColorScheme(chosen === 'system' ? 'unspecified' : chosen === 'night' ? 'dark' : 'light');
  }, [force, chosen]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
