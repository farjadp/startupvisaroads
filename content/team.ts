// ============================================================================
// content/team.ts
// Bilingual team member data. One source of truth for the team page and the
// contact page's team section. Contact details are factual, provided by the
// founder (updated 2026-09-14). No invented credentials, no invented bios.
//
// Every channel set here is rendered publicly. The numbers below were given
// by the founder for publication; do not add a number here without that
// person's consent. Older personal (+98) mobiles were removed on purpose.
//
//   phone    — shown with a call link
//   sms      — the phone also takes text messages
//   whatsapp — wa.me link; `whatsappNumber` is shown when there is no `phone`
// ============================================================================

export type TeamMember = {
  id: string;
  name: string;
  nameFa: string;
  role: string;
  roleFa: string;
  location: string;
  locationFa: string;
  telegram?: string;
  telegramHandle?: string;
  phone?: string;
  sms?: boolean;
  whatsapp?: string;
  whatsappNumber?: string;
};

/** `+1 (437) 661-1674` -> `+14376611674`, for tel:/sms: links. */
export const toE164 = (n: string) => '+' + n.replace(/\D/g, '');

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'farjad',
    name: 'Farjad P.M.',
    nameFa: 'فرجاد',
    role: 'Startup Mentor & Founder of Ashavid',
    roleFa: 'منتور استارتاپ و بنیان‌گذار آشاوید',
    location: 'Toronto, Canada',
    locationFa: 'تورنتو، کانادا',
    telegram: 'https://t.me/farjadtalks',
    telegramHandle: '@farjadtalks',
    phone: '+1 (437) 661-1674',
    sms: true,
  },
  {
    id: 'mohsen',
    name: 'Mohsen',
    nameFa: 'محسن',
    role: 'COO & Account Manager',
    roleFa: 'مدیر عملیات (COO) و اکانت منیجر',
    location: 'Finland',
    locationFa: 'فنلاند',
    telegram: 'https://t.me/mohsenkavian',
    telegramHandle: '@mohsenkavian',
    phone: '+358 41 7060295',
    whatsapp: 'https://wa.me/358417060295',
    whatsappNumber: '+358 41 7060295',
  },
  {
    id: 'meysam',
    name: 'Meysam',
    nameFa: 'میثم',
    role: 'Startup Mentor',
    roleFa: 'منتور استارتاپ',
    location: 'Denmark',
    locationFa: 'دانمارک',
    telegram: 'https://t.me/Mayneech',
    telegramHandle: '@Mayneech',
    phone: '+45 71 53 97 57',
    whatsapp: 'https://wa.me/4571539757',
    whatsappNumber: '+45 71 53 97 57',
  },
  {
    id: 'hamid',
    name: 'Hamid',
    nameFa: 'حمید',
    role: 'Partnership Management & Startup Mentor',
    roleFa: 'مدیریت همکاری‌ها و منتور استارتاپ',
    location: 'Iran',
    locationFa: 'ایران',
    telegram: 'https://t.me/Hamidrezasm',
    telegramHandle: '@Hamidrezasm',
    whatsapp: 'https://wa.me/989214134435',
    whatsappNumber: '+98 921 413 4435',
  },
  {
    id: 'iman',
    name: 'Iman',
    nameFa: 'ایمان',
    role: 'Product Manager',
    roleFa: 'پروداکت منیجر',
    location: '',
    locationFa: '',
  },
  {
    id: 'mohammadali',
    name: 'Mohammad Ali',
    nameFa: 'محمدعلی',
    role: 'Startup Mentor',
    roleFa: 'منتور استارتاپ',
    location: '',
    locationFa: '',
  },
  {
    id: 'hadi',
    name: 'Hadi',
    nameFa: 'هادی',
    role: 'Startup Mentor',
    roleFa: 'منتور استارتاپ',
    location: '',
    locationFa: '',
  },
];

export const hasDirectLine = (m: TeamMember) => Boolean(m.telegram || m.whatsapp || m.phone);
