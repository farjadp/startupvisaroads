// ============================================================================
// lib/campaign-queue/recipients.ts
// Who is still owed this campaign. One person can sit in several groups as
// separate contacts, so the unit here is the normalised address, not the
// contact id. Anyone with any log row for the campaign is finished: a failure
// or an unconfirmed claim is never retried, because a missed email is cheaper
// than a duplicate one.
// ============================================================================
import prisma from '@/lib/prisma';
import { isUnsubscribed } from '@/lib/marketing';

export type Channel = 'EMAIL' | 'SMS';

export interface AudienceContact {
  id: string;
  email: string | null;
  phone: string | null;
  tags: unknown;
}

export interface AudienceLog {
  contactId: string;
  channel: string;
  addressKey: string | null;
}

export interface Audience {
  contacts: AudienceContact[];
  logs: AudienceLog[];
}

export interface PendingRecipient {
  contactId: string;
  address: string;
  rawEmail: string | null;
}

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function channelsFor(type: string): Channel[] {
  if (type === 'EMAIL') return ['EMAIL'];
  if (type === 'SMS') return ['SMS'];
  if (type === 'BOTH') return ['EMAIL', 'SMS'];
  return [];
}

export function normaliseAddress(channel: Channel, contact: Pick<AudienceContact, 'email' | 'phone'>): string | null {
  if (channel === 'EMAIL') {
    const email = contact.email?.trim().toLowerCase();
    return email && EMAIL_SHAPE.test(email) ? email : null;
  }
  // Keep in step with the backfill in the campaign_drip_queue migration.
  const phone = contact.phone?.replace(/[^0-9+]/g, '');
  return phone || null;
}

export const sendKeyFor = (campaignId: string, channel: Channel, contactId: string) =>
  `${campaignId}:${channel}:${contactId}`;

export const addressKeyFor = (campaignId: string, channel: Channel, address: string) =>
  `${campaignId}:${channel}:${address}`;

export async function loadAudience(campaignId: string): Promise<Audience> {
  const groups = await prisma.campaignGroup.findMany({ where: { campaignId }, select: { groupId: true } });
  const [contacts, logs] = await Promise.all([
    prisma.marketingContact.findMany({
      where: { groupId: { in: groups.map((g) => g.groupId) } },
      select: { id: true, email: true, phone: true, tags: true },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    }),
    prisma.campaignLog.findMany({
      where: { campaignId },
      select: { contactId: true, channel: true, addressKey: true },
    }),
  ]);
  return { contacts, logs };
}

/** Everyone still to receive this channel, one entry per address. */
export function pendingRecipients(campaignId: string, channel: Channel, audience: Audience): PendingRecipient[] {
  const logs = audience.logs.filter((l) => l.channel === channel);
  const doneContacts = new Set(logs.map((l) => l.contactId));
  const doneKeys = new Set(logs.map((l) => l.addressKey).filter(Boolean));
  const blocked = new Set<string>();

  // First pass: an unsubscribe or an earlier send on any contact holding an
  // address covers every other contact holding it.
  for (const contact of audience.contacts) {
    const address = normaliseAddress(channel, contact);
    if (address && (doneContacts.has(contact.id) || isUnsubscribed(contact.tags))) blocked.add(address);
  }

  const pending = new Map<string, PendingRecipient>();
  for (const contact of audience.contacts) {
    const address = normaliseAddress(channel, contact);
    if (!address || blocked.has(address) || pending.has(address)) continue;
    if (doneKeys.has(addressKeyFor(campaignId, channel, address))) continue;
    pending.set(address, { contactId: contact.id, address, rawEmail: contact.email });
  }
  return [...pending.values()];
}
