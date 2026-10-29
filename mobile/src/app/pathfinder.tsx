// The v1 pathfinder retired on 27 Oct 2026: its seven questions and nine roads
// are replaced by the v2 assessment. Old links land there instead.
import { Redirect } from 'expo-router';

export default function Pathfinder() {
  return <Redirect href="/assessment" />;
}
