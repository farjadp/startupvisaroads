import Hero from '@/components/Hero';
import ServiceCard from '@/components/ServiceCard';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';

export default function NetherlandsPage() {
  const benefits = [
    {
      title: 'مرکز تجاری اروپا',
      description: 'موقعیت استراتژیک برای دسترسی به بازار اروپا',
      icon: '🏢'
    },
    {
      title: 'زبان انگلیسی',
      description: 'اکثریت مردم به انگلیسی صحبت می‌کنند',
      icon: '🗣️'
    },
    {
      title: 'اکوسیستم قوی',
      description: 'یکی از بهترین اکوسیستم‌های استارتاپی دنیا',
      icon: '🚀'
    },
    {
      title: 'مالیات رقابتی',
      description: 'سیستم مالیاتی مناسب برای کسب‌وکارهای نوپا',
      icon: '💼'
    }
  ];

  const faqs = [
    {
      question: 'شرایط ویزای استارتاپ هلند چیست؟',
      answer: 'باید از یک سازمان معتبر هلندی (facilitator) حمایت دریافت کنید و یک بیزینس پلن نوآورانه داشته باشید.'
    },
    {
      question: 'مدت اعتبار ویزا چقدر است؟',
      answer: 'ویزا برای یک سال صادر می‌شود و می‌تواند تمدید شود.'
    },
    {
      question: 'آیا می‌توان خانواده را همراه برد؟',
      answer: 'بله، همسر و فرزندان می‌توانند برای اقامت درخواست دهند.'
    }
  ];

  return (
    <>
      <Hero
        title="ویزای استارتاپ هلند 🇳🇱"
        subtitle="دروازه ورود به بازار اروپا از طریق کارآفرینی"
        ctaText="مشاوره رایگان"
        ctaLink="/contact"
      />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">چرا هلند؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <ServiceCard key={index} {...benefit} />
            ))}
          </div>
        </div>
      </section>

      <FAQ items={faqs} />

      <CTA
        title="به هلند بیایید"
        description="با ما تماس بگیرید و مسیر کارآفرینی در هلند را شروع کنید"
        buttonText="رزرو مشاوره"
        buttonLink="/contact"
      />
    </>
  );
}
