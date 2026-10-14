import type { ComponentProps } from 'react';
import type { Stack } from 'expo-router';
import { fontFor } from '@/theme/fonts';
import type { Palette, Script } from '@/theme/tokens';

type Options = NonNullable<ComponentProps<typeof Stack>['screenOptions']>;

/** Native stack headers in brand colours. Tab roots hide the header and draw their title in content (spec 5). */
export function stackOptions(c: Palette, script: Script): Options {
  const font = fontFor(script, false, 'bold');
  return {
    headerStyle: { backgroundColor: c.bg },
    headerTintColor: c.fg,
    headerShadowVisible: false,
    headerTitleStyle: { color: c.fg, ...(font.fontFamily ? { fontFamily: font.fontFamily } : { fontWeight: '700' }) },
    headerBackButtonDisplayMode: 'minimal',
    contentStyle: { backgroundColor: c.bg },
  } as Options;
}
