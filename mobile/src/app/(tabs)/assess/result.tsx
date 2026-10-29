// The v1 pathfinder result retired on 27 Oct 2026. Old links open the v2
// results, which carry their own "no result yet" state.
import { Redirect } from 'expo-router';

export default function Result() {
  return <Redirect href="/(tabs)/assess/results" />;
}
