// ============================================================================
// content/team.ts
// Bilingual team member data. One source of truth for the team page and the
// contact page's team section. Contact details are factual, provided by the
// founder. No invented credentials, no invented bios.
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
  whatsapp?: string;
  whatsappNumber?: string;
  phoneNumbers?: string[];
};

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
    whatsapp: 'https://wa.me/14376611674',
    whatsappNumber: '+1 (437) 661-1674',
    phoneNumbers: ['+1 (437) 661-1674'],
  },
  {
    id: 'mohsen',
    name: 'Mohsen',
    nameFa: 'محسن',
    role: 'Account Manager & COO',
    roleFa: 'اکانت منیجر و COO',
    location: 'Finland',
    locationFa: 'فنلاند',
    telegram: 'https://t.me/mohsenkavian',
    telegramHandle: '@mohsenkavian',
    whatsapp: 'https://wa.me/358417060295',
    whatsappNumber: '+358 41 7060295',
    phoneNumbers: ['+98 919 761 2839', '+358 41 7060295'],
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
    phoneNumbers: ['+98 937 112 0408', '+45 71 539 757'],
  },
  {
    id: 'hamid',
    name: 'Hamid',
    nameFa: 'حمید',
    role: 'Startup Mentor',
    roleFa: 'منتور استارتاپ',
    location: 'Iran',
    locationFa: 'ایران',
    telegram: 'https://t.me/Hamidrezasm',
    telegramHandle: '@Hamidrezasm',
    phoneNumbers: ['+98 921 413 4435'],
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
