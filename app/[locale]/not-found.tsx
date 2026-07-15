import { useTranslations } from 'next-intl';
import { Link } from '@/routing';
import { Compass, MoveRight, Plane, Map } from 'lucide-react';
import React from 'react';
import '../globals.css';

export default function NotFoundPage() {
  const t = useTranslations('NotFound');

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black text-white selection:bg-white/30 font-sans antialiased">
        {/* Background visual elements */}
        <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 mask-image-radial" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Text Section */}
        <div className="flex-1 text-center md:text-start space-y-8 relative">
          <div className="inline-flex items-center justify-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-white/70 tracking-wider uppercase mb-2">
            <Plane className="w-4 h-4 mr-2" />
            <span>Error 404</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-serif tracking-tight font-light leading-none">
            {t('title')}
            <span className="block text-3xl md:text-5xl mt-2 text-white/50">{t('subtitle')}</span>
          </h1>

          <p className="text-lg text-white/60 max-w-md mx-auto md:mx-0 leading-relaxed">
            {t('description')}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center md:justify-start">
            <Link 
              href="/"
              className="group flex items-center gap-3 bg-white text-black px-6 py-4 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              {t('return_home')}
              <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/contact"
              className="px-6 py-4 rounded-full font-medium text-white border border-white/20 hover:bg-white/10 transition-all duration-300"
            >
              {t('contact_us')}
            </Link>
          </div>
        </div>

        {/* Visual Element Section */}
        <div className="flex-1 flex justify-center items-center relative">
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            {/* Pulsing rings */}
            <div className="absolute inset-0 rounded-full border border-white/10 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
            <div className="absolute inset-4 rounded-full border border-white/5 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_1s]" />
            
            {/* Central icon container */}
            <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 bg-black/50 border border-white/10 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl">
              <Compass className="w-16 h-16 md:w-20 md:h-20 text-white/80 animate-[spin_10s_linear_infinite]" strokeWidth={1} />
              
              {/* Center dot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            </div>

            {/* Orbiting elements */}
            <div className="absolute inset-0 animate-[spin_15s_linear_infinite]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-black border border-white/30 rounded-full flex items-center justify-center">
                <Map className="w-2 h-2 text-white/50" />
              </div>
            </div>
            
            <div className="absolute inset-0 animate-[spin_20s_linear_infinite_reverse]">
              <div className="absolute bottom-1/4 right-0 translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white/20 rounded-full blur-[1px]" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .mask-image-radial {
          -webkit-mask-image: radial-gradient(circle at center, black, transparent 80%);
          mask-image: radial-gradient(circle at center, black, transparent 80%);
        }
      `}} />
      </body>
    </html>
  );
}
