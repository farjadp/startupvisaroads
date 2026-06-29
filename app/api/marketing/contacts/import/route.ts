import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

async function checkAuth(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  return !!session?.username;
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const groupId = formData.get('groupId') as string | null;

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const text = await file.text();
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  if (lines.length < 2) {
    return NextResponse.json({ error: 'CSV must have header + at least 1 row' }, { status: 400 });
  }

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/[^a-z]/g, ''));
  const emailIdx = headers.findIndex((h) => h.includes('email'));
  const phoneIdx = headers.findIndex((h) => h.includes('phone') || h.includes('mobile'));
  const nameIdx = headers.findIndex((h) => h.includes('name'));

  if (emailIdx === -1 && phoneIdx === -1) {
    return NextResponse.json(
      { error: 'CSV must contain at least an "email" or "phone" column' },
      { status: 400 },
    );
  }

  const rows = lines.slice(1).map((line) => {
    const cols = line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
    const emailVal = emailIdx >= 0 ? cols[emailIdx] || null : null;
    return {
      email: emailVal ? emailVal.trim().toLowerCase() : null,
      phone: phoneIdx >= 0 ? cols[phoneIdx] || null : null,
      name: nameIdx >= 0 ? cols[nameIdx] || null : null,
      groupId: groupId || null,
    };
  }).filter((r) => r.email || r.phone);

  let created = 0;
  let skipped = 0;

  // 1. Fetch all existing emails and phones in a single query
  const existingContacts = await prisma.marketingContact.findMany({
    select: {
      email: true,
      phone: true,
    },
  });

  const dbEmails = new Set<string>();
  const dbPhones = new Set<string>();

  for (const c of existingContacts) {
    if (c.email) dbEmails.add(c.email.toLowerCase());
    if (c.phone) dbPhones.add(c.phone.trim());
  }

  // 2. Filter rows to find only non-duplicates
  const seenEmails = new Set<string>();
  const seenPhones = new Set<string>();
  const toCreate: typeof rows = [];

  for (const row of rows) {
    let isDuplicate = false;

    if (row.email) {
      const emailLower = row.email.toLowerCase();
      if (seenEmails.has(emailLower) || dbEmails.has(emailLower)) {
        isDuplicate = true;
      } else {
        seenEmails.add(emailLower);
      }
    }

    if (!isDuplicate && row.phone) {
      const phoneTrimmed = row.phone.trim();
      if (seenPhones.has(phoneTrimmed) || dbPhones.has(phoneTrimmed)) {
        isDuplicate = true;
      } else {
        seenPhones.add(phoneTrimmed);
      }
    }

    if (isDuplicate) {
      skipped++;
      continue;
    }

    toCreate.push(row);
  }

  // 3. Batch insert new contacts using createMany
  const batchSize = 1000;
  for (let i = 0; i < toCreate.length; i += batchSize) {
    const batch = toCreate.slice(i, i + batchSize);
    await prisma.marketingContact.createMany({
      data: batch,
    });
    created += batch.length;
  }

  return NextResponse.json({ created, skipped, total: rows.length });
}
