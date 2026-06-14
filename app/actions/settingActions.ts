'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const ALLOWED_SETTING_KEYS = [
  'LINKEDIN_ACCESS_TOKEN',
  'LINKEDIN_AUTHOR_URN',
  'TWITTER_CONSUMER_KEY',
  'TWITTER_CONSUMER_SECRET',
  'TWITTER_ACCESS_TOKEN',
  'TWITTER_ACCESS_SECRET',
  'FACEBOOK_PAGE_ACCESS_TOKEN',
  'FACEBOOK_PAGE_ID',
];

const SENSITIVE_KEYS = [
  'LINKEDIN_ACCESS_TOKEN',
  'TWITTER_CONSUMER_SECRET',
  'TWITTER_ACCESS_SECRET',
  'FACEBOOK_PAGE_ACCESS_TOKEN',
];

export async function saveSettings(formData: FormData) {
  try {
    for (const key of ALLOWED_SETTING_KEYS) {
      const value = formData.get(key) as string;

      // Handle sensitive fields: if they are empty or sent as placeholder, do not overwrite existing values
      if (SENSITIVE_KEYS.includes(key)) {
        if (!value || value === '●●●●●●●●●●●●●●●●') {
          continue; // skip updating this sensitive key
        }
      }

      if (value !== null && value !== undefined) {
        await prisma.setting.upsert({
          where: { key },
          update: { value: value.trim() },
          create: { key, value: value.trim() },
        });
      }
    }

    revalidatePath('/en/admin/settings');
    revalidatePath('/fa/admin/settings');
    return { success: true };
  } catch (error: any) {
    console.error('Error saving settings:', error);
    return { success: false, error: error.message };
  }
}
