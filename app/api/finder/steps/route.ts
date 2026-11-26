// POST /api/finder/steps {step, ...} — completes one unlock step, in order.
//   profile: {noc, experience, clb}   guide: {}   quiz: {answers}   pledge: {agree: true}
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { isClb, isExperience, isNoc, isStep, nextStep, quizPassed } from '@/lib/rcip-finder/core';
import { completeStep, getMe } from '@/lib/rcip-finder/service';
import { sessionUserId } from '@/lib/rcip-finder/session';
import { json, limited, readJson } from '@/lib/rcip-finder/http';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const userId = await sessionUserId(req);
  if (!userId) return json({ error: 'signed_out' }, 401);
  const block = limited(req, 'steps', 30, 60 * 60_000, userId);
  if (block) return block;
  const body = await readJson(req, 4000);
  const step = body?.step;
  if (!isStep(step) || step === 'account') return json({ error: 'step' }, 400);
  const me = await getMe(userId);
  if (!me) return json({ error: 'signed_out' }, 401);

  if (step === 'profile') {
    // The profile can be edited at any time; the step counts once.
    if (!isNoc(body?.noc) || !isExperience(body?.experience) || !isClb(body?.clb)) return json({ error: 'profile' }, 400);
    await prisma.finderUser.update({ where: { id: userId }, data: { noc: body.noc as string, experience: body.experience as string, clb: body.clb as number } });
  } else {
    if (me.steps.includes(step)) return json({ me });
    if (nextStep(me.steps) !== step) return json({ error: 'order', next: me.next }, 409);
    if (step === 'quiz' && !quizPassed(body?.answers)) return json({ error: 'quiz_wrong' }, 422);
    if (step === 'pledge' && body?.agree !== true) return json({ error: 'pledge' }, 400);
  }
  await completeStep(userId, step);
  return json({ me: await getMe(userId) });
}
