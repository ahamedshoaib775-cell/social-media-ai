import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Image as ImageIcon, Upload, Trash2, Search } from 'lucide-react';
import { uploadMediaFile } from '../../services/storage';

export const MediaLibraryView: React.FC = () => {
  const { mediaAssets, business, addMediaAsset, deleteMediaAsset, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'user_uploaded' | 'licensed_stock' | 'ai_generated'>('all');
  const [uploading, setUploading] = useState(false);

  const filteredAssets = mediaAssets.filter(asset => {
    const matchesTab = activeTab === 'all' || asset.source === activeTab;
    const matchesSearch = asset.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !business) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const newAsset = await uploadMediaFile(file, business.id, 'image');
      addMediaAsset(newAsset);
      addToast('success', `Uploaded ${file.name} to Media Library`);
    } catch (err) {
      addToast('error', 'Upload failed. Check storage credentials.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Media Library</h2>
            <p className="text-xs text-slate-500">Store and manage licensed stock, brand photos, and logos (Supabase Storage)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Upload Button */}
          <label className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Uploading...' : 'Upload Media Asset'}</span>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex rounded-xl bg-slate-100 p-1 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Assets' },
            { id: 'user_uploaded', label: 'User Uploaded' },
            { id: 'licensed_stock', label: 'Licensed Stock' },
            { id: 'ai_generated', label: 'AI Generated' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search assets or tags..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Grid Display */}
      {filteredAssets.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAssets.map(asset => (
            <div
              key={asset.id}
              className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="aspect-square bg-slate-100 relative overflow-hidden">
                <img
                  src={asset.public_url}
                  alt={asset.file_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white font-mono text-[10px]">
                  {asset.source.replace('_', ' ')}
                </span>
                <button
                  onClick={() => deleteMediaAsset(asset.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-slate-600 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  title="Delete Asset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 space-y-1">
                <h4 className="text-xs font-bold text-slate-900 truncate">{asset.file_name}</h4>
                <div className="flex flex-wrap gap-1">
                  {(asset.tags || []).map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center text-slate-500">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No media assets found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Upload your brand logo, workspace photos, or product images to use them in your social media post calendar.
          </p>
        </div>
      )}
    </div>
  );
};
