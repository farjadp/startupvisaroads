import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">تماس با ما</h3>
            <div className="space-y-2 text-gray-300">
              <p>ایمیل: info@startupvisaroads.com</p>
              <p>تلفن: +1 (555) 123-4567</p>
              <p>آدرس: تورنتو، کانادا</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">لینک‌های سریع</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white">
                  خدمات
                </Link>
              </li>
              <li>
                <Link href="/mentorship" className="text-gray-300 hover:text-white">
                  منتورشیپ
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xl font-bold mb-4">شبکه‌های اجتماعی</h3>
            <div className="space-y-2 text-gray-300">
              <p>لینکدین</p>
              <p>اینستاگرام</p>
              <p>توییتر</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <p className="text-sm text-gray-400 text-center leading-relaxed">
            <strong>سلب مسئولیت:</strong> اطلاعات ارائه شده در این وب‌سایت صرفاً جنبه اطلاع‌رسانی دارد و نباید به عنوان مشاوره حقوقی یا مهاجرتی رسمی تلقی شود. 
            لطفاً برای اطلاعات دقیق و به‌روز با مشاور رسمی مهاجرت مشورت کنید.
          </p>
          <p className="text-sm text-gray-500 text-center mt-4">
            © 2024 Startup Visa Roads. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
}
