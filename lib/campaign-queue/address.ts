// ============================================================================
// lib/campaign-queue/address.ts
// How an email or phone number is compared and remembered. Logs and the
// suppression list keep only a hash, so an address does not outlive the
// contact in readable form after someone unsubscribes.
// ============================================================================
import { createHash } from 'crypto';

export type Channel = 'EMAIL' | 'SMS';

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normaliseAddress(channel: Channel, contact: { email?: string | null; phone?: string | null }): string | null {
  if (channel === 'EMAIL') {
    const email = contact.email?.trim().toLowerCase();
    return email && EMAIL_SHAPE.test(email) ? email : null;
  }
  // Keep in step with the backfill in the campaign_drip_queue migration.
  const phone = contact.phone?.replace(/[^0-9+]/g, '');
  return phone || null;
}

export const hashAddress = (address: string) => createHash('sha256').update(address, 'utf8').digest('hex');

export const suppressionKey = (channel: Channel, address: string) => `${channel}:${hashAddress(address)}`;
