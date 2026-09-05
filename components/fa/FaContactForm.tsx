'use client';

// ============================================================================
// Component: components/fa/FaContactForm.tsx
// The Persian contact form. Posts to the existing sendContactForm action
// (same fields: name, email, phone, company, objective, brief).
// ============================================================================
import React, { useState, useTransition } from 'react';
import { Send } from 'lucide-react';
import { sendContactForm } from '@/app/[locale]/(public)/contact/actions';
import { contact } from '@/content/fa/contact';

export default function FaContactForm() {
  const f = contact.form;
  const [state, setState] = useState<'idle' | 'done' | 'error'>('idle');
  const [pending, start] = useTransition();

  const submit = (data: FormData) =>
    start(async () => {
      const r = await sendContactForm(data);
      setState(r.success ? 'done' : 'error');
    });

  if (state === 'done') {
    return <p className="border-s-4 border-[#CCFF00] ps-6 py-4 font-bold">{f.done}</p>;
  }

  const input = 'border border-[#1a1a1a]/30 bg-transparent px-4 py-3 focus:border-[#1a1a1a] outline-none w-full';

  return (
    <form action={submit} className="grid gap-4 max-w-xl">
      <input name="name" required placeholder={f.name} className={input} />
      <input name="email" type="email" required placeholder={f.email} className={input} dir="ltr" />
      <input name="phone" placeholder={f.phone} className={input} dir="ltr" />
      <input name="company" placeholder={f.company} className={input} />
      <select name="objective" defaultValue="" className={input}>
        <option value="" disabled>{f.objective}</option>
        {f.objectives.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <textarea name="brief" rows={5} placeholder={f.brief} className={input} />
      <button type="submit" disabled={pending} className="inline-flex items-center justify-center gap-3 bg-[#1a1a1a] text-[#F2F0E9] px-8 py-4 font-bold disabled:opacity-50 hover:bg-[#CCFF00] hover:text-black transition-colors">
        {pending ? f.sending : f.submit}
        <Send className="w-4 h-4" />
      </button>
      {state === 'error' && <p className="text-sm text-[#b91c1c]">{f.error}</p>}
    </form>
  );
}
