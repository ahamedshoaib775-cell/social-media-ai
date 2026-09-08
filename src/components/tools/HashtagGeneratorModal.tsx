import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateHashtagsForBusiness } from '../../services/aiGenerator';
import type { HashtagSet } from '../../services/aiGenerator';
import { X, Hash, Copy, Check, Sparkles } from 'lucide-react';

interface HashtagGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HashtagGeneratorModal: React.FC<HashtagGeneratorModalProps> = ({ isOpen, onClose }) => {
  const { business, addToast } = useApp();
  const [topic, setTopic] = useState('');
  const [copied, setCopied] = useState(false);
  const [hashtagData, setHashtagData] = useState<HashtagSet>(() => 
    generateHashtagsForBusiness(business || {})
  );

  if (!isOpen) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const result = generateHashtagsForBusiness(business || {}, topic);
    setHashtagData(result);
    addToast('success', 'Generated fresh hashtags!');
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(hashtagData.all.join(' '));
    setCopied(true);
    addToast('success', 'Hashtags copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden relative">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-indigo-600">
            <Hash className="w-5 h-5" />
            <h3 className="text-lg font-extrabold text-slate-900">AI Hashtag Generator</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Post Topic or Focus Keyword
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Cold brew coffee, Artisan sourdough, Summer sale"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Generate
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">Broad Hashtags</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {hashtagData.broad.map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-mono font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">Niche & Targeted</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {hashtagData.niche.map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-mono font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">Location Specific</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {hashtagData.location.map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-mono font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">Industry & Trends</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {hashtagData.industry.map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg text-xs font-mono font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-400 font-mono">{hashtagData.all.length} relevant tags ready</span>
            <button
              type="button"
              onClick={handleCopyAll}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy All Hashtags'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
