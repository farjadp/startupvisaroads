// POST /api/finder/auth/logout — clears the finder session cookie.
import { json } from '@/lib/rcip-finder/http';
import { sessionCookie } from '@/lib/rcip-finder/session';

export async function POST() {
  const res = json({ ok: true });
  res.cookies.set(sessionCookie('', 0));
  return res;
}
