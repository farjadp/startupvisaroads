// ============================================================================
// lib/meetup-calendar.ts
// Adds a meetup registrant as a guest on the Google Calendar event, so Google
// sends them the invitation with the Meet link and its own reminders.
//
// Why a webhook and not the Calendar API from here: a service account cannot
// invite attendees without domain-wide delegation, and an OAuth app left in
// "testing" mode loses its refresh token after seven days. A small Apps Script
// deployed as farjad@visaroads.com (scripts/meetup-calendar/Code.gs) does the
// add with that account's own permissions. Two env vars switch it on:
//
//   MEETUP_CALENDAR_WEBHOOK_URL     the /exec URL of the deployed web app
//   MEETUP_CALENDAR_WEBHOOK_SECRET  the same string as SECRET in the script
//
// Without them it returns 'off' and registration still goes to Telegram.
// ============================================================================

export type CalendarAddResult = 'added' | 'exists' | 'off' | 'failed';

export async function addMeetupGuest(input: { eventId: string; email: string; name: string }): Promise<CalendarAddResult> {
  const url = process.env.MEETUP_CALENDAR_WEBHOOK_URL;
  const secret = process.env.MEETUP_CALENDAR_WEBHOOK_SECRET;
  if (!url || !secret || !input.eventId) return 'off';

  try {
    // Apps Script answers a POST with a 302 to googleusercontent.com; fetch
    // follows it and the JSON comes back from there.
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ secret, eventId: input.eventId, email: input.email, name: input.name }),
      redirect: 'follow',
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      console.error('Meetup calendar webhook HTTP', res.status);
      return 'failed';
    }
    const data = (await res.json()) as { ok?: boolean; status?: string; error?: string };
    if (data.ok && (data.status === 'added' || data.status === 'exists')) return data.status;
    console.error('Meetup calendar webhook refused:', data.error ?? data);
    return 'failed';
  } catch (error) {
    console.error('Meetup calendar webhook error:', error);
    return 'failed';
  }
}
