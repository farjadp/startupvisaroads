// ============================================================================
// Component: components/Footer.tsx
// Style: Modernist Editorial (Dark Mode)
// Context: Global Navigation & Legal Disclaimer
// ============================================================================

import React from 'react';
import { getLocale, getTranslations } from 'next-intl/server';
import { CONTACT } from '@/content/fa/home';
import { MAIN_CONTACT } from '@/content/contact';
import { Link } from '@/navigation';
import { APP_STORE_LINKS } from '@/lib/app-links';
import { footerColumns } from '@/lib/nav';
import FooterLink from '@/components/nav/FooterLink';
import AppleMark from '@/components/AppleMark';
import { 
  ArrowUpRight, 
  Linkedin, 
  Twitter, 
  Instagram,
  Youtube,
  MessageCircle,
  Play,
} from 'lucide-react';

// The link lists live in lib/nav.ts (footerColumns), shared with the header.
// /fa has its own IA, so each locale has its own set, not a translation.
// The footer is the sitemap of record: every route and company page is here,
// which is what lets the header stay at five items.
const AUDIT = { en: '/book-meeting', fa: '/contact' } as const;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const locale = await getLocale();
  const t = await getTranslations('Footer');
  const isRtl = locale === 'fa';
  const navLocale = isRtl ? 'fa' : 'en';
  const columns = footerColumns(navLocale);
  const display = isRtl ? 'font-estedad' : 'font-serif';

  return (
    <footer className="bg-[#1a1a1a] text-[#F2F0E9] pt-24 pb-8 relative overflow-hidden border-t border-[#CCFF00]">
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Top: brand, contact and the sitemap grid */}
        <div className="mb-16 grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-6">

           {/* Brand Column */}
           <div className="col-span-2 md:col-span-3 lg:col-span-1">
              <Link href="/" className="inline-block mb-6 group">
                 <h2 className={`${display} text-5xl leading-none tracking-tighter group-hover:text-[#CCFF00] transition-colors duration-500`}>
                    Visa Roads
                 </h2>
              </Link>
              <p className="font-sans text-sm text-[#F2F0E9]/70 leading-relaxed max-w-sm">
                 {t('tagline_1')} {t('tagline_2')}
              </p>
              {/* Socials: Ashavid's company profiles in English; Farjad's own channels in Persian */}
              <div className="flex gap-4 mt-8">
                 {(isRtl
                    ? [
                        { Icon: Youtube, href: MAIN_CONTACT.youtube, label: 'YouTube' },
                        { Icon: Instagram, href: CONTACT.instagram, label: 'Instagram' },
                        { Icon: Linkedin, href: CONTACT.linkedin, label: 'LinkedIn' },
                        { Icon: MessageCircle, href: MAIN_CONTACT.whatsapp, label: 'WhatsApp' },
                      ]
                    : [
                        { Icon: Linkedin, href: 'https://www.linkedin.com/company/ashavid/', label: 'LinkedIn' },
                        { Icon: Twitter, href: 'https://x.com/ashavidgroup', label: 'X (Twitter)' },
                        { Icon: Instagram, href: 'https://www.instagram.com/ashavidgroup/', label: 'Instagram' },
                        { Icon: Youtube, href: MAIN_CONTACT.youtube, label: 'YouTube' },
                        { Icon: MessageCircle, href: MAIN_CONTACT.whatsapp, label: 'WhatsApp' },
                      ]).map(({ Icon, href, label }, i) => (
                    <a key={i} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-12 h-12 rounded-full border border-[#F2F0E9]/20 flex items-center justify-center hover:bg-[#CCFF00] hover:text-black hover:border-[#CCFF00] transition-all duration-300">
                       <Icon size={20} />
                    </a>
                 ))}
              </div>

              {/* The app in both stores (lib/app-links.ts). */}
              <div className="mt-6 flex flex-wrap gap-3">
                 {APP_STORE_LINKS.appStore ? (
                    <a
                       href={APP_STORE_LINKS.appStore}
                       target="_blank"
                       rel="noopener noreferrer"
                       aria-label={isRtl ? 'دانلود اپ VisaRoads از اپ استور' : 'Get the VisaRoads app on the App Store'}
                       className="inline-flex items-center gap-3 rounded-2xl border border-[#F2F0E9]/20 px-5 py-3 hover:bg-[#CCFF00] hover:text-black hover:border-[#CCFF00] transition-all duration-300"
                    >
                       <AppleMark className="h-[18px] w-[18px]" />
                       <span className="flex flex-col leading-tight font-sans">
                          <span className="text-[10px] opacity-60">{isRtl ? 'دانلود از' : 'Get it on'}</span>
                          <span className="text-sm font-bold">{isRtl ? 'اپ استور' : 'App Store'}</span>
                       </span>
                    </a>
                 ) : null}
                 {APP_STORE_LINKS.googlePlay ? (
                    <a
                       href={APP_STORE_LINKS.googlePlay}
                       target="_blank"
                       rel="noopener noreferrer"
                       aria-label={isRtl ? 'دانلود اپ VisaRoads از گوگل پلی' : 'Get the VisaRoads app on Google Play'}
                       className="inline-flex items-center gap-3 rounded-2xl border border-[#F2F0E9]/20 px-5 py-3 hover:bg-[#CCFF00] hover:text-black hover:border-[#CCFF00] transition-all duration-300"
                    >
                       <Play size={18} className="fill-current" aria-hidden />
                       <span className="flex flex-col leading-tight font-sans">
                          <span className="text-[10px] opacity-60">{isRtl ? 'دانلود از' : 'Get it on'}</span>
                          <span className="text-sm font-bold">{isRtl ? 'گوگل پلی' : 'Google Play'}</span>
                       </span>
                    </a>
                 ) : null}
              </div>

              <address className="not-italic font-sans text-[#F2F0E9]/70 mt-8 text-sm leading-relaxed">
                 <strong className="text-[#F2F0E9]">{t('entity')}</strong><br/>
                 <span className="text-xs">{t('subsidiary')}</span><br/>
                 {t('address_1')}, {t('address_2')}<br/>
                 <a href={MAIN_CONTACT.tel} className="hover:text-white transition-colors" dir="ltr">{MAIN_CONTACT.phone}</a>
                 {' · '}
                 <a href={MAIN_CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{isRtl ? 'واتساپ' : 'WhatsApp'}</a><br/>
                 {MAIN_CONTACT.emails.map((email) => (
                    <React.Fragment key={email}>
                       <a href={`mailto:${email}`} className="hover:text-white transition-colors break-all" dir="ltr">{email}</a><br/>
                    </React.Fragment>
                 ))}
              </address>
              <FooterLink href={AUDIT[navLocale]} locale={navLocale} label={t('schedule_audit')} className="mt-6 inline-flex items-center gap-2 font-sans font-bold border-b border-[#CCFF00] pb-1 hover:text-[#CCFF00] transition-colors text-sm tracking-widest uppercase">
                 {t('schedule_audit')} <ArrowUpRight size={14} aria-hidden />
              </FooterLink>
           </div>

           {/* Sitemap columns (lib/nav.ts) */}
           {columns.map((col) => (
              <nav key={col.title} aria-label={col.title} className="min-w-0">
                 <h3 className={`${isRtl ? 'font-vazir text-sm' : 'font-sans text-xs uppercase tracking-widest'} font-bold text-[#CCFF00] mb-5`}>
                    {col.title}
                 </h3>
                 {col.groups.map((g, gi) => (
                    <div key={gi} className={gi > 0 ? 'mt-6' : ''}>
                       {g.title && (
                          <p className={`${isRtl ? 'font-vazir text-xs' : 'font-sans text-[11px] uppercase tracking-widest'} text-[#F2F0E9]/60 mb-3`}>{g.title}</p>
                       )}
                       <ul className="flex flex-col gap-2.5">
                          {g.links.map((l) => (
                             <li key={l.href}>
                                <FooterLink
                                   href={l.href}
                                   locale={navLocale}
                                   className={`${isRtl ? 'font-vazir text-[15px]' : 'font-sans text-sm'} text-[#F2F0E9]/80 hover:text-[#CCFF00] transition-colors leading-snug`}
                                >
                                   {l.status ? `${l.label} (${l.status})` : l.label}
                                </FooterLink>
                             </li>
                          ))}
                       </ul>
                    </div>
                 ))}
              </nav>
           ))}
        </div>

        {/* Legal Disclaimer */}
        <div className="border-t border-[#F2F0E9]/10 pt-10 pb-20">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                 <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-[#b91c1c] rounded-full"></div>
                    <h5 className="font-sans text-[10px] font-bold text-[#F2F0E9] uppercase tracking-widest">{t('disclaimer_heading')}</h5>
                 </div>
                 <p className="font-sans text-[10px] text-[#F2F0E9]/40 text-justify leading-relaxed max-w-3xl">
                    {t('disclaimer_body')}
                 </p>
              </div>
              <div className="lg:col-span-4 flex flex-col md:flex-row justify-end items-end gap-6 text-[10px] text-[#F2F0E9]/40 font-sans uppercase tracking-widest">
                 <Link href="/privacy" className="hover:text-[#F2F0E9] transition-colors">{t('privacy')}</Link>
                 <Link href="/terms" className="hover:text-[#F2F0E9] transition-colors">{t('terms')}</Link>
                 <span>© {currentYear} {t('rights')}</span>
              </div>
           </div>
        </div>

      </div>

      {/* Background Watermark (Subtle) */}
      <div className="absolute -bottom-[5vw] left-0 w-full text-center pointer-events-none select-none overflow-hidden opacity-[0.03]">
         <span className="font-serif text-[25vw] text-[#F2F0E9] leading-none whitespace-nowrap">
            BORDERLESS
         </span>
      </div>

    </footer>
  );
}