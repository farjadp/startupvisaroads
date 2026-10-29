import { FX } from '@shared/fx';
import { parseIsoDate } from '@/i18n/format';

// The ECB rates are fixed in lib/fx.ts and refreshed by OTA. Past 30 days a
// converted amount says the rate may be old; past 90 it is hidden.
export const FX_AGE_DAYS = Math.floor((Date.now() - parseIsoDate(FX.date).getTime()) / 86_400_000);
export const FX_OLD = FX_AGE_DAYS > 30;
export const FX_TOO_OLD = FX_AGE_DAYS > 90;
