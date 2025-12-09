import Link from 'next/link';

export default function Header() {
  const navItems = [
    { href: '/', label: 'خانه' },
    { href: '/services', label: 'خدمات' },
    { href: '/startup-visa-canada', label: 'کانادا' },
    { href: '/europe/denmark', label: 'دانمارک' },
    { href: '/europe/netherlands', label: 'هلند' },
    { href: '/europe/finland', label: 'فنلاند' },
    { href: '/usa', label: 'آمریکا' },
    { href: '/uae', label: 'امارات' },
    { href: '/mentorship', label: 'منتورشیپ' },
    { href: '/about', label: 'درباره ما' },
    { href: '/blog', label: 'بلاگ' },
    { href: '/contact', label: 'تماس' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Startup Visa Roads
          </Link>
          
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/contact"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            رزرو وقت مشاوره
          </Link>
        </div>

        {/* Mobile Navigation */}
        <nav className="lg:hidden mt-4 flex flex-wrap gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-gray-700 hover:text-blue-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
