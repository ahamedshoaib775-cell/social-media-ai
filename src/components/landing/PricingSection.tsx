import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';

interface PricingSectionProps {
  onOpenAuth: (tab: 'signup') => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenAuth }) => {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: 'Starter',
      desc: 'Ideal for solo founders and local businesses getting started.',
      priceMonthly: '$29',
      priceAnnual: '$19',
      popular: false,
      features: [
        '1 Business Profile',
        '7-Day AI Content Plan Generator',
        'Social Media Content Calendar',
        'AI Hashtag Generator',
        'Manual Post Scheduling',
        'Basic Media Library (100MB)'
      ]
    },
    {
      name: 'Professional',
      desc: 'Perfect for growing businesses that need automated publishing.',
      priceMonthly: '$59',
      priceAnnual: '$39',
      popular: true,
      features: [
        'Up to 3 Business Profiles',
        'Unlimited AI Content Plan Generations',
        'Automated Scheduling & Meta API Publishing',
        'Smart Posting Time Recommendations',
        'Post Editor with Live Social Preview',
        'Media Library (5GB Supabase Storage)',
        'Analytics Dashboard'
      ]
    },
    {
      name: 'Agency / Unlimited',
      desc: 'Built for agencies managing multiple client brands.',
      priceMonthly: '$149',
      priceAnnual: '$99',
      popular: false,
      features: [
        'Unlimited Business Profiles',
        'Multi-Account Meta API Connect',
        'Priority AI Generation Speed',
        'Custom Brand Tone Profiles',
        'Unlimited Supabase Media Storage',
        'Dedicated Support & API Exports'
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Transparent Pricing</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Simple Plans for Every Stage
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Start free, explore all features, and upgrade whenever you’re ready to automate.
          </p>

          {/* Billing Switcher */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                !annual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                annual ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Annual Billing
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-400 text-slate-900 font-extrabold">Save 30%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-8 border flex flex-col justify-between transition-all duration-300 ${
                plan.popular
                  ? 'bg-slate-900 text-white border-slate-800 shadow-2xl relative scale-105'
                  : 'bg-slate-50 text-slate-900 border-slate-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-500 text-white font-bold text-xs shadow-md flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className={`text-xs mt-1.5 leading-relaxed ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                  {plan.desc}
                </p>

                <div className="my-6">
                  <span className="text-4xl font-extrabold">{annual ? plan.priceAnnual : plan.priceMonthly}</span>
                  <span className={`text-xs font-medium ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}> / month</span>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs sm:text-sm">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        plan.popular ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                      }`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className={plan.popular ? 'text-slate-200' : 'text-slate-700'}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onOpenAuth('signup')}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  plan.popular
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                }`}
              >
                Start Free Trial
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
