import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Save } from 'lucide-react';
import type { BusinessProfile } from '../../types';

export const BusinessProfileView: React.FC = () => {
  const { business, updateBusiness, addToast } = useApp();
  const [formData, setFormData] = useState<BusinessProfile>(business || {
    id: `biz_${Date.now()}`,
    user_id: 'user_current',
    business_name: '',
    business_category: 'Restaurant & Cafe',
    business_description: '',
    location: '',
    target_audience: '',
    products_services: '',
    brand_tone: 'Casual & Friendly',
    brand_colors: ['#2563eb', '#4f46e5'],
    posting_frequency: 'Once daily',
    onboarding_completed: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusiness(formData);
    addToast('success', 'Business profile updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Business Profile & Brand DNA</h2>
            <p className="text-xs text-slate-500">Update the core business information used by the 7-day AI Content Generator</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/90 rounded-2xl p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Business Name *
            </label>
            <input
              type="text"
              required
              value={formData.business_name}
              onChange={e => setFormData({ ...formData, business_name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Business Category / Industry *
            </label>
            <input
              type="text"
              required
              value={formData.business_category}
              onChange={e => setFormData({ ...formData, business_category: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Business Description
          </label>
          <textarea
            rows={3}
            value={formData.business_description}
            onChange={e => setFormData({ ...formData, business_description: e.target.value })}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Location / City
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Target Audience
            </label>
            <input
              type="text"
              value={formData.target_audience}
              onChange={e => setFormData({ ...formData, target_audience: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Products & Services Offered
            </label>
            <input
              type="text"
              value={formData.products_services}
              onChange={e => setFormData({ ...formData, products_services: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Brand Tone
            </label>
            <input
              type="text"
              value={formData.brand_tone}
              onChange={e => setFormData({ ...formData, brand_tone: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
};
