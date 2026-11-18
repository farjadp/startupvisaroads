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
import { hashAddress, normaliseAddress, suppressionKey, type Channel } from './address';

export type { Channel } from './address';

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
  suppressed: Set<string>;
}

export interface PendingRecipient {
  contactId: string;
  address: string;
  rawEmail: string | null;
  rawPhone: string | null;
}

export function channelsFor(type: string): Channel[] {
  if (type === 'EMAIL') return ['EMAIL'];
  if (type === 'SMS') return ['SMS'];
  if (type === 'BOTH') return ['EMAIL', 'SMS'];
  return [];
}

export const sendKeyFor = (campaignId: string, channel: Channel, contactId: string) =>
  `${campaignId}:${channel}:${contactId}`;

export const addressKeyFor = (campaignId: string, channel: Channel, address: string) =>
  `${campaignId}:${channel}:${hashAddress(address)}`;

export async function loadAudience(campaignId: string): Promise<Audience> {
  const groups = await prisma.campaignGroup.findMany({ where: { campaignId }, select: { groupId: true } });
  const [contacts, logs, suppressions] = await Promise.all([
    prisma.marketingContact.findMany({
      where: { groupId: { in: groups.map((g) => g.groupId) } },
      select: { id: true, email: true, phone: true, tags: true },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    }),
    prisma.campaignLog.findMany({
      where: { campaignId },
      select: { contactId: true, channel: true, addressKey: true },
    }),
    prisma.marketingSuppression.findMany({ select: { key: true } }),
  ]);
  return { contacts, logs, suppressed: new Set(suppressions.map((s) => s.key)) };
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
    if (audience.suppressed.has(suppressionKey(channel, address))) continue;
    if (doneKeys.has(addressKeyFor(campaignId, channel, address))) continue;
    pending.set(address, { contactId: contact.id, address, rawEmail: contact.email, rawPhone: contact.phone });
  }
  return [...pending.values()];
}
