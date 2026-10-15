// Line icons, one set, 20pt, ink. Tab icons use the platform's own (SF
// Symbols / Material) through NativeTabs; these are for content only.
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { useI18n } from '@/i18n/I18nProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { size as tokenSize, type Palette } from '@/theme/tokens';

export type IconName =
  | 'arrow'
  | 'chevron'
  | 'check'
  | 'globe'
  | 'wallet'
  | 'speech'
  | 'briefcase'
  | 'doc'
  | 'person'
  | 'people'
  | 'shield'
  | 'compass'
  | 'coins'
  | 'gear'
  | 'external'
  | 'calculator'
  | 'route'
  | 'alert'
  | 'cake'
  // Route types (4A): one glyph per kind of road, never per country.
  | 'startup'
  | 'pnp'
  | 'tech'
  | 'niw';

/** Directional icons mirror in right-to-left layouts; everything else never does. */
const DIRECTIONAL: IconName[] = ['arrow', 'chevron'];

export function Icon({ name, size = tokenSize.icon, tone = 'fg', color }: { name: IconName; size?: number; tone?: keyof Palette; color?: string }) {
  const { c } = useTheme();
  const { meta } = useI18n();
  const stroke = color ?? c[tone];
  const flip = DIRECTIONAL.includes(name) && meta.rtl;
  const p = { fill: 'none', stroke, strokeWidth: 1.8, strokeLinecap: 'square' as const, strokeLinejoin: 'miter' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={flip ? { transform: [{ scaleX: -1 }] } : undefined} accessible={false} importantForAccessibility="no-hide-descendants">
      {name === 'arrow' && <Path d="M5 12h14M13 6l6 6-6 6" {...p} strokeWidth={2} />}
      {name === 'chevron' && <Path d="M9 5l7 7-7 7" {...p} strokeWidth={2} />}
      {name === 'check' && <Path d="M5 12l4 4 10-10" {...p} strokeWidth={2.4} />}
      {name === 'globe' && (
        <>
          <Circle cx="12" cy="12" r="9" {...p} />
          <Path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" {...p} />
        </>
      )}
      {name === 'wallet' && (
        <>
          <Rect x="3" y="6" width="18" height="13" {...p} />
          <Path d="M3 10h18M16 15h2" {...p} />
        </>
      )}
      {name === 'speech' && <Path d="M4 5h16v10H9l-5 4z" {...p} />}
      {name === 'briefcase' && (
        <>
          <Rect x="3" y="8" width="18" height="12" {...p} />
          <Path d="M9 8V5h6v3" {...p} />
        </>
      )}
      {name === 'doc' && <Path d="M7 3h7l4 4v14H7zM14 3v4h4M10 13h5M10 17h5" {...p} />}
      {name === 'person' && (
        <>
          <Circle cx="12" cy="7" r="3.5" {...p} />
          <Path d="M5 21c1-5 13-5 14 0z" {...p} />
        </>
      )}
      {name === 'people' && (
        <>
          <Circle cx="9" cy="8" r="3" {...p} />
          <Path d="M3 20c1-4 11-4 12 0" {...p} />
          <Path d="M15 5a3 3 0 010 6M17 15c2 .5 3.5 2 4 5" {...p} />
        </>
      )}
      {name === 'shield' && <Path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" {...p} />}
      {name === 'compass' && (
        <>
          <Circle cx="12" cy="12" r="9" {...p} />
          <Path d="M15 9l-2 6-4 2 2-6z" {...p} />
        </>
      )}
      {name === 'coins' && (
        <>
          <Ellipse cx="12" cy="7" rx="7" ry="3" {...p} />
          <Path d="M5 7v10c0 1.7 3.1 3 7 3s7-1.3 7-3V7M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" {...p} />
        </>
      )}
      {name === 'gear' && (
        <>
          <Circle cx="12" cy="12" r="3" {...p} />
          <Path d="M18.6 9.5L21.3 10.1L21.3 13.9L18.6 14.5L18.4 14.9L19.9 17.2L17.2 19.9L14.9 18.4L14.5 18.6L13.9 21.3L10.1 21.3L9.5 18.6L9.1 18.4L6.8 19.9L4.1 17.2L5.6 14.9L5.4 14.5L2.7 13.9L2.7 10.1L5.4 9.5L5.6 9.1L4.1 6.8L6.8 4.1L9.1 5.6L9.5 5.4L10.1 2.7L13.9 2.7L14.5 5.4L14.9 5.6L17.2 4.1L19.9 6.8L18.4 9.1Z" {...p} />
        </>
      )}
      {name === 'external' && <Path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" {...p} />}
      {name === 'calculator' && (
        <>
          <Rect x="5" y="3" width="14" height="18" {...p} />
          <Path d="M8 8h8M8 12h3M13 12h3M8 16h3M13 16h3" {...p} />
        </>
      )}
      {name === 'route' && <Path d="M4 20c4-8 12-8 16-16M4 12c3-3 8-3 11-9" {...p} />}
      {name === 'alert' && (
        <>
          <Circle cx="12" cy="12" r="9" {...p} />
          <Path d="M12 7v6M12 16v1" {...p} strokeWidth={2.2} />
        </>
      )}
      {name === 'cake' && <Path d="M4 21h16v-8H4zM4 16c2 1.5 4 1.5 6 0s4-1.5 6 0 3 1 4 0M12 13V9M12 6v.5" {...p} />}
      {name === 'startup' && <Path d="M12 21V11M12 11c0-4 3-7 8-7 0 4-3 7-8 7zM12 14c0-3-2.5-5-7-5 0 3 2.5 5 7 5z" {...p} />}
      {name === 'pnp' && <Path d="M4 10v10h16V10M3 10l2-6h14l2 6zM10 20v-6h4v6" {...p} />}
      {name === 'tech' && (
        <>
          <Rect x={6} y={6} width={12} height={12} {...p} />
          <Rect x={10} y={10} width={4} height={4} {...p} />
          <Path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" {...p} />
        </>
      )}
      {name === 'niw' && (
        <>
          <Circle cx={10} cy={8} r={3.5} {...p} />
          <Path d="M3 20c0-3.5 3-6 7-6s7 2.5 7 6M18.5 3l1 2.1 2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3z" {...p} />
        </>
      )}
    </Svg>
  );
}
