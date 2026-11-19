// ============================================================================
// lib/campaign-queue/content.ts
// Editing a campaign's email or SMS. Once people have received it, an edit
// becomes a new version: the old text is kept, those people are unaffected,
// and everyone still in the queue gets the new one. A queued campaign must be
// paused first, so a running batch never mixes versions.
// Callers check the admin session first.
// ============================================================================
import prisma from '@/lib/prisma';
import type { ActionResult } from './admin';
import { channelsFor } from './recipients';

const EDITABLE = ['DRAFT', 'SCHEDULED', 'PAUSED', 'SENDING'];
const MAX_NAME = 200;
const MAX_SUBJECT = 300;
const MAX_SMS = 320;

const refuse = (status: number, error: string) => ({ ok: false as const, status, error });
const text = (value: unknown) => (typeof value === 'string' ? value : '');

export async function updateCampaignContent(
  id: string,
  input: unknown,
): Promise<ActionResult<{ contentVersion: number; versioned: boolean }>> {
  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) return refuse(404, 'Campaign not found');
  if (campaign.status === 'QUEUED') return refuse(409, 'Pause the campaign before editing it.');
  if (!EDITABLE.includes(campaign.status)) return refuse(409, `A ${campaign.status} campaign cannot be edited.`);

  const v = (input ?? {}) as Record<string, unknown>;
  if (v.expectedVersion !== campaign.contentVersion) {
    return refuse(409, 'This campaign was edited elsewhere. Reload the page.');
  }

  const channels = channelsFor(campaign.type);
  const name = text(v.name).trim();
  if (!name || name.length > MAX_NAME) return refuse(400, `Give the campaign a name of up to ${MAX_NAME} characters.`);

  let subject = campaign.subject;
  let body = campaign.body;
  let smsBody = campaign.smsBody;

  if (channels.includes('EMAIL')) {
    subject = text(v.subject).trim();
    body = text(v.body);
    if (!subject || subject.length > MAX_SUBJECT || /[\r\n]/.test(subject)) {
      return refuse(400, `The subject must be one line of up to ${MAX_SUBJECT} characters.`);
    }
    if (!body.trim()) return refuse(400, 'The email body is empty.');
  }
  if (channels.includes('SMS')) {
    smsBody = text(v.smsBody).trim();
    if (!smsBody || smsBody.length > MAX_SMS) return refuse(400, `The SMS must be 1 to ${MAX_SMS} characters.`);
  }

  const contentChanged = subject !== campaign.subject || body !== campaign.body || smsBody !== campaign.smsBody;
  const alreadySent = contentChanged && (await prisma.campaignLog.count({ where: { campaignId: id } })) > 0;
  const contentVersion = alreadySent ? campaign.contentVersion + 1 : campaign.contentVersion;

  // Compare-and-set, so a resume or a second editor cannot slip in between.
  const saved = await prisma.$transaction(async (tx) => {
    const updated = await tx.campaign.updateMany({
      where: { id, status: campaign.status, contentVersion: campaign.contentVersion },
      data: { name, subject, body, smsBody, contentVersion },
    });
    if (updated.count !== 1) return false;
    if (alreadySent) {
      await tx.campaignContentVersion.create({
        data: {
          campaignId: id,
          version: campaign.contentVersion,
          subject: campaign.subject,
          body: campaign.body,
          smsBody: campaign.smsBody,
        },
      });
    }
    return true;
  });

  return saved
    ? { ok: true, contentVersion, versioned: alreadySent }
    : refuse(409, 'The campaign just changed. Reload the page.');
}
