import Hero from '@/components/Hero';
import ServiceCard from '@/components/ServiceCard';
import CountryCard from '@/components/CountryCard';
import CTA from '@/components/CTA';

export default function Home() {
  const services = [
    {
      title: 'مشاوره ویزای استارتاپ',
      description: 'راهنمایی کامل برای اخذ ویزای استارتاپ در کشورهای مختلف',
      icon: '📋',
      link: '/services'
    },
    {
      title: 'منتورشیپ کسب‌وکار',
      description: 'همراهی با منتورهای باتجربه برای رشد استارتاپ شما',
      icon: '🎯',
      link: '/mentorship'
    },
    {
      title: 'آماده‌سازی مدارک',
      description: 'کمک در تهیه و تنظیم مدارک مورد نیاز برای درخواست ویزا',
      icon: '📄',
      link: '/services'
    },
    {
      title: 'پیگیری درخواست',
      description: 'پیگیری مستمر روند درخواست ویزای شما تا دریافت نتیجه',
      icon: '⏱️',
      link: '/services'
    }
  ];

  const countries = [
    {
      name: 'کانادا',
      flag: '🇨🇦',
      description: 'برنامه ویزای استارتاپ کانادا یکی از بهترین مسیرهای مهاجرت برای کارآفرینان',
      link: '/startup-visa-canada',
      highlights: ['اقامت دائم', 'بدون نیاز به سرمایه شخصی', 'امکان همراهی خانواده']
    },
    {
      name: 'دانمارک',
      flag: '🇩🇰',
      description: 'برنامه استارتاپ دانمارک فرصتی عالی برای کارآفرینان نوآور',
      link: '/europe/denmark',
      highlights: ['محیط کسب‌وکار قوی', 'کیفیت زندگی بالا', 'دسترسی به بازار اروپا']
    },
    {
      name: 'هلند',
      flag: '🇳🇱',
      description: 'ویزای استارتاپ هلند با امکانات ویژه برای کارآفرینان بین‌المللی',
      link: '/europe/netherlands',
      highlights: ['اکوسیستم استارتاپی قوی', 'زبان انگلیسی', 'موقعیت استراتژیک']
    },
    {
      name: 'فنلاند',
      flag: '🇫🇮',
      description: 'برنامه ویزای استارتاپ فنلاند با تمرکز بر نوآوری و تکنولوژی',
      link: '/europe/finland',
      highlights: ['نوآوری بالا', 'سیستم آموزشی عالی', 'کیفیت زندگی']
    }
  ];

  return (
    <>
      <Hero
        title="مسیر موفقیت استارتاپ شما"
        subtitle="با ما ویزای استارتاپ خود را در بهترین کشورهای جهان دریافت کنید"
        ctaText="مشاوره رایگان"
        ctaLink="/contact"
      />

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">خدمات ما</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">مقاصد مهاجرتی</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {countries.map((country, index) => (
              <CountryCard key={index} {...country} />
            ))}
          </div>
        </div>
      </section>

      <CTA
        title="آماده شروع هستید؟"
        description="با ما تماس بگیرید و اولین قدم را برای مهاجرت موفق بردارید"
        buttonText="رزرو وقت مشاوره"
        buttonLink="/contact"
      />
    </>
  );
}
