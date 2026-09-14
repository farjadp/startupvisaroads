// ============================================================================
// Component: components/TeamContactLinks.tsx
// One team member's direct channels (call, text, WhatsApp, Telegram), shared
// by the team and contact pages in both locales.
// ============================================================================
import React from 'react';
import { Phone, MessageCircle, MessageSquare, Send } from 'lucide-react';
import { toE164, type TeamMember } from '@/content/team';

const LABELS = {
  en: { call: 'Call', sms: 'Text', whatsapp: 'WhatsApp', whatsappOnly: 'WhatsApp only' },
  fa: { call: 'تماس', sms: 'پیامک', whatsapp: 'واتساپ', whatsappOnly: 'فقط واتساپ' },
};

export default function TeamContactLinks({ member, locale }: { member: TeamMember; locale: 'en' | 'fa' }) {
  const t = LABELS[locale];
  const strong = `inline-flex items-center gap-2 font-bold text-xs border-b border-[#1a1a1a] pb-0.5 hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors ${locale === 'en' ? 'font-sans uppercase tracking-widest' : ''}`;
  const quiet = `inline-flex items-center gap-2 font-bold text-xs text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors ${locale === 'en' ? 'font-sans uppercase tracking-widest' : ''}`;
  // A member with WhatsApp but no phone shows the number next to WhatsApp.
  const shownNumber = member.phone ?? member.whatsappNumber;

  return (
    <div className="pt-4 border-t border-[#1a1a1a]/10 space-y-3">
      {shownNumber && (
        <p className="text-sm font-bold">
          <span dir="ltr">{shownNumber}</span>
        </p>
      )}
      <div className="flex flex-wrap gap-4">
        {member.phone && (
          <a href={`tel:${toE164(member.phone)}`} className={strong}>
            <Phone className="w-3.5 h-3.5" />
            {t.call}
          </a>
        )}
        {member.phone && member.sms && (
          <a href={`sms:${toE164(member.phone)}`} className={quiet}>
            <MessageSquare className="w-3.5 h-3.5" />
            {t.sms}
          </a>
        )}
        {member.whatsapp && (
          <a href={member.whatsapp} target="_blank" rel="noopener noreferrer" className={member.phone ? quiet : strong}>
            <MessageCircle className="w-3.5 h-3.5" />
            {member.phone ? t.whatsapp : t.whatsappOnly}
          </a>
        )}
        {member.telegram && (
          <a href={member.telegram} target="_blank" rel="noopener noreferrer" className={quiet}>
            <Send className="w-3.5 h-3.5" />
            {member.telegramHandle}
          </a>
        )}
      </div>
    </div>
  );
}
