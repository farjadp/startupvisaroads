'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

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

export async function importKeywordStrategy() {
  try {
    const filePath = path.join(process.cwd(), 'prisma', 'keywords.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const keywords: string[] = JSON.parse(fileContent);

    // Get existing keywords to avoid duplicates
    const existing = await prisma.aiKeyword.findMany({
      select: { keyword: true }
    });
    const existingSet = new Set(existing.map(e => e.keyword.toLowerCase()));

    const newKeywords = keywords.filter(k => !existingSet.has(k.toLowerCase()));

    if (newKeywords.length > 0) {
      await prisma.aiKeyword.createMany({
        data: newKeywords.map(k => ({ keyword: k, status: 'PENDING' }))
      });
    }

    revalidatePath('/en/admin/ai-writer');
    revalidatePath('/fa/admin/ai-writer');
    return { success: true, count: newKeywords.length };
  } catch (e: any) {
    console.error('Import error:', e);
    return { success: false, error: e.message };
  }
}
