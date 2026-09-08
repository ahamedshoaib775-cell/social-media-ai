import React from 'react';
import { UserCheck, Sparkles, CalendarCheck } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: UserCheck,
      title: 'Enter Business Information Once',
      desc: 'Tell SocialPilot AI about your business name, category, target audience, brand tone, and website. We store your brand DNA securely.'
    },
    {
      num: '02',
      icon: Sparkles,
      title: 'Generate 7-Day AI Content Plan',
      desc: 'With one click, receive 7 distinct daily social media posts—complete with headlines, tailored captions, hashtags, CTAs, and recommended posting times.'
    },
    {
      num: '03',
      icon: CalendarCheck,
      title: 'Review, Edit & Auto-Schedule',
      desc: 'Fine-tune posts in our live social editor, attach media, and approve. SocialPilot AI automatically handles scheduling and publishing.'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Simple Workflow</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How SocialPilot AI Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            No more staring at a blank screen wondering what to post. SocialPilot AI streamlines your entire weekly workflow in 3 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-8 relative hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-300 font-mono">{step.num}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
