// Talk to a mentor (4.2), the Settings / Me entry. The body is shared with the
// Mentor sheet opened from results and route pages.
import { Screen } from '@/ui/kit';
import { MentorBody } from '@/ui/MentorBody';

export default function Mentor() {
  return (
    <Screen edges={[]}>
      <MentorBody />
    </Screen>
  );
}
