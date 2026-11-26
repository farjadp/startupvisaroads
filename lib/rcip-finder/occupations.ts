// ============================================================================
// lib/rcip-finder/occupations.ts
// Occupations the finder knows by name in both languages, and the business
// types that employ them as their main work ("core" tier).
//
// A visitor can also pick any of the ~500 NOC codes in the Job Bank file by
// English name or code (finder-tables.json); those get only the "related
// industry" tier, because nobody has written their business-type keywords.
// Keywords are lowercase substrings of the employer's business type, as
// classified in the data project (rcip_all_classified.csv, business_type).
// Reviewed by hand, 26 Nov 2026, against the 200 commonest business-type words.
// ============================================================================

export type Occupation = {
  noc: string;
  en: string;
  fa: string;
  /** Extra words a visitor might type, either language. */
  aliases: string[];
  /** Business types whose main work this occupation is. Empty: related tier only. */
  core: string[];
};

const RESTAURANT = ['restaurant', 'cafe', 'coffee', 'bakery', 'pizza', 'sushi', 'grill', 'diner', 'pub', 'bar and', 'catering', 'food service', 'fast food', 'sandwich', 'bistro'];
const HOTEL = ['hotel', 'motel', 'inn', 'resort', 'lodge', 'accommodation'];
const CARE_HOME = ['long-term care', 'long term care', 'retirement', 'seniors', 'nursing home', 'care home', 'assisted living'];
const CLINIC = ['hospital', 'clinic', 'medical', 'health centre', 'health center', 'healthcare'];

export const OCCUPATIONS: Occupation[] = [
  { noc: '72106', en: 'Welder', fa: 'جوشکار', aliases: ['welding', 'جوشکاری', 'fabricator'], core: ['welding', 'fabrication', 'metal', 'steel', 'machine shop'] },
  { noc: '73300', en: 'Transport truck driver', fa: 'راننده‌ی کامیون', aliases: ['truck driver', 'trucker', 'class 1', 'راننده'], core: ['trucking', 'freight', 'transport', 'logistics', 'hauling', 'moving'] },
  { noc: '72401', en: 'Heavy-duty equipment mechanic', fa: 'مکانیک ماشین‌آلات سنگین', aliases: ['heavy duty mechanic', 'مکانیک سنگین'], core: ['heavy equipment', 'heavy-duty', 'heavy duty', 'equipment repair', 'equipment dealer', 'mining'] },
  { noc: '72410', en: 'Automotive service technician', fa: 'مکانیک خودرو', aliases: ['auto mechanic', 'car mechanic', 'mechanic', 'مکانیک'], core: ['automotive', 'auto repair', 'car dealership', 'dealership', 'tire', 'collision', 'auto body', 'truck repair'] },
  { noc: '72310', en: 'Carpenter', fa: 'نجار', aliases: ['carpentry', 'نجاری', 'framer'], core: ['carpentry', 'construction', 'contractor', 'renovation', 'framing', 'home builder', 'cabinet', 'millwork'] },
  { noc: '72200', en: 'Electrician', fa: 'برق‌کار', aliases: ['electrical', 'برقکار', 'تکنسین برق'], core: ['electrical', 'electric'] },
  { noc: '72300', en: 'Plumber', fa: 'لوله‌کش', aliases: ['plumbing', 'لوله کش'], core: ['plumbing', 'hvac', 'mechanical contractor'] },
  { noc: '72402', en: 'Heating, refrigeration and air conditioning mechanic', fa: 'تکنسین تهویه و سرمایش', aliases: ['hvac', 'refrigeration', 'تاسیسات'], core: ['hvac', 'heating', 'refrigeration', 'air conditioning', 'mechanical contractor'] },
  { noc: '75110', en: 'Construction labourer', fa: 'کارگر ساختمانی', aliases: ['labourer', 'construction helper', 'کارگر'], core: ['construction', 'contractor', 'roofing', 'concrete', 'excavation', 'landscaping', 'paving'] },
  { noc: '73400', en: 'Heavy equipment operator', fa: 'اپراتور ماشین‌آلات سنگین', aliases: ['equipment operator', 'operator', 'اپراتور'], core: ['excavation', 'construction', 'mining', 'paving', 'road', 'forestry', 'logging'] },
  { noc: '83100', en: 'Underground miner', fa: 'معدن‌کار زیرزمینی', aliases: ['miner', 'mining', 'معدنچی', 'معدن'], core: ['mining', 'mine'] },
  { noc: '63200', en: 'Cook', fa: 'آشپز', aliases: ['line cook', 'chef', 'آشپزی', 'سرآشپز'], core: [...RESTAURANT, ...HOTEL] },
  { noc: '62200', en: 'Chef', fa: 'سرآشپز', aliases: ['head chef', 'sous chef'], core: [...RESTAURANT, ...HOTEL] },
  { noc: '62020', en: 'Food service supervisor', fa: 'سرپرست خدمات غذایی', aliases: ['food supervisor', 'shift supervisor', 'سرپرست رستوران'], core: RESTAURANT },
  { noc: '60030', en: 'Restaurant manager', fa: 'مدیر رستوران', aliases: ['food service manager', 'مدیر'], core: RESTAURANT },
  { noc: '65201', en: 'Food counter attendant / kitchen helper', fa: 'کمک‌آشپز و کارکن پیشخوان', aliases: ['kitchen helper', 'dishwasher', 'کمک آشپز'], core: RESTAURANT },
  { noc: '63202', en: 'Baker', fa: 'نانوا', aliases: ['bakery', 'قنادی', 'شیرینی‌پز'], core: ['bakery', 'baker', 'pastry', 'grocery'] },
  { noc: '63201', en: 'Butcher', fa: 'قصاب', aliases: ['meat cutter', 'قصابی'], core: ['butcher', 'meat', 'grocery', 'supermarket', 'processing'] },
  { noc: '62100', en: 'Hotel front desk / accommodation supervisor', fa: 'پذیرش و سرپرست هتل', aliases: ['front desk', 'hotel', 'هتل'], core: HOTEL },
  { noc: '65310', en: 'Light duty cleaner', fa: 'نظافتچی', aliases: ['cleaner', 'housekeeper', 'janitor', 'نظافت'], core: [...HOTEL, 'cleaning', 'janitorial', ...CARE_HOME] },
  { noc: '33102', en: 'Nurse aide / patient service associate', fa: 'کمک‌پرستار', aliases: ['personal support worker', 'psw', 'care aide', 'health care aide', 'مراقب', 'کمک پرستار'], core: [...CARE_HOME, ...CLINIC, 'home care', 'home health'] },
  { noc: '44101', en: 'Home support worker / caregiver', fa: 'مراقب و کارکن حمایت خانگی', aliases: ['caregiver', 'home support', 'مراقب سالمند', 'پرستار کودک'], core: [...CARE_HOME, 'home care', 'home health', 'community living', 'support services'] },
  { noc: '32101', en: 'Licensed practical nurse', fa: 'پرستار عملی (LPN)', aliases: ['lpn', 'rpn', 'practical nurse', 'پرستار'], core: [...CARE_HOME, ...CLINIC] },
  { noc: '31301', en: 'Registered nurse', fa: 'پرستار ثبت‌شده (RN)', aliases: ['rn', 'nurse', 'پرستار'], core: [...CARE_HOME, ...CLINIC] },
  { noc: '31102', en: 'Family physician', fa: 'پزشک عمومی و خانواده', aliases: ['doctor', 'gp', 'physician', 'پزشک', 'دکتر'], core: ['clinic', 'medical', 'hospital', 'health centre'] },
  { noc: '31110', en: 'Dentist', fa: 'دندان‌پزشک', aliases: ['dental', 'دندانپزشک'], core: ['dental'] },
  { noc: '33100', en: 'Dental assistant', fa: 'دستیار دندان‌پزشک', aliases: ['dental assistant', 'دستیار دندانپزشک'], core: ['dental'] },
  { noc: '32111', en: 'Dental hygienist', fa: 'بهداشتکار دهان و دندان', aliases: ['hygienist'], core: ['dental'] },
  { noc: '31120', en: 'Pharmacist', fa: 'داروساز', aliases: ['pharmacy', 'داروخانه'], core: ['pharmacy', 'drug store', 'drugstore'] },
  { noc: '33103', en: 'Pharmacy technician / assistant', fa: 'تکنسین داروخانه', aliases: ['pharmacy assistant', 'pharmacy technician'], core: ['pharmacy', 'drug store', 'drugstore'] },
  { noc: '42202', en: 'Early childhood educator', fa: 'مربی کودک', aliases: ['ece', 'daycare', 'مهدکودک', 'مربی مهد'], core: ['daycare', 'child care', 'childcare', 'early learning', 'preschool', 'nursery'] },
  { noc: '42201', en: 'Social and community service worker', fa: 'مددکار اجتماعی', aliases: ['social worker', 'community worker', 'مددکار'], core: ['community', 'social services', 'support services', 'community living', 'non-profit', 'nonprofit'] },
  { noc: '64100', en: 'Retail salesperson', fa: 'فروشنده', aliases: ['sales associate', 'retail', 'فروشندگی'], core: ['store', 'retail', 'dealership', 'shop', 'boutique', 'pharmacy', 'grocery'] },
  { noc: '62010', en: 'Retail sales supervisor', fa: 'سرپرست فروش', aliases: ['retail supervisor', 'store supervisor'], core: ['store', 'retail', 'grocery', 'pharmacy', 'gasoline', 'convenience'] },
  { noc: '65100', en: 'Cashier', fa: 'صندوق‌دار', aliases: ['صندوقدار'], core: ['grocery', 'convenience', 'gasoline', 'gas station', 'store', 'pharmacy', 'supermarket'] },
  { noc: '64410', en: 'Security guard', fa: 'نگهبان', aliases: ['security', 'نگهبانی', 'حراست'], core: ['security'] },
  { noc: '13110', en: 'Administrative assistant', fa: 'دستیار اداری', aliases: ['admin assistant', 'office administrator', 'منشی'], core: [] },
  { noc: '12200', en: 'Accounting technician / bookkeeper', fa: 'حسابدار', aliases: ['bookkeeper', 'accounting', 'حسابداری', 'دفتردار'], core: ['accounting', 'bookkeeping', 'tax'] },
  { noc: '21231', en: 'Software engineer / developer', fa: 'مهندس نرم‌افزار', aliases: ['developer', 'programmer', 'software', 'برنامه‌نویس', 'برنامه نویس'], core: ['software', 'it services', 'information technology', 'technology', 'web'] },
  { noc: '21222', en: 'Information systems specialist', fa: 'کارشناس فناوری اطلاعات', aliases: ['it', 'it support', 'network', 'شبکه', 'آی‌تی'], core: ['it services', 'information technology', 'computer', 'technology'] },
  { noc: '21300', en: 'Civil engineer', fa: 'مهندس عمران', aliases: ['civil engineering', 'عمران'], core: ['engineering', 'civil'] },
  { noc: '21301', en: 'Mechanical engineer', fa: 'مهندس مکانیک', aliases: ['mechanical engineering'], core: ['engineering', 'manufacturing'] },
  { noc: '94100', en: 'Machine operator, mineral and metal processing', fa: 'اپراتور ماشین تولید', aliases: ['machine operator', 'production worker', 'کارگر تولید'], core: ['manufacturing', 'processing', 'plant', 'mill'] },
  { noc: '95100', en: 'Labourer in processing / manufacturing', fa: 'کارگر کارخانه', aliases: ['factory worker', 'production labourer', 'کارگر'], core: ['manufacturing', 'processing', 'plant', 'packing', 'meat'] },
  { noc: '75201', en: 'Delivery driver', fa: 'راننده‌ی تحویل کالا', aliases: ['delivery', 'courier', 'پیک'], core: ['delivery', 'courier', 'distribution', 'wholesale', 'pizza'] },
  { noc: '74205', en: 'Public works equipment operator', fa: 'اپراتور ماشین‌آلات خدمات شهری', aliases: ['public works'], core: ['municipal', 'public works', 'government'] },
  { noc: '84120', en: 'Livestock worker / farm machinery operator', fa: 'کارگر دامداری', aliases: ['farm worker', 'dairy', 'کشاورزی', 'دامداری'], core: ['farm', 'dairy', 'ranch', 'livestock', 'agricultur'] },
  { noc: '63210', en: 'Hairstylist', fa: 'آرایشگر', aliases: ['barber', 'hairdresser', 'آرایشگری'], core: ['salon', 'barber', 'beauty', 'spa'] },
];

const byNoc = new Map(OCCUPATIONS.map((o) => [o.noc, o]));
export const occupationByNoc = (noc: string) => byNoc.get(noc) ?? null;

/** TEER is the second digit of a five-digit NOC 2021 code. */
export function teerOf(noc: string): number | null {
  return /^\d{5}$/.test(noc) ? Number(noc[1]) : null;
}

/** IRCC RCIP minimum language level for the TEER of the offered job. */
export function clbFor(teer: number | null): number | null {
  if (teer === null) return null;
  if (teer <= 1) return 6;
  if (teer <= 3) return 5;
  return 4;
}

const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[‌‏‎]/g, '')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\s+/g, ' ')
    .trim();

export type OccupationHit = { noc: string; en: string; fa: string; curated: boolean };

/**
 * Occupations matching what a visitor typed: curated ones first (either
 * language, aliases, or the code), then any NOC in the Job Bank file whose
 * English name or code contains the query. At most `limit`.
 */
export function searchOccupations(query: string, allNocs: Record<string, string>, limit = 8): OccupationHit[] {
  const q = fold(query);
  if (q.length < 2) return [];
  const out: OccupationHit[] = [];
  const seen = new Set<string>();
  for (const o of OCCUPATIONS) {
    const hay = [o.noc, o.en, o.fa, ...o.aliases].map(fold);
    if (hay.some((h) => h.includes(q) || (q.length >= 3 && q.includes(h) && h.length >= 3))) {
      out.push({ noc: o.noc, en: o.en, fa: o.fa, curated: true });
      seen.add(o.noc);
    }
  }
  for (const [noc, name] of Object.entries(allNocs)) {
    if (out.length >= limit * 2) break;
    if (seen.has(noc)) continue;
    if (noc.startsWith(q) || fold(name).includes(q)) {
      out.push({ noc, en: name, fa: name, curated: false });
      seen.add(noc);
    }
  }
  return out.slice(0, limit);
}
