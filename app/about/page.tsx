import Hero from '@/components/Hero';
import ServiceCard from '@/components/ServiceCard';
import CTA from '@/components/CTA';

export default function AboutPage() {
  const values = [
    {
      title: 'صداقت',
      description: 'ما همیشه صادقانه و شفاف با شما صحبت می‌کنیم',
      icon: '🤝'
    },
    {
      title: 'تخصص',
      description: 'تیم ما از متخصصان باتجربه در حوزه مهاجرت تشکیل شده',
      icon: '🎓'
    },
    {
      title: 'پشتیبانی',
      description: 'در تمام مراحل، در کنار شما هستیم',
      icon: '💪'
    },
    {
      title: 'موفقیت',
      description: 'هدف ما، موفقیت و رضایت شماست',
      icon: '🎯'
    }
  ];

  return (
    <>
      <Hero
        title="درباره ما"
        subtitle="Startup Visa Roads - همراه شما در مسیر موفقیت"
      />

      {/* About Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed space-y-6">
            <p className="text-xl">
              ما یک تیم متخصص در زمینه مشاوره مهاجرت و ویزای استارتاپ هستیم که با هدف کمک به کارآفرینان ایرانی برای دستیابی به اهدافشان تشکیل شده‌ایم.
            </p>
            
            <p>
              با سال‌ها تجربه در زمینه مهاجرت و کسب‌وکار بین‌المللی، ما می‌دانیم که مسیر دریافت ویزای استارتاپ چقدر می‌تواند پیچیده باشد. 
              به همین دلیل، ما اینجا هستیم تا این مسیر را برای شما هموار کنیم.
            </p>

            <p>
              تیم ما شامل مشاوران مهاجرت، متخصصان بیزینس پلن، وکلای مهاجرت و منتورهای باتجربه است که همگی به یک هدف متعهد هستند: 
              موفقیت شما در دریافت ویزا و راه‌اندازی کسب‌وکار در کشور مقصد.
            </p>

            <p>
              ما نه تنها به شما کمک می‌کنیم تا ویزا دریافت کنید، بلکه در مسیر موفقیت استارتاپ شما نیز همراهتان هستیم. 
              از تهیه بیزینس پلن گرفته تا پیدا کردن سرمایه‌گذار و شروع کسب‌وکار، در هر مرحله در کنار شما خواهیم بود.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">ارزش‌های ما</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <ServiceCard key={index} {...value} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">مشتری راضی</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">نرخ موفقیت</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-blue-600 mb-2">10+</div>
              <div className="text-gray-600">سال تجربه</div>
            </div>
          </div>
        </div>
      </section>

      <CTA
        title="با ما همراه شوید"
        description="اجازه دهید بخشی از داستان موفقیت شما باشیم"
        buttonText="تماس با ما"
        buttonLink="/contact"
      />
    </>
  );
}
