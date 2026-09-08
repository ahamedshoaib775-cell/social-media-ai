import React from 'react';
import { Sparkles, ArrowRight, Clock, CheckCircle2, Wand2 } from 'lucide-react';

interface HeroSectionProps {
  onOpenAuth: (tab: 'signup') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAuth }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Background Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-purple-200/30 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs sm:text-sm font-semibold mb-8 animate-fade-in shadow-xs">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>AI-Powered Social Media Platform for Small Businesses</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Your AI Social Media <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Manager
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Create, schedule and automate your social media content without spending hours every day.
        </p>

        {/* CTA Group */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onOpenAuth('signup')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            Start Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2"
          >
            See How It Works
          </a>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs sm:text-sm text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            No credit card required
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Setup in 2 minutes
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Meta API Official Partner UI
          </div>
        </div>

        {/* Hero Interactive App Mockup Preview */}
        <div className="mt-16 relative max-w-5xl mx-auto">
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-2xl overflow-hidden p-2 sm:p-4 text-left">
            {/* Window header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-mono text-slate-400">app.socialpilot.ai / 7-day-plan</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-semibold text-indigo-700">
                <Wand2 className="w-3.5 h-3.5" />
                AI Generated Content Plan
              </div>
            </div>

            {/* 7-Day Plan Preview Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase text-indigo-700 tracking-wider">Day 1 • Mon</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">Educational</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">3 Insider Tips for Bakery Crafting</h4>
                <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                  Did you know sourdough fermentation enhances natural flavor? Here are 3 tips from our head baker...
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 09:30 AM</span>
                  <span className="text-emerald-700 font-semibold">Ready to Schedule</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white relative shadow-xs">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Day 2 • Tue</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Behind the Scenes</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Morning Coffee Roast Session</h4>
                <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                  A look behind the curtain! Every batch is hand-roasted in small Austin quantities...
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 12:15 PM</span>
                  <span className="text-indigo-600 font-semibold">Scheduled</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white relative shadow-xs hidden md:block">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Day 3 • Wed</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">Promotional</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Midweek Special Spotlight</h4>
                <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                  Pair your favorite cold brew with our housemade croissant today only...
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 05:30 PM</span>
                  <span className="text-slate-600 font-semibold">Draft</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
