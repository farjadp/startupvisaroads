import Hero from '@/components/Hero';
import MentorCard from '@/components/MentorCard';
import ServiceCard from '@/components/ServiceCard';
import CTA from '@/components/CTA';

export default function MentorshipPage() {
  const mentors = [
    {
      name: 'علی احمدی',
      title: 'مشاور ارشد مهاجرت',
      expertise: 'ویزای کانادا و اروپا',
      bio: 'با بیش از 10 سال تجربه در زمینه مشاوره مهاجرت و کمک به صدها کارآفرین برای دریافت ویزا'
    },
    {
      name: 'سارا محمدی',
      title: 'متخصص بیزینس پلن',
      expertise: 'طراحی و نگارش بیزینس پلن',
      bio: 'کارشناس ارشد MBA با تجربه تهیه بیزینس پلن‌های برنده برای استارتاپ‌های مختلف'
    },
    {
      name: 'رضا کریمی',
      title: 'مشاور استارتاپ',
      expertise: 'توسعه محصول و استراتژی',
      bio: 'بنیان‌گذار چند استارتاپ موفق با تجربه مشاوره در حوزه‌های مختلف فناوری'
    },
    {
      name: 'مریم رضایی',
      title: 'مشاور مالی',
      expertise: 'مدیریت مالی و سرمایه‌گذاری',
      bio: 'متخصص در زمینه مدیریت مالی استارتاپ‌ها و ارتباط با سرمایه‌گذاران'
    }
  ];

  const services = [
    {
      title: 'مشاوره یک‌به‌یک',
      description: 'جلسات اختصاصی با منتور برای رفع مشکلات خاص شما',
      icon: '👥'
    },
    {
      title: 'بررسی بیزینس پلن',
      description: 'بررسی و بازخورد تخصصی روی بیزینس پلن شما',
      icon: '📊'
    },
    {
      title: 'شبکه‌سازی',
      description: 'معرفی به شبکه وسیع سرمایه‌گذاران و کارآفرینان',
      icon: '🤝'
    },
    {
      title: 'آموزش و ورکشاپ',
      description: 'دوره‌های آموزشی و ورکشاپ‌های تخصصی',
      icon: '📚'
    }
  ];

  return (
    <>
      <Hero
        title="منتورشیپ و مشاوره"
        subtitle="با راهنمایی منتورهای باتجربه، مسیر موفقیت را هموارتر کنید"
      />

      {/* Mentors */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">منتورهای ما</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {mentors.map((mentor, index) => (
              <MentorCard key={index} {...mentor} />
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">خدمات منتورشیپ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      <CTA
        title="نیاز به راهنمایی دارید؟"
        description="با منتورهای ما تماس بگیرید و از تجربه آن‌ها بهره‌مند شوید"
        buttonText="رزرو جلسه منتورشیپ"
        buttonLink="/contact"
      />
    </>
  );
}
