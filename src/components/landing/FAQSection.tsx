import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldAlert } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the 7-day AI Content Generator work?',
      a: 'When you complete onboarding or click "Generate 7-Day Plan", SocialPilot AI analyzes your business name, industry category, description, target audience, brand tone, and products. It generates 7 unique daily posts with captions, headlines, hashtags, CTAs, and recommended posting times.'
    },
    {
      q: 'Can I edit posts before they are published?',
      a: 'Absolutely. You have 100% control. Use our Post Editor to modify captions, hashtags, call-to-actions, dates, times, and media assets. No post is published automatically until you approve or schedule it.'
    },
    {
      q: 'How does Instagram and Facebook posting work?',
      a: 'SocialPilot AI integrates with Meta’s official Graph API. Once connected with appropriate Meta App credentials and page permissions, our background scheduler publishes scheduled posts directly to your Instagram Business Account or Facebook Page.'
    },
    {
      q: 'Are reach, engagement, or follower growth guaranteed?',
      a: 'No. SocialPilot AI provides high-quality content generation, AI organization, and automated scheduling tools. Social media algorithm performance and engagement rates depend on external platform dynamics, market demand, content resonance, and audience behavior.'
    },
    {
      q: 'Can I upload my own images and videos?',
      a: 'Yes! Our Media Library supports user-uploaded assets (stored securely in your Supabase Storage bucket), licensed stock photos, and AI-generated image prompts.'
    },
    {
      q: 'What happens if Meta API keys or credentials are not configured?',
      a: 'The application runs in a safe diagnostic mode. You can generate content, edit posts, manage your calendar, and test the scheduler engine locally while reviewing step-by-step Meta setup instructions.'
    }
  ];

  return (
    <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Got Questions?</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Clear answers about SocialPilot AI features, workflows, and platform compliance.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Responsible AI Disclaimer Banner */}
        <div className="mt-12 p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 flex items-start gap-3.5 text-xs sm:text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block text-amber-950 mb-0.5">Responsible AI & Platform Transparency Disclosure</strong>
            SocialPilot AI provides social media content generation, scheduling, and analytics workflow automation. We do not make claims of guaranteed growth, engagement rates, or follower count gains. Results vary based on brand strategy, market conditions, and platform algorithm changes.
          </div>
        </div>
      </div>
    </section>
  );
};
