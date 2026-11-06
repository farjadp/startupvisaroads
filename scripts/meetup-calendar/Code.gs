/**
 * VisaRoads meetup registrations → Google Calendar guests.
 *
 * Paste this into a new Apps Script project while signed in as
 * farjad@visaroads.com (script.google.com → New project), then:
 *
 *   1. Services (+) → add "Google Calendar API" (identifier: Calendar).
 *   2. Run setup() from the editor and authorize. It creates the SECRET script
 *      property and prints it to the execution log; put that value in
 *      MEETUP_CALENDAR_WEBHOOK_SECRET on Cloud Run.
 *   3. Deploy → New deployment → Web app.
 *        Execute as: Me (farjad@visaroads.com)
 *        Who has access: Anyone
 *      Authorize when asked. Copy the /exec URL into
 *      MEETUP_CALENDAR_WEBHOOK_URL on Cloud Run. Test with curl --data (not
 *      -X POST): Apps Script answers with a 302 that must be followed as GET.
 *   4. Run testAdd() once from the editor with your own second address to
 *      confirm an invitation arrives.
 *
 * The event id comes from the site (content/fa/webinar.ts → WEBINAR_EVENT_ID),
 * so a new meetup needs no change here. Only events on this account's primary
 * calendar can be touched.
 */

var CALENDAR_ID = 'primary';

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty('SECRET');
    if (!secret || body.secret !== secret) return json_({ ok: false, error: 'unauthorized' });

    var email = String(body.email || '').trim().toLowerCase();
    var name = String(body.name || '').trim().slice(0, 200);
    var eventId = String(body.eventId || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !eventId) return json_({ ok: false, error: 'bad input' });

    return json_(addGuest_(eventId, email, name));
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function addGuest_(eventId, email, name) {
  // Two registrations at the same moment would each read the list and the
  // second patch would drop the first guest. The lock serialises them.
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var event = Calendar.Events.get(CALENDAR_ID, eventId);
    var attendees = event.attendees || [];
    for (var i = 0; i < attendees.length; i++) {
      if (String(attendees[i].email).toLowerCase() === email) return { ok: true, status: 'exists' };
    }
    attendees.push({ email: email, displayName: name || undefined, responseStatus: 'needsAction' });
    Calendar.Events.patch(
      { attendees: attendees, guestsCanSeeOtherGuests: false, guestsCanInviteOthers: false },
      CALENDAR_ID,
      eventId,
      { sendUpdates: 'all' }
    );
    return { ok: true, status: 'added' };
  } finally {
    lock.releaseLock();
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Editor-only check. Replace the address before running. */
function testAdd() {
  Logger.log(addGuest_('52lpnmt3vqqni6c1ae5rgkjcr7', 'your-second-address@example.com', 'Test'));
}

/**
 * Run once from the editor. Creates the shared SECRET if it does not exist
 * and prints it to the execution log, so it can be copied into
 * MEETUP_CALENDAR_WEBHOOK_SECRET on Cloud Run without typing it anywhere.
 */
function setup() {
  var props = PropertiesService.getScriptProperties();
  var secret = props.getProperty('SECRET');
  if (!secret) {
    secret = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
    props.setProperty('SECRET', secret);
  }
  // Touch the event so the Calendar scope is granted and the id is checked.
  var event = Calendar.Events.get(CALENDAR_ID, '52lpnmt3vqqni6c1ae5rgkjcr7');
  Logger.log('Event: ' + event.summary);
  Logger.log('SECRET=' + secret);
}
