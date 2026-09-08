import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { BusinessProfile } from '../../types';
import { Sparkles, Building2, Palette, Share2, Upload, ArrowRight, ArrowLeft, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { uploadMediaFile } from '../../services/storage';

export const OnboardingWizard: React.FC = () => {
  const { business, completeOnboarding, addMediaAsset, addToast } = useApp();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [formData, setFormData] = useState<BusinessProfile>({
    id: business?.id || `biz_${Date.now()}`,
    user_id: business?.user_id || 'user_current',
    business_name: business?.business_name || '',
    business_category: business?.business_category || 'Restaurant & Cafe',
    business_description: business?.business_description || '',
    location: business?.location || '',
    target_audience: business?.target_audience || '',
    products_services: business?.products_services || '',
    brand_tone: business?.brand_tone || 'Casual & Friendly',
    brand_colors: business?.brand_colors || ['#2563eb', '#4f46e5', '#0f172a'],
    website_url: business?.website_url || '',
    instagram_username: business?.instagram_username || '',
    facebook_page: business?.facebook_page || '',
    posting_frequency: business?.posting_frequency || 'Once daily',
    logo_url: business?.logo_url || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
    onboarding_completed: false
  });

  const [uploadedLogo, setUploadedLogo] = useState<string | null>(formData.logo_url || null);
  const [uploadedFilesCount, setUploadedFilesCount] = useState<number>(0);

  const categories = [
    'Restaurant & Cafe',
    'Ecommerce & Retail',
    'Beauty & Salon',
    'Fitness & Wellness',
    'B2B SaaS & Tech',
    'Real Estate',
    'Local Services & Trades',
    'Consulting & Agency',
    'Creative & Arts'
  ];

  const brandTones = [
    'Casual & Friendly',
    'Professional & Corporate',
    'Energetic & Bold',
    'Luxury & Elegant',
    'Witty & Humorous',
    'Educational & Authoritative'
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'image') => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      const file = e.target.files[0];
      const asset = await uploadMediaFile(file, formData.id, type === 'logo' ? 'logo' : 'image');
      addMediaAsset(asset);
      if (type === 'logo') {
        setUploadedLogo(asset.public_url);
        setFormData(prev => ({ ...prev, logo_url: asset.public_url }));
      }
      setUploadedFilesCount(prev => prev + 1);
      addToast('success', `${file.name} uploaded successfully!`);
    } catch (err) {
      addToast('error', 'Upload failed. Check storage configuration.');
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    completeOnboarding(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans text-slate-900">
      <div className="max-w-2xl w-full bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden animate-fade-in">
        {/* Wizard Header Progress Bar */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 relative">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight">SocialPilot AI Onboarding</span>
            </div>
            <span className="text-xs font-semibold text-slate-400">Step {step} of 4</span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleFinish} className="p-6 sm:p-8">
          {/* Step 1: Basic Business Profile */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-3 text-indigo-600 mb-2">
                <Building2 className="w-6 h-6" />
                <h3 className="text-xl font-extrabold text-slate-900">Business Details</h3>
              </div>
              <p className="text-xs text-slate-500">
                Enter your business details once. SocialPilot AI uses this to craft authentic 7-day social plans.
              </p>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artisan Bloom Coffee"
                  value={formData.business_name}
                  onChange={e => setFormData({ ...formData, business_name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Category / Industry *
                  </label>
                  <select
                    value={formData.business_category}
                    onChange={e => setFormData({ ...formData, business_category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  >
                    {categories.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Location / City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Austin, TX"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Business Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe what your business does, your story, and what makes you unique..."
                  value={formData.business_description}
                  onChange={e => setFormData({ ...formData, business_description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={formData.website_url}
                  onChange={e => setFormData({ ...formData, website_url: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Step 2: Brand Voice & Audience */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-3 text-indigo-600 mb-2">
                <Palette className="w-6 h-6" />
                <h3 className="text-xl font-extrabold text-slate-900">Brand Identity & Audience</h3>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  placeholder="e.g. Local coffee lovers, remote workers, students"
                  value={formData.target_audience}
                  onChange={e => setFormData({ ...formData, target_audience: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Key Products or Services
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cold brew, Espresso, Sourdough croissants"
                  value={formData.products_services}
                  onChange={e => setFormData({ ...formData, products_services: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Brand Tone of Voice
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {brandTones.map((tone, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, brand_tone: tone })}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                        formData.brand_tone === tone
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Social Handles & Frequency */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-3 text-indigo-600 mb-2">
                <Share2 className="w-6 h-6" />
                <h3 className="text-xl font-extrabold text-slate-900">Social Accounts & Frequency</h3>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Instagram Username
                </label>
                <input
                  type="text"
                  placeholder="@yourbusiness"
                  value={formData.instagram_username}
                  onChange={e => setFormData({ ...formData, instagram_username: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Facebook Page Name
                </label>
                <input
                  type="text"
                  placeholder="Your Business Facebook Page"
                  value={formData.facebook_page}
                  onChange={e => setFormData({ ...formData, facebook_page: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Preferred Posting Frequency
                </label>
                <select
                  value={formData.posting_frequency}
                  onChange={e => setFormData({ ...formData, posting_frequency: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="Once daily">Once daily (7 posts / week)</option>
                  <option value="2-3 times daily">2-3 times daily (High frequency)</option>
                  <option value="3-4 times weekly">3-4 times weekly (Mon/Wed/Fri/Sun)</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Asset Upload & Confirmation */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-3 text-indigo-600 mb-2">
                <Upload className="w-6 h-6" />
                <h3 className="text-xl font-extrabold text-slate-900">Brand Assets & Media</h3>
              </div>
              <p className="text-xs text-slate-500">
                Upload your logo and product images to attach to generated social posts. (Stored in Supabase Storage)
              </p>

              {/* Logo Upload Box */}
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50 hover:bg-slate-100/60 transition-colors relative">
                <div className="flex flex-col items-center justify-center gap-2">
                  {uploadedLogo ? (
                    <img src={uploadedLogo} alt="Uploaded logo" className="w-16 h-16 rounded-xl object-cover shadow-sm mb-1" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <span className="text-xs font-bold text-slate-700">
                    {uploadedLogo ? 'Change Logo Image' : 'Upload Business Logo'}
                  </span>
                  <span className="text-[11px] text-slate-400">PNG, JPG, SVG up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileUpload(e, 'logo')}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Product/Business Photos Box */}
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50 hover:bg-slate-100/60 transition-colors relative">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Upload Product or Workspace Photos</span>
                  <span className="text-[11px] text-slate-400">Add images to Media Library ({uploadedFilesCount} uploaded so far)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileUpload(e, 'image')}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !formData.business_name) {
                    addToast('error', 'Please enter your Business Name');
                    return;
                  }
                  setStep((step + 1) as any);
                }}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                Complete Onboarding & Generate Plan
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
