'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('فرم با موفقیت ارسال شد! به زودی با شما تماس خواهیم گرفت.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Hero
        title="تماس با ما"
        subtitle="برای مشاوره رایگان و دریافت اطلاعات بیشتر با ما در تماس باشید"
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">فرم تماس</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    نام و نام خانوادگی *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    ایمیل *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    شماره تماس
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium mb-2">
                    کشور مورد نظر *
                  </label>
                  <select
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="canada">کانادا</option>
                    <option value="denmark">دانمارک</option>
                    <option value="netherlands">هلند</option>
                    <option value="finland">فنلاند</option>
                    <option value="usa">آمریکا</option>
                    <option value="uae">امارات</option>
                    <option value="other">سایر</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    پیام شما *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  ارسال درخواست
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <div className="bg-blue-50 p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold mb-6">اطلاعات تماس</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="text-2xl ml-4">📧</span>
                    <div>
                      <div className="font-semibold mb-1">ایمیل</div>
                      <div className="text-gray-600" dir="ltr">info@startupvisaroads.com</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-2xl ml-4">📱</span>
                    <div>
                      <div className="font-semibold mb-1">تلفن</div>
                      <div className="text-gray-600" dir="ltr">+1 (555) 123-4567</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-2xl ml-4">📍</span>
                    <div>
                      <div className="font-semibold mb-1">آدرس</div>
                      <div className="text-gray-600">تورنتو، کانادا</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-2xl ml-4">⏰</span>
                    <div>
                      <div className="font-semibold mb-1">ساعات کاری</div>
                      <div className="text-gray-600">
                        شنبه تا پنج‌شنبه: 9 صبح تا 6 عصر (به وقت تهران)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-xl font-bold mb-4">چرا با ما تماس بگیرید؟</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-600 ml-2">✓</span>
                    <span>مشاوره اولیه رایگان</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 ml-2">✓</span>
                    <span>پاسخگویی سریع (حداکثر 24 ساعت)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 ml-2">✓</span>
                    <span>مشاوران متخصص و باتجربه</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 ml-2">✓</span>
                    <span>محرمانگی کامل اطلاعات</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
