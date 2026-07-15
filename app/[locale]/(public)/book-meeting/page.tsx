// ============================================================================
// Page: app/[locale]/(public)/book-meeting/page.tsx
// ============================================================================

import React from 'react';

export default function BookMeetingPage() {
   return (
      <div className="w-full bg-[#F2F0E9] text-[#1a1a1a] min-h-screen pt-32 pb-32 px-4 md:px-8 max-w-[1600px] mx-auto">
         {/* HEADER */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 border-b border-[#1a1a1a] pb-12">
            <div className="lg:col-span-8">
               <h1 className="font-serif text-[8vw] leading-[0.8] tracking-tighter mb-8">
                  BOOK A <br />
                  <span className="italic text-[#1a1a1a]/40 ml-[8vw]">MEETING.</span>
               </h1>
            </div>
            <div className="lg:col-span-4 flex flex-col justify-end items-start lg:items-end text-left lg:text-right">
               <p className="font-sans text-sm md:text-base max-w-xs leading-relaxed mb-8">
                  Select a time that works for you to discuss your startup, visa pathway, or strategic roadmap.
               </p>
            </div>
         </div>

         {/* IFRAME CONTAINER */}
         <div className="w-full bg-white border border-[#1a1a1a] overflow-hidden rounded-xl">
            <iframe 
                src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0c9kl9WXgD2feLxqByk8S1fPcngsfXdvOISc-dWrbhXnhNx7uVuM1RyLJfWKkT2l5XX7I3wNLf?gv=true" 
                style={{ border: 0 }} 
                width="100%" 
                height="800" 
                frameBorder="0"
                className="w-full bg-white"
            ></iframe>
         </div>
      </div>
   );
}
