import React from 'react';
import { Calendar, Clock, Hash, BarChart3, Image, Edit3 } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Calendar,
      title: '7-Day AI Content Calendar',
      desc: 'Generates seven days of non-repetitive, high-value posts tailored to your unique audience, business goals, and brand tone.'
    },
    {
      icon: Clock,
      title: 'Automatic Scheduling',
      desc: 'Set posting dates and times or use recommended optimal windows. SocialPilot AI automatically executes posts via connected platforms.'
    },
    {
      icon: Hash,
      title: 'AI Captions & Hashtag Engine',
      desc: 'Smart hashtag generator outputs balanced mixtures of broad, niche, location, and industry tags to maximize organic discovery.'
    },
    {
      icon: Edit3,
      title: 'Post Editor with Live Preview',
      desc: 'See exactly how your Instagram or Facebook post looks before publishing. Tweak captions, headlines, CTAs, and images effortlessly.'
    },
    {
      icon: Image,
      title: 'Centralized Media Library',
      desc: 'Store, tag, and organize brand logos, product photos, and licensed media assets in your isolated Supabase storage bucket.'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Performance Overview',
      desc: 'Track published post count, engagement rates, reach, and audience metrics with clear visual charts and zero fake data.'
    }
  ];

  return (
    <section id="features" className="py-20 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Built For Small Businesses</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything You Need for Social Consistency
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Engineered with a production SaaS architecture to give you full control over your social media presence without complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl p-7 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
