import Hero from '@/components/Hero';
import ServiceCard from '@/components/ServiceCard';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';

export default function FinlandPage() {
  const benefits = [
    {
      title: 'نوآوری برتر',
      description: 'یکی از نوآورترین کشورهای جهان',
      icon: '🔬'
    },
    {
      title: 'آموزش عالی',
      description: 'سیستم آموزشی یکی از بهترین‌های دنیا',
      icon: '🎓'
    },
    {
      title: 'طبیعت زیبا',
      description: 'محیطی آرام و طبیعت بکر',
      icon: '🌲'
    },
    {
      title: 'امنیت بالا',
      description: 'یکی از امن‌ترین کشورهای جهان',
      icon: '🛡️'
    }
  ];

  const faqs = [
    {
      question: 'شرایط ویزای استارتاپ فنلاند چیست؟',
      answer: 'باید یک ایده کسب‌وکار نوآورانه با پتانسیل رشد بین‌المللی داشته باشید.'
    },
    {
      question: 'آیا نیاز به سرمایه اولیه هست؟',
      answer: 'بله، باید توانایی مالی کافی برای حداقل 6 ماه اقامت را نشان دهید.'
    },
    {
      question: 'زبان فنلاندی ضروری است؟',
      answer: 'نه، زبان انگلیسی کافی است، به خصوص در شهرهای بزرگ و محیط‌های کسب‌وکار.'
    }
  ];

  return (
    <>
      <Hero
        title="ویزای استارتاپ فنلاند 🇫🇮"
        subtitle="فرصتی برای کارآفرینی در سرزمین نوآوری و طبیعت"
        ctaText="مشاوره رایگان"
        ctaLink="/contact"
      />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">چرا فنلاند؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <ServiceCard key={index} {...benefit} />
            ))}
          </div>
        </div>
      </section>

      <FAQ items={faqs} />

      <CTA
        title="به فنلاند بیایید"
        description="با ما تماس بگیرید و مسیر کارآفرینی در فنلاند را شروع کنید"
        buttonText="رزرو مشاوره"
        buttonLink="/contact"
      />
    </>
  );
}
