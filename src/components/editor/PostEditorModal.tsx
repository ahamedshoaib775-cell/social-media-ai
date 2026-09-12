import React, { useState } from 'react';
import type { PostItem, ContentType } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Clock, Image as ImageIcon, Heart, MessageCircle, Send, Bookmark, Sparkles } from 'lucide-react';
import { getRecommendedPostingTime } from '../../services/postingTimeEngine';
import { generateHashtagsForBusiness } from '../../services/aiGenerator';

interface PostEditorModalProps {
  post: PostItem;
  onClose: () => void;
}

export const PostEditorModal: React.FC<PostEditorModalProps> = ({ post, onClose }) => {
  const { updatePost, business, mediaAssets, socialAccounts, addToast } = useApp();

  const [formData, setFormData] = useState<PostItem>({ ...post });
  const [previewPlatform, setPreviewPlatform] = useState<'instagram' | 'facebook'>('instagram');
  const [hashtagInput, setHashtagInput] = useState<string>((post.hashtags || []).join(' '));
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const contentTypes: ContentType[] = [
    'Educational',
    'Promotional',
    'Behind the scenes',
    'Customer story',
    'FAQ',
    'Industry insight',
    'Engagement',
    'Reel',
    'Carousel',
    'Single image'
  ];

  const handleSave = (status?: PostItem['status']) => {
    const parsedHashtags = hashtagInput
      .split(/\s+/)
      .map(h => h.trim())
      .filter(h => h.length > 0)
      .map(h => h.startsWith('#') ? h : `#${h}`);

    updatePost(post.id, {
      ...formData,
      hashtags: parsedHashtags,
      status: status || formData.status
    });
    onClose();
  };

  const handleApplyRecommendedTime = () => {
    if (!business) return;
    const rec = getRecommendedPostingTime(business.business_category, business.target_audience, 'Monday');
    setFormData(prev => ({
      ...prev,
      scheduled_time: rec.bestTime,
      suggested_posting_time: `${rec.bestTime} (${rec.windowLabel})`
    }));
    addToast('success', `Applied recommended posting time: ${rec.bestTime}`);
  };

  const handleRegenerateHashtags = () => {
    if (!business) return;
    const generated = generateHashtagsForBusiness(business, formData.headline || formData.caption);
    setHashtagInput(generated.all.join(' '));
    addToast('success', 'Generated fresh hashtags for this post!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Post Editor</h3>
            <p className="text-xs text-slate-500">Edit post details and view real-time social media preview</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Editor / Right Live Preview */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Left Form Editor */}
          <div className="lg:col-span-7 p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Content Type
                </label>
                <select
                  value={formData.content_type}
                  onChange={e => setFormData({ ...formData, content_type: e.target.value as ContentType })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {contentTypes.map((t, idx) => (
                    <option key={idx} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Media Asset
                </label>
                <button
                  type="button"
                  onClick={() => setShowMediaPicker(!showMediaPicker)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-between hover:bg-slate-100 transition-colors"
                >
                  <span className="truncate">{formData.media_url ? 'Media Selected' : 'Choose Media...'}</span>
                  <ImageIcon className="w-4 h-4 text-indigo-600" />
                </button>
              </div>
            </div>

            {/* Media Selector Dropdown Drawer */}
            {showMediaPicker && (
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 space-y-2 animate-fade-in">
                <span className="text-[11px] font-bold uppercase text-slate-600 block">Select from Media Library:</span>
                <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto">
                  {mediaAssets.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => {
                        setFormData({ ...formData, media_url: asset.public_url });
                        setShowMediaPicker(false);
                      }}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                        formData.media_url === asset.public_url ? 'border-indigo-600 scale-95' : 'border-transparent hover:opacity-80'
                      }`}
                    >
                      <img src={asset.public_url} alt="asset" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Headline / Concept
              </label>
              <input
                type="text"
                value={formData.headline}
                onChange={e => setFormData({ ...formData, headline: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Caption
                </label>
                <span className="text-[10px] text-slate-400 font-mono">{formData.caption.length} chars</span>
              </div>
              <textarea
                rows={5}
                value={formData.caption}
                onChange={e => setFormData({ ...formData, caption: e.target.value })}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
              />
            </div>

            {/* Hashtags section */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Hashtags
                </label>
                <button
                  type="button"
                  onClick={handleRegenerateHashtags}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  AI Refresh Hashtags
                </button>
              </div>
              <input
                type="text"
                value={hashtagInput}
                onChange={e => setHashtagInput(e.target.value)}
                placeholder="#smallbusiness #coffee #austin"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Call To Action (CTA)
              </label>
              <input
                type="text"
                value={formData.cta}
                onChange={e => setFormData({ ...formData, cta: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Scheduling Date & Time Selector */}
            <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Posting Schedule & AI Recommendation
                </span>
                <button
                  type="button"
                  onClick={handleApplyRecommendedTime}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[10px] hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  Apply Optimal Time
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={formData.scheduled_date}
                    onChange={e => setFormData({ ...formData, scheduled_date: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Scheduled Time</label>
                  <input
                    type="text"
                    placeholder="09:30 AM"
                    value={formData.scheduled_time}
                    onChange={e => setFormData({ ...formData, scheduled_time: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Social Media Preview Card */}
          <div className="lg:col-span-5 p-6 bg-slate-50/80 flex flex-col items-center justify-start">
            <div className="w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Live Post Preview</span>
                <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-bold">
                  <button
                    onClick={() => setPreviewPlatform('instagram')}
                    className={`px-3 py-1 rounded-md transition-colors ${previewPlatform === 'instagram' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
                  >
                    Instagram
                  </button>
                  <button
                    onClick={() => setPreviewPlatform('facebook')}
                    className={`px-3 py-1 rounded-md transition-colors ${previewPlatform === 'facebook' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
                  >
                    Facebook
                  </button>
                </div>
              </div>

              {/* Instagram Card Mock */}
              {previewPlatform === 'instagram' ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden text-slate-900 text-xs">
                  {/* Account Bar */}
                  <div className="p-3 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={socialAccounts.find(a => a.platform === 'instagram')?.profile_picture_url || business?.logo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                        alt="Instagram Connected Avatar"
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-500/80 p-0.5"
                      />
                      <div>
                        <span className="font-bold block leading-tight text-slate-900 font-mono text-[11px]">
                          {socialAccounts.find(a => a.platform === 'instagram')?.account_handle || business?.instagram_username || '@artisanbloomcoffee'}
                        </span>
                        <span className="text-[10px] text-slate-400">{business?.location || 'Austin, TX'}</span>
                      </div>
                    </div>
                    <span className="text-slate-400 font-bold">•••</span>
                  </div>

                  {/* Media Frame */}
                  <div className="aspect-square bg-slate-100 relative overflow-hidden">
                    <img
                      src={formData.media_url || 'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&w=800&q=80'}
                      alt="Post media"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Action Icons */}
                  <div className="p-3 pb-1 flex justify-between items-center text-slate-700">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 hover:text-rose-500 cursor-pointer" />
                      <MessageCircle className="w-5 h-5 hover:text-slate-900 cursor-pointer" />
                      <Send className="w-5 h-5 hover:text-slate-900 cursor-pointer" />
                    </div>
                    <Bookmark className="w-5 h-5 hover:text-slate-900 cursor-pointer" />
                  </div>

                  {/* Likes & Caption */}
                  <div className="px-3 pb-3 space-y-1">
                    <div className="font-bold text-[11px]">84 likes</div>
                    <p className="text-xs text-slate-800 leading-snug">
                      <span className="font-bold mr-1.5">{business?.instagram_username || 'yourbusiness'}</span>
                      {formData.headline && <span className="font-bold block mb-1">{formData.headline}</span>}
                      {formData.caption}
                    </p>
                    <p className="text-indigo-600 font-mono text-[11px] pt-1">{hashtagInput}</p>
                    {formData.cta && <p className="text-[11px] font-bold text-slate-900 pt-1">👉 {formData.cta}</p>}
                  </div>
                </div>
              ) : (
                /* Facebook Card Mock */
                <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden text-slate-900 text-xs p-4 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={business?.logo_url || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=100&q=80'}
                      alt="Avatar"
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <span className="font-bold block text-slate-900 text-sm">
                        {business?.facebook_page || business?.business_name || 'Business Page'}
                      </span>
                      <span className="text-[10px] text-slate-400">Scheduled • {formData.scheduled_date || 'Today'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed">
                    {formData.headline && <span className="font-bold block mb-1 text-sm">{formData.headline}</span>}
                    {formData.caption}
                    <br />
                    <span className="text-blue-600 font-mono text-[11px]">{hashtagInput}</span>
                  </p>

                  <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden">
                    <img
                      src={formData.media_url || 'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&w=800&q=80'}
                      alt="FB Media"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSave('Draft')}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave('Approved')}
              className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              Approve Post
            </button>
            <button
              type="button"
              onClick={() => handleSave('Scheduled')}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Schedule Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
