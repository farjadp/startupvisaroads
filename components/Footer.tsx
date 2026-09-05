// ============================================================================
// Component: components/Footer.tsx
// Style: Modernist Editorial (Dark Mode)
// Context: Global Navigation & Legal Disclaimer
// ============================================================================

import React from 'react';
import { getLocale, getTranslations } from 'next-intl/server';
import { CONTACT } from '@/content/fa/home';
import { Link } from '@/navigation';
import { 
  ArrowUpRight, 
  Linkedin, 
  Twitter, 
  Instagram,
  Youtube,
  MessageCircle,
  Globe
} from 'lucide-react';

// The footer's link set is locale-specific, not just locale-translated: /fa
// has its own IA, and most of the English footer's targets (denmark,
// netherlands, finland, services, country, book-meeting, login) now 301 out
// of Persian. A translated label pointing at a redirect is still a dead end.
const EN_LINKS = {
  access: [
    { href: '/pnp', label: 'Canada (PNP)' },
    { href: '/country/denmark', label: 'Denmark (SUV)' },
    { href: '/europe/netherlands', label: 'Netherlands (SUV)' },
    { href: '/europe/finland', label: 'Finland (SUV)' },
    { href: '/usa/eb2-niw', label: 'USA (NIW)' },
  ],
  strategy: [
    { href: '/services', label: 'Advisory' },
    { href: '/mentorship', label: 'Mentorship' },
    { href: '/country', label: 'Jurisdictions' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'The Firm' },
  ],
  audit: '/book-meeting',
  portal: '/login',
};

const FA_LINKS = {
  access: [
    { href: '/europe/finland', label: 'فنلاند' },
    { href: '/europe/denmark', label: 'دانمارک' },
    { href: '/europe/estonia', label: 'استونی' },
    { href: '/pnp/new-brunswick', label: 'نیوبرانزویک' },
    { href: '/pnp/nova-scotia', label: 'نوااسکوشیا' },
    { href: '/usa-eb2-niw', label: 'EB-2 NIW آمریکا' },
  ],
  strategy: [
    { href: '/which-path', label: 'ارزیابی رایگان مسیر' },
    { href: '/mentorship', label: 'منتورشیپ' },
    { href: '/faq', label: 'سؤالات متداول' },
    { href: '/blog', label: 'مجله' },
    { href: '/about', label: 'درباره ما' },
  ],
  audit: '/contact',
  portal: '/contact',
};

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const locale = await getLocale();
  const t = await getTranslations('Footer');
  const isRtl = locale === 'fa';
  const links = isRtl ? FA_LINKS : EN_LINKS;
  const display = isRtl ? 'font-estedad' : 'font-serif';

  return (
    <footer className="bg-[#1a1a1a] text-[#F2F0E9] pt-24 pb-8 relative overflow-hidden border-t border-[#CCFF00]">
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Top Section: Brand & Strategy */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-24 gap-16">
           
           {/* Brand Column */}
           <div className="lg:w-1/3">
              <Link href="/" className="inline-block mb-8 group">
                 <h2 className={`${display} text-6xl md:text-8xl leading-none tracking-tighter group-hover:text-[#CCFF00] transition-colors duration-500`}>
                    Visa Roads
                 </h2>
              </Link>
              <p className="font-sans text-lg text-[#F2F0E9]/60 leading-relaxed max-w-sm">
                 {t('tagline_1')} <br/>
                 {t('tagline_2')}
              </p>
              
              {/* Socials: Ashavid's company profiles in English; Farjad's own channels in Persian */}
              <div className="flex gap-4 mt-12">
                 {(isRtl
                    ? [
                        { Icon: Youtube, href: CONTACT.youtube, label: 'YouTube' },
                        { Icon: Instagram, href: CONTACT.instagram, label: 'Instagram' },
                        { Icon: Linkedin, href: CONTACT.linkedin, label: 'LinkedIn' },
                        { Icon: MessageCircle, href: CONTACT.whatsapp, label: 'WhatsApp' },
                      ]
                    : [
                        { Icon: Linkedin, href: 'https://www.linkedin.com/company/ashavid/', label: 'LinkedIn' },
                        { Icon: Twitter, href: 'https://x.com/ashavidgroup', label: 'X (Twitter)' },
                        { Icon: Instagram, href: 'https://www.instagram.com/ashavidgroup/', label: 'Instagram' },
                      ]).map(({ Icon, href, label }, i) => (
                    <a key={i} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-12 h-12 rounded-full border border-[#F2F0E9]/20 flex items-center justify-center hover:bg-[#CCFF00] hover:text-black hover:border-[#CCFF00] transition-all duration-300">
                       <Icon size={20} />
                    </a>
                 ))}
              </div>
           </div>

           {/* Navigation Grid */}
           <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-12">
              
              {/* Column 1: Global Access */}
              <div>
                 <h4 className="font-sans text-xs font-bold text-[#CCFF00] mb-8 uppercase tracking-widest flex items-center gap-2">
                    <Globe size={12}/> {t('col_access')}
                 </h4>
                 <ul className={`space-y-4 ${display} text-2xl text-[#F2F0E9]/80`}>
                    {links.access.map((l) => (
                       <li key={l.href}><Link href={l.href} className="hover:text-[#CCFF00] hover:pl-2 transition-all">{l.label}</Link></li>
                    ))}
                 </ul>
              </div>

              {/* Column 2: Strategy */}
              <div>
                 <h4 className="font-sans text-xs font-bold text-[#CCFF00] mb-8 uppercase tracking-widest">{t('col_strategy')}</h4>
                 <ul className={`space-y-4 ${display} text-2xl text-[#F2F0E9]/80`}>
                    {links.strategy.map((l) => (
                       <li key={l.href}><Link href={l.href} className="hover:text-[#CCFF00] hover:pl-2 transition-all">{l.label}</Link></li>
                    ))}
                 </ul>
              </div>

              {/* Column 3: Headquarters */}
              <div>
                 <h4 className="font-sans text-xs font-bold text-[#CCFF00] mb-8 uppercase tracking-widest">{t('col_hq')}</h4>
                 <address className="not-italic font-sans text-[#F2F0E9]/60 space-y-2 mb-8 text-sm leading-relaxed">
                    <strong>{t('entity')}</strong><br/>
                    {t('address_1')}<br/>
                    {t('address_2')}<br/>
                    {isRtl ? (
                       <>
                          <a href={`mailto:${CONTACT.email}`} className="hover:text-white transition-colors" dir="ltr">{CONTACT.email}</a><br/>
                          <a href={CONTACT.whatsapp} className="hover:text-white transition-colors" dir="ltr">{CONTACT.whatsappNumber}</a>
                       </>
                    ) : (
                       <a href="mailto:hello@ashavid.ca" className="hover:text-white transition-colors">hello@ashavid.ca</a>
                    )}
                 </address>
                 
                 <Link href={links.audit} className="inline-flex items-center gap-2 font-sans font-bold border-b border-[#CCFF00] pb-1 hover:text-[#CCFF00] transition-colors text-sm tracking-widest uppercase">
                    {t('schedule_audit')} <ArrowUpRight size={14} />
                 </Link>
                 
                 <div className="mt-8 pt-8 border-t border-[#F2F0E9]/10">
                    <Link href={links.portal} className="text-[10px] font-sans text-[#F2F0E9]/30 hover:text-[#CCFF00] transition-colors uppercase tracking-widest">
                       {t('client_portal')}
                    </Link>
                 </div>
              </div>

           </div>
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