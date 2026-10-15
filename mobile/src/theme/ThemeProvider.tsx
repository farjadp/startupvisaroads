import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
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
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
