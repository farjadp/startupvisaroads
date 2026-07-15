import React from 'react';
import { Clock, Video, ShieldCheck, Target, CreditCard, HeartHandshake, Receipt, Info, Mail, Phone, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Link } from '@/navigation';

export default function BookMeetingPage() {
   return (
      <div className="w-full bg-[#F2F0E9] text-[#1a1a1a] min-h-screen pt-32 pb-32 px-4 md:px-8 max-w-[1600px] mx-auto">
         
         {/* HEADER */}
         <div className="border-b border-[#1a1a1a] pb-12 mb-16">
            <h1 className="font-serif text-[8vw] leading-[0.8] tracking-tighter mb-8">
               BOOK A <br />
               <span className="italic text-[#1a1a1a]/40 ml-[8vw]">MEETING.</span>
            </h1>
            <div className="flex flex-wrap gap-4 font-sans text-sm font-bold uppercase tracking-widest">
               <span className="flex items-center gap-2 bg-[#CCFF00] px-4 py-2 rounded-full border border-[#1a1a1a]">
                  <Video size={16} /> Online Meeting
               </span>
               <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#1a1a1a]">
                  <Clock size={16} /> 60 Min Appointments
               </span>
               <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#1a1a1a]">
                  <Info size={16} /> Google Meet info added after booking
               </span>
            </div>
         </div>

         {/* MAIN CONTENT GRID */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
            
            {/* LEFT COLUMN: Rules & Information */}
            <div className="lg:col-span-6 xl:col-span-5 space-y-12 font-sans">
               
               {/* Welcome Note */}
               <section className="space-y-4">
                  <h2 className="font-serif text-4xl mb-6">Hello, my dear friend.</h2>
                  <p className="text-[#1a1a1a]/80 leading-relaxed text-lg">
                     Thank you for trusting us. We will do our best to provide the right answer to your needs. 
                     The information collected from you will be used strictly for your purposes and no one will disturb you.
                  </p>
                  <div className="bg-[#1a1a1a] text-white p-6 rounded-2xl flex gap-4 mt-6">
                     <ShieldCheck className="text-[#CCFF00] flex-shrink-0" size={28} />
                     <p className="text-sm leading-relaxed opacity-90">
                        We assure you that your privacy is your most valuable asset and a red line for us. 
                        Even many of our colleagues at <strong>Data Processors</strong> (the parent company) will not have access to this information.
                     </p>
                  </div>
               </section>

               {/* New Policy (August 2025) */}
               <section className="border border-[#1a1a1a]/20 p-8 rounded-3xl relative overflow-hidden bg-white">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#CCFF00]/20 blur-3xl -z-10 rounded-full"></div>
                  
                  <h3 className="font-bold text-xl mb-6 flex items-center gap-3">
                     <Target className="text-red-500" /> Commitment Policy (Aug 2025)
                  </h3>
                  <p className="text-[#1a1a1a]/80 mb-6 leading-relaxed">
                     To maintain quality and respect for everyone's time, we have stopped free consultations. 
                     Consultation sessions will only be held with real commitment. This decision is for both you to take a more serious step, and for us to fulfill our social responsibility.
                  </p>
                  
                  <ul className="space-y-4 mb-6">
                     <li className="flex items-center gap-3 font-medium bg-[#F2F0E9] p-3 rounded-xl">
                        <CreditCard size={20} className="text-[#1a1a1a]/60" />
                        Cost of each one-hour session: <span className="font-bold text-lg">140$</span>
                     </li>
                     <li className="flex items-center gap-3 font-medium bg-[#F2F0E9] p-3 rounded-xl">
                        <HeartHandshake size={20} className="text-[#1a1a1a]/60" />
                        Payment method: Directly deposited to a reputable charity (Iran or your country)
                     </li>
                     <li className="flex items-center gap-3 font-medium bg-[#F2F0E9] p-3 rounded-xl">
                        <Receipt size={20} className="text-[#1a1a1a]/60" />
                        Send the payment receipt to arrange the meeting time
                     </li>
                  </ul>
               </section>

               {/* Guidelines & Disclaimer */}
               <section className="space-y-6">
                  <h3 className="font-serif text-3xl">Important Reminders</h3>
                  
                  <div className="space-y-4 text-[#1a1a1a]/80">
                     <div className="flex gap-3">
                        <AlertTriangle className="flex-shrink-0 mt-1" size={18} />
                        <p><strong>Mentorship only:</strong> We are startup mentors. We have never claimed to be lawyers or immigration agencies.</p>
                     </div>
                     <div className="flex gap-3">
                        <Video className="flex-shrink-0 mt-1" size={18} />
                        <p><strong>Platform:</strong> All meetings are held on the Google Meet platform.</p>
                     </div>
                     <div className="flex gap-3">
                        <ShieldCheck className="flex-shrink-0 mt-1 text-red-600" size={18} />
                        <p><strong>Privacy & Recording:</strong> Meetings are recorded. Neither we nor you are allowed to publish these meetings. Publishing without permission will definitely result in legal action. The privacy of all participants is strictly respected.</p>
                     </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-[#1a1a1a]/20">
                     <h4 className="font-bold mb-4 flex items-center gap-2">
                        <CheckCircle2 className="text-[#CCFF00] bg-black rounded-full" size={20} /> 
                        Your checklist for a successful meeting
                     </h4>
                     <ul className="list-disc list-inside space-y-2 text-[#1a1a1a]/80 ml-2">
                        <li>Always check your email and ensure emails are from us.</li>
                        <li>The meeting link will be sent automatically by Google.</li>
                        <li>Be present exactly at the time you book.</li>
                        <li>Provide us with correct and accurate information.</li>
                     </ul>
                  </div>
               </section>

               {/* Contact Info */}
               <section className="bg-black text-[#F2F0E9] p-8 rounded-3xl">
                  <h3 className="font-serif text-2xl mb-6">Need assistance?</h3>
                  <div className="space-y-4">
                     <a href="mailto:its@farjadp.info" className="flex items-center gap-4 hover:text-[#CCFF00] transition-colors">
                        <Mail size={20} /> <span>its@farjadp.info</span>
                     </a>
                     <div className="flex items-center gap-4">
                        <Phone size={20} /> <span>+1 437 661 1674 (Farjad Pourmohammad)</span>
                     </div>
                     <a href="https://t.me/farjadtalks" target="_blank" rel="noreferrer" className="flex items-center gap-4 hover:text-[#CCFF00] transition-colors">
                        <MessageSquare size={20} /> <span>t.me/farjadtalks (Telegram)</span>
                     </a>
                     <a href="https://wa.me/14376611674" target="_blank" rel="noreferrer" className="flex items-center gap-4 hover:text-[#CCFF00] transition-colors text-[#CCFF00]">
                        <MessageSquare size={20} /> <span className="font-bold underline decoration-1 underline-offset-4">Chat with us on WhatsApp</span>
                     </a>
                  </div>
               </section>

            </div>

            {/* RIGHT COLUMN: Calendar iframe */}
            <div className="lg:col-span-6 xl:col-span-7">
               <div className="sticky top-24 w-full bg-white border border-[#1a1a1a] overflow-hidden rounded-3xl shadow-2xl shadow-black/5">
                  {/* Decorative header for calendar */}
                  <div className="bg-[#1a1a1a] text-white p-4 flex justify-between items-center">
                     <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#CCFF00]">Schedule your session</span>
                     <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-white/20"></div>
                        <div className="w-3 h-3 rounded-full bg-white/20"></div>
                        <div className="w-3 h-3 rounded-full bg-white/20"></div>
                     </div>
                  </div>
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

         </div>
      </div>
   );
}
