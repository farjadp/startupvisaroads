// The v1 road page retired on 27 Oct 2026: it scored v1 rules and ignored the
// passport gate. Old links open the v2 route page (which applies the gate), or
// the countries list for a key that has no v2 route.
import { Redirect, useLocalSearchParams } from 'expo-router';
import { routeV2 } from '@shared/routes-v2';
import { V1_TO_V2 } from '@/state/migrate';

export default function OldRoad() {
  const { key } = useLocalSearchParams<{ key: string }>();
  const k = String(key);
  const v2 = V1_TO_V2[k] ?? (routeV2(k) ? k : null);
  return <Redirect href={v2 ? `/(tabs)/countries/route/${v2}` : '/(tabs)/countries'} />;
}
