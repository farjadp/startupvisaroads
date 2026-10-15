import { Redirect } from 'expo-router';
import { useStore } from '@/state/store';

export default function Index() {
  const { state } = useStore();
  // A new install chooses its language first (2A), then sees Welcome.
  return <Redirect href={state.onboarded ? '/(tabs)/home' : state.locale ? '/welcome' : '/language'} />;
}
