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
    return {
      email: emailIdx >= 0 ? cols[emailIdx] || null : null,
      phone: phoneIdx >= 0 ? cols[phoneIdx] || null : null,
      name: nameIdx >= 0 ? cols[nameIdx] || null : null,
      groupId: groupId || null,
      tags: '[]',
    };
  }).filter((r) => r.email || r.phone);

  let created = 0;
  let skipped = 0;

  for (const row of rows) {
    if (row.email) {
      const existing = await prisma.marketingContact.findFirst({ where: { email: row.email } });
      if (existing) { skipped++; continue; }
    }
    await prisma.marketingContact.create({ data: row });
    created++;
  }

  return NextResponse.json({ created, skipped, total: rows.length });
}
