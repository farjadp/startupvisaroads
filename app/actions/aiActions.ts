'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addAiKeywords(formData: FormData) {
  const rawKeywords = formData.get('keywords') as string;
  if (!rawKeywords) return;

  const keywordList = rawKeywords.split('\n').map(k => k.trim()).filter(Boolean);

  await prisma.aiKeyword.createMany({
    data: keywordList.map(k => ({ keyword: k }))
  });

  revalidatePath('/en/admin/ai-writer');
  revalidatePath('/fa/admin/ai-writer');
}

export async function clearCompletedKeywords() {
  await prisma.aiKeyword.deleteMany({
    where: { status: 'COMPLETED' }
  });
  revalidatePath('/en/admin/ai-writer');
  revalidatePath('/fa/admin/ai-writer');
}
