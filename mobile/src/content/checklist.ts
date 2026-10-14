// What a founder can actually do to prepare, per route. Each item is a real
// step, not a reading task; reading is capped separately (engagement).
import type { RouteKey } from './routes';
import type { Text } from './text';

export type StepId =
  | 'passport'
  | 'language-test'
  | 'business-brief'
  | 'product-evidence'
  | 'funds-documented'
  | 'team-agreement'
  | 'pitch-deck'
  | 'deck-15'
  | 'bf-statement'
  | 'committee-application'
  | 'facilitator'
  | 'italy-link'
  | 'technopark'
  | 'eoi-draft'
  | 'ownership-third'
  | 'lawyer-entry-check'
  | 'niw-evidence';

export const STEPS: Record<StepId, Text> = {
  passport: { en: 'Passport valid for the whole process', fa: 'پاسپورت معتبر برای کل مسیر', fr: 'Passeport valide pour toute la procédure', zh: '护照在整个流程中有效', ar: 'جواز سفر صالح طوال الإجراءات' },
  'language-test': { en: 'Book a language test date', fa: 'نوبت آزمون زبان بگیرید', fr: 'Réserver une date de test de langue', zh: '预约语言考试日期', ar: 'احجز موعد اختبار اللغة' },
  'business-brief': { en: 'Write the one-page business brief', fa: 'خلاصه‌ی یک‌صفحه‌ای کسب‌وکار را بنویسید', fr: 'Rédiger le résumé d’une page', zh: '写出一页商业简介', ar: 'اكتب ملخص العمل في صفحة واحدة' },
  'product-evidence': { en: 'Collect product evidence (users, pilots, revenue)', fa: 'شواهد محصول را جمع کنید (کاربر، پایلوت، درآمد)', fr: 'Réunir les preuves produit (utilisateurs, pilotes, revenus)', zh: '收集产品证据（用户、试点、收入）', ar: 'اجمع أدلة المنتج (مستخدمون، تجارب، إيرادات)' },
  'funds-documented': { en: 'Document the funds you can show', fa: 'مدارک تمکن مالی را آماده کنید', fr: 'Documenter les fonds que vous pouvez justifier', zh: '准备可证明的资金文件', ar: 'وثّق الأموال التي يمكنك إثباتها' },
  'team-agreement': { en: 'Agree founder roles and ownership in writing', fa: 'نقش و سهم بنیان‌گذاران را مکتوب کنید', fr: 'Formaliser rôles et parts des fondateurs', zh: '书面确定创始人角色与股权', ar: 'وثّق أدوار المؤسسين وحصصهم كتابيًا' },
  'pitch-deck': { en: 'Draft the pitch deck', fa: 'پیش‌نویس پیچ‌دک را آماده کنید', fr: 'Rédiger le pitch deck', zh: '起草路演材料', ar: 'جهّز مسودة العرض التقديمي' },
  'deck-15': { en: 'Keep the deck to 15 pages — longer decks are screened out', fa: 'پیچ‌دک را زیر ۱۵ صفحه نگه دارید — بلندتر رد می‌شود', fr: 'Limiter le deck à 15 pages — au-delà, le dossier est écarté', zh: '路演材料不超过15页，超出会被筛除', ar: 'اجعل العرض 15 صفحة كحد أقصى، فالأطول يُستبعد' },
  'bf-statement': { en: 'Apply for the Business Finland eligibility statement', fa: 'برای گواهی Business Finland درخواست بدهید', fr: 'Demander l’avis d’éligibilité de Business Finland', zh: '申请 Business Finland 资格声明', ar: 'قدّم طلب شهادة الأهلية من Business Finland' },
  'committee-application': { en: 'Prepare the Startup Committee application', fa: 'درخواست کمیته‌ی استارتاپ را آماده کنید', fr: 'Préparer la demande au Startup Committee', zh: '准备创业委员会申请', ar: 'جهّز طلب لجنة الشركات الناشئة' },
  facilitator: { en: 'Shortlist RVO-approved facilitators', fa: 'فهرست فسیلیتیتورهای مورد تأیید RVO را تهیه کنید', fr: 'Présélectionner des facilitateurs agréés RVO', zh: '筛选 RVO 认可的孵化机构', ar: 'ضع قائمة بالميسّرين المعتمدين من RVO' },
  'italy-link': { en: 'Build a link with the Italian ecosystem (incubator, partner)', fa: 'پیوندی با اکوسیستم ایتالیا بسازید (شتاب‌دهنده، شریک)', fr: 'Créer un lien avec l’écosystème italien (incubateur, partenaire)', zh: '与意大利生态建立联系（孵化器、合作方）', ar: 'ابنِ صلة بالمنظومة الإيطالية (حاضنة، شريك)' },
  technopark: { en: 'Choose a technopark and read its committee rules', fa: 'یک تکنوپارک انتخاب کنید و قواعد کمیته‌اش را بخوانید', fr: 'Choisir un technopark et lire les règles de son comité', zh: '选定科技园并阅读其评审规则', ar: 'اختر حديقة تقنية واقرأ قواعد لجنتها' },
  'eoi-draft': { en: 'Draft the expression of interest', fa: 'پیش‌نویس EOI را آماده کنید', fr: 'Rédiger la déclaration d’intérêt', zh: '起草意向书（EOI）', ar: 'جهّز مسودة إبداء الاهتمام' },
  'ownership-third': { en: 'Plan for at least one-third ownership', fa: 'دست‌کم یک‌سوم مالکیت را برنامه‌ریزی کنید', fr: 'Prévoir au moins un tiers du capital', zh: '规划至少三分之一的股权', ar: 'خطّط لملكية الثلث على الأقل' },
  'lawyer-entry-check': { en: 'Check US entry restrictions for your nationality with a lawyer', fa: 'محدودیت ورود به آمریکا را برای تابعیتتان با وکیل بررسی کنید', fr: 'Vérifier avec un avocat les restrictions d’entrée aux États-Unis', zh: '请律师核实您国籍的美国入境限制', ar: 'تحقّق مع محامٍ من قيود الدخول إلى أمريكا لجنسيتك' },
  'niw-evidence': { en: 'Gather evidence of your work’s national importance', fa: 'شواهد اهمیت ملی کارتان را جمع کنید', fr: 'Réunir les preuves de l’importance nationale de vos travaux', zh: '收集您工作具有国家重要性的证据', ar: 'اجمع أدلة على الأهمية الوطنية لعملك' },
};

const BASE: StepId[] = ['passport', 'language-test', 'business-brief', 'funds-documented'];

export const CHECKLIST: Record<RouteKey, StepId[]> = {
  denmark: [...BASE, 'product-evidence', 'pitch-deck', 'deck-15'],
  finland: [...BASE, 'team-agreement', 'product-evidence', 'bf-statement'],
  estonia: [...BASE, 'product-evidence', 'committee-application'],
  netherlands: [...BASE, 'product-evidence', 'facilitator'],
  italy: [...BASE, 'team-agreement', 'italy-link', 'pitch-deck'],
  turkey: [...BASE, 'team-agreement', 'technopark'],
  'new-brunswick': [...BASE, 'eoi-draft'],
  'nova-scotia': [...BASE, 'ownership-third', 'eoi-draft'],
  eb2niw: ['passport', 'lawyer-entry-check', 'niw-evidence', 'business-brief'],
};
