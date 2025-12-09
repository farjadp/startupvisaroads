import Hero from '@/components/Hero';
import ServiceCard from '@/components/ServiceCard';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';

export default function UAEPage() {
  const benefits = [
    {
      title: 'مالیات صفر',
      description: 'بدون مالیات بر درآمد شخصی',
      icon: '💵'
    },
    {
      title: 'موقعیت استراتژیک',
      description: 'پل ارتباطی بین آسیا، اروپا و آفریقا',
      icon: '🌍'
    },
    {
      title: 'زیرساخت عالی',
      description: 'زیرساخت‌های مدرن و پیشرفته',
      icon: '🏗️'
    },
    {
      title: 'کیفیت زندگی',
      description: 'استاندارد بالای زندگی و امنیت',
      icon: '⭐'
    }
  ];

  const faqs = [
    {
      question: 'شرایط اخذ ویزای کارآفرینی امارات چیست؟',
      answer: 'باید یک کسب‌وکار در یکی از مناطق آزاد تجاری یا داخل امارات راه‌اندازی کنید.'
    },
    {
      question: 'مدت اعتبار ویزا چقدر است؟',
      answer: 'معمولاً 2 تا 3 سال و قابل تمدید است. گلدن ویزای 10 ساله نیز برای کارآفرینان موفق موجود است.'
    },
    {
      question: 'آیا می‌توان خانواده را اسپانسر کرد؟',
      answer: 'بله، با داشتن کسب‌وکار و درآمد کافی می‌توانید برای خانواده اقامت بگیرید.'
    }
  ];

  return (
    <>
      <Hero
        title="ویزای کارآفرینی امارات 🇦🇪"
        subtitle="فرصتی برای کسب‌وکار در قلب خاورمیانه"
        ctaText="مشاوره رایگان"
        ctaLink="/contact"
      />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">چرا امارات؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <ServiceCard key={index} {...benefit} />
            ))}
          </div>
        </div>
      </section>

      <FAQ items={faqs} />

      <CTA
        title="به امارات بیایید"
        description="با ما تماس بگیرید و مسیر کارآفرینی در امارات را شروع کنید"
        buttonText="رزرو مشاوره"
        buttonLink="/contact"
      />
    </>
  );
}
