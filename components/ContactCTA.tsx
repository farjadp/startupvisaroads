'use client';

// ============================================================================
// Component: components/ContactCTA.tsx
// The contact box that closes every inner page, just above the footer. Main
// company details only (content/contact.ts) — no personal lines. Hidden on
// the pages that already are a contact surface or a conversion funnel.
// ============================================================================
import React from 'react';
import { useLocale } from 'next-intl';
import { Phone, MessageCircle, Mail, Send, Youtube, ArrowUpRight, ArrowUpLeft } from 'lucide-react';
import { Link, usePathname } from '@/navigation';
import { MAIN_CONTACT } from '@/content/contact';

const HIDDEN = ['/', '/contact', '/book-meeting', '/login', '/unsubscribe', '/which-path'];
const HIDDEN_PREFIXES = ['/landing', '/admin', '/tools'];

const COPY = {
  en: {
    kicker: 'Talk to us',
    heading: 'Questions about your route?',
    body: 'Call or message the main line, or write to us. Consultation sessions are free.',
    call: 'Call',
    whatsapp: 'WhatsApp',
    book: 'Book a free session',
    bookHref: '/book-meeting',
  },
  fa: {
    kicker: 'گفت‌وگو با ما',
    heading: 'درباره‌ی مسیرتان سؤال دارید؟',
    body: 'با شماره‌ی اصلی تماس بگیرید یا در واتساپ پیام بدهید، یا ایمیل بزنید. جلسات مشاوره رایگان است.',
    call: 'تماس',
    whatsapp: 'واتساپ',
    book: 'رزرو جلسه‌ی رایگان',
    bookHref: '/contact',
  },
};

export default function ContactCTA() {
  const pathname = usePathname();
  const locale = useLocale() === 'fa' ? 'fa' : 'en';
  if (HIDDEN.includes(pathname) || HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  const t = COPY[locale];
  const fa = locale === 'fa';
  const Arrow = fa ? ArrowUpLeft : ArrowUpRight;
  const heading = fa ? 'font-estedad font-black' : 'font-serif';
  const label = fa ? 'text-xs font-bold' : 'font-sans text-xs font-bold uppercase tracking-widest';

  return (
    <aside aria-label={t.kicker} className={`px-4 md:px-8 py-16 md:py-20 bg-[#F2F0E9] ${fa ? 'font-vazir' : ''}`}>
      <div className="max-w-[1400px] mx-auto bg-[#1a1a1a] text-[#F2F0E9] grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-5 p-8 md:p-12 border-b lg:border-b-0 lg:border-e border-[#F2F0E9]/15">
          <span className={`${label} text-[#CCFF00] block mb-4`}>{t.kicker}</span>
          <h2 className={`${heading} text-3xl md:text-4xl leading-tight mb-4`}>{t.heading}</h2>
          <p className="text-[#F2F0E9]/65 leading-relaxed max-w-md">{t.body}</p>
          <Link href={t.bookHref} className={`${label} inline-flex items-center gap-2 mt-8 border-b border-[#CCFF00] pb-1 hover:text-[#CCFF00] transition-colors`}>
            {t.book} <Arrow className="w-4 h-4" />
          </Link>
        </div>

        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-between gap-10">
          <div>
            <a href={MAIN_CONTACT.tel} className={`${fa ? 'font-estedad font-black' : 'font-serif'} block text-3xl md:text-5xl hover:text-[#CCFF00] transition-colors ${fa ? 'text-right' : ''}`}>
              <bdi dir="ltr">{MAIN_CONTACT.phone}</bdi>
            </a>
            <div className="flex flex-wrap gap-3 mt-6">
              <a href={MAIN_CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className={`${label} inline-flex items-center gap-2 bg-[#CCFF00] text-[#1a1a1a] px-5 py-3 hover:bg-[#F2F0E9] transition-colors`}>
                <MessageCircle className="w-4 h-4" /> {t.whatsapp}
              </a>
              <a href={MAIN_CONTACT.tel} className={`${label} inline-flex items-center gap-2 border border-[#F2F0E9]/30 px-5 py-3 hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors`}>
                <Phone className="w-4 h-4" /> {t.call}
              </a>
            </div>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pt-8 border-t border-[#F2F0E9]/15 text-sm">
            {MAIN_CONTACT.emails.map((email) => (
              <li key={email}>
                <a href={`mailto:${email}`} className="inline-flex items-center gap-2 text-[#F2F0E9]/80 hover:text-[#CCFF00] transition-colors break-all">
                  <Mail className="w-4 h-4 shrink-0" /> <bdi dir="ltr">{email}</bdi>
                </a>
              </li>
            ))}
            <li>
              <a href={MAIN_CONTACT.telegram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#F2F0E9]/80 hover:text-[#CCFF00] transition-colors">
                <Send className="w-4 h-4 shrink-0" /> <bdi dir="ltr">{MAIN_CONTACT.telegramHandle}</bdi>
              </a>
            </li>
            <li>
              <a href={MAIN_CONTACT.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#F2F0E9]/80 hover:text-[#CCFF00] transition-colors">
                <Youtube className="w-4 h-4 shrink-0" /> <bdi dir="ltr">{MAIN_CONTACT.youtubeHandle}</bdi>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
