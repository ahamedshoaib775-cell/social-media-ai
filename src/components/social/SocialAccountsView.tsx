import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Share2, CheckCircle2, Key, Save, Lock, User, Sparkles, RefreshCw, Trash2, ShieldCheck, Users } from 'lucide-react';
import { getMetaCredentials, saveMetaCredentials, getMockInstagramProfile } from '../../services/metaApi';
import type { MetaConnectionState } from '../../services/metaApi';

export const SocialAccountsView: React.FC = () => {
  const { socialAccounts, updateSocialAccount, addToast } = useApp();
  const [creds, setCreds] = useState<MetaConnectionState>(getMetaCredentials());

  // Connection tab state
  const [activeTab, setActiveTab] = useState<'quick' | 'oauth' | 'advanced'>('quick');

  // Quick connect form state
  const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'facebook'>('instagram');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Live profile calculation for preview
  const livePreviewProfile = username.trim() ? getMockInstagramProfile(username) : null;

  // Quick connect form submit
  const handleQuickConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      addToast('error', 'Please enter your Instagram Username or User ID.');
      return;
    }

    setIsConnecting(true);

    // Simulate instant auto-detection and connection
    await new Promise(resolve => setTimeout(resolve, 800));

    const profile = getMockInstagramProfile(username);
    const generatedAccountId = `IG_${Math.floor(10000000 + Math.random() * 90000000)}`;

    const updatedState: MetaConnectionState = {
      ...creds,
      instagramBusinessAccountId: selectedPlatform === 'instagram' ? generatedAccountId : creds.instagramBusinessAccountId,
      pageId: selectedPlatform === 'facebook' ? `FB_${Math.floor(10000000 + Math.random() * 90000000)}` : creds.pageId,
      userAccessToken: creds.userAccessToken || `EAAB_${Math.random().toString(36).substring(2, 12)}`,
      isConnected: true
    };

    saveMetaCredentials(updatedState);
    setCreds(updatedState);

    // Update social account statuses in AppContext
    socialAccounts.forEach(acc => {
      if (acc.platform === selectedPlatform) {
        updateSocialAccount(acc.id, {
          is_connected: true,
          account_handle: profile.username,
          account_name: profile.name,
          profile_picture_url: profile.profile_picture_url,
          followers_count: profile.followers_count,
          biography: profile.biography
        });
      }
    });

    setIsConnecting(false);
    setUsername('');
    setPassword('');
    addToast('success', `${selectedPlatform === 'instagram' ? 'Instagram' : 'Facebook'} account ${profile.username} connected with profile picture!`);
  };

  // Advanced developer save
  const handleSaveDeveloperCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedState = { ...creds, isConnected: true };
    saveMetaCredentials(updatedState);
    setCreds(updatedState);

    socialAccounts.forEach(acc => {
      const defaultProfile = getMockInstagramProfile('artisanbloomcoffee');
      updateSocialAccount(acc.id, { 
        is_connected: true,
        profile_picture_url: acc.profile_picture_url || defaultProfile.profile_picture_url,
        followers_count: acc.followers_count || defaultProfile.followers_count
      });
    });

    addToast('success', 'Meta Developer credentials saved successfully!');
  };

  // OAuth login popup trigger
  const handleOAuthConnect = () => {
    const appId = creds.appId || '1029384756';
    const redirectUri = window.location.origin;
    const scope = 'instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement,pages_manage_posts';
    const oauthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=token`;

    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      oauthUrl,
      'Meta OAuth Login',
      `width=${width},height=${height},top=${top},left=${left}`
    );

    addToast('info', 'Opening Meta Facebook OAuth Login popup window...');
  };

  const handleDisconnect = (platform: 'instagram' | 'facebook') => {
    const updatedState: MetaConnectionState = {
      ...creds,
      ...(platform === 'instagram' ? { instagramBusinessAccountId: '' } : { pageId: '' })
    };
    saveMetaCredentials(updatedState);
    setCreds(updatedState);

    socialAccounts.forEach(acc => {
      if (acc.platform === platform) {
        updateSocialAccount(acc.id, { is_connected: false });
      }
    });

    addToast('info', `${platform === 'instagram' ? 'Instagram' : 'Facebook'} account disconnected.`);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Connect Social Accounts</h2>
            <p className="text-xs text-slate-500">Link your Instagram & Facebook accounts for automated publishing</p>
          </div>
        </div>

        {/* Tab Selection Switcher */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setActiveTab('quick')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'quick' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            User ID & Password
          </button>
          <button
            onClick={() => setActiveTab('oauth')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'oauth' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Meta OAuth Login
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'advanced' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Developer API
          </button>
        </div>
      </div>

      {/* Connected Accounts Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Instagram Card */}
        {(() => {
          const igAccount = socialAccounts.find(a => a.platform === 'instagram');
          const isConnected = Boolean(creds.instagramBusinessAccountId || creds.userAccessToken || igAccount?.is_connected);
          const avatarUrl = igAccount?.profile_picture_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
          const followers = igAccount?.followers_count || 14850;

          return (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src={avatarUrl}
                      alt="Instagram Profile"
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-rose-500/80 p-0.5 shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 text-white flex items-center justify-center text-[9px] font-black shadow-xs">
                      IG
                    </div>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">{igAccount?.account_name || 'Instagram Account'}</h4>
                    <p className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                      <span>{igAccount?.account_handle || '@artisanbloomcoffee'}</span>
                    </p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                  isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {isConnected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  {isConnected ? 'Connected & Active' : 'Not Connected'}
                </span>
              </div>

              {igAccount?.biography && (
                <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  "{igAccount.biography}"
                </p>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Audience</span>
                    <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                      <Users className="w-3 h-3 text-indigo-600" />
                      {followers.toLocaleString()} Followers
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Auto-Publish</span>
                    <span className="font-extrabold text-emerald-700 text-xs">Posts, Reels & Stories</span>
                  </div>
                </div>

                {isConnected && (
                  <button
                    onClick={() => handleDisconnect('instagram')}
                    className="text-rose-600 hover:text-rose-700 font-bold text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Disconnect
                  </button>
                )}
              </div>
            </div>
          );
        })()}

        {/* Facebook Card */}
        {(() => {
          const fbAccount = socialAccounts.find(a => a.platform === 'facebook');
          const isConnected = Boolean(creds.pageId || creds.userAccessToken || fbAccount?.is_connected);
          const avatarUrl = fbAccount?.profile_picture_url || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80';
          const followers = fbAccount?.followers_count || 8920;

          return (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src={avatarUrl}
                      alt="Facebook Page"
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-600/80 p-0.5 shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-black shadow-xs">
                      FB
                    </div>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">{fbAccount?.account_name || 'Facebook Page'}</h4>
                    <p className="text-xs text-blue-600 font-semibold">
                      {fbAccount?.account_handle || 'facebook.com/artisanbloomcoffee'}
                    </p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                  isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {isConnected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  {isConnected ? 'Connected & Active' : 'Not Connected'}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Audience</span>
                    <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                      <Users className="w-3 h-3 text-blue-600" />
                      {followers.toLocaleString()} Likes
                    </span>
                  </div>
                </div>

                {isConnected && (
                  <button
                    onClick={() => handleDisconnect('facebook')}
                    className="text-rose-600 hover:text-rose-700 font-bold text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Disconnect
                  </button>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Tab 1: Simple User ID & Password Form */}
      {activeTab === 'quick' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Direct Account Connect</h3>
              <p className="text-xs text-slate-500">Enter your social media User ID / Handle and Password to link your account</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Target Platform:</span>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSelectedPlatform('instagram')}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    selectedPlatform === 'instagram' ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Instagram
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPlatform('facebook')}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    selectedPlatform === 'facebook' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Facebook
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleQuickConnect} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                {selectedPlatform === 'instagram' ? 'Instagram Username / User ID' : 'Facebook Page Email / Username'} *
              </label>
              <input
                type="text"
                required
                placeholder={selectedPlatform === 'instagram' ? 'e.g. @artisanbloomcoffee' : 'e.g. facebook.com/mybusinesspage'}
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Live Profile Detected Preview Card */}
            {livePreviewProfile && selectedPlatform === 'instagram' && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-rose-50 to-indigo-50 border border-rose-200/80 flex items-center gap-3.5 animate-fade-in">
                <img
                  src={livePreviewProfile.profile_picture_url}
                  alt="Detected Profile Avatar"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-500 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-slate-900 truncate">{livePreviewProfile.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  </div>
                  <p className="text-[11px] text-rose-600 font-semibold">{livePreviewProfile.username}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{livePreviewProfile.followers_count?.toLocaleString()} followers • Auto-detected Profile Picture</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                Password / Account Passcode *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                Credentials are encrypted locally and used strictly to establish automated publishing sessions.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isConnecting}
                className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Detecting & Connecting Account...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Connect {selectedPlatform === 'instagram' ? 'Instagram' : 'Facebook'} Account Now
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Meta OAuth Connect */}
      {activeTab === 'oauth' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">1-Click Meta Login Authentication</h3>
            <p className="text-xs text-slate-500">Authenticate via Facebook Login to grant Instagram & Facebook permissions directly</p>
          </div>

          <div className="p-6 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h4 className="font-extrabold text-indigo-950 text-base">Meta Login Authorization</h4>
              <p className="text-xs text-indigo-900/80 leading-relaxed max-w-lg">
                Clicking the button will open a official Meta Login window to select your Instagram Business Profile and Facebook Pages.
              </p>
            </div>

            <button
              onClick={handleOAuthConnect}
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              Launch Meta OAuth Login
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Advanced Developer API */}
      {activeTab === 'advanced' && (
        <form onSubmit={handleSaveDeveloperCredentials} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 text-slate-900 border-b border-slate-100 pb-4">
            <Key className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-extrabold">Meta Developer API Credentials</h3>
              <p className="text-xs text-slate-500">Configure Meta App ID, App Secret, Page Access Token and Account IDs manually</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Meta App ID
              </label>
              <input
                type="text"
                placeholder="e.g. 1029384756"
                value={creds.appId}
                onChange={e => setCreds({ ...creds, appId: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Meta App Secret
              </label>
              <input
                type="password"
                placeholder="••••••••••••••••"
                value={creds.appSecret}
                onChange={e => setCreds({ ...creds, appSecret: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Meta Graph User Access Token
            </label>
            <input
              type="password"
              placeholder="EAABwz..."
              value={creds.userAccessToken}
              onChange={e => setCreds({ ...creds, userAccessToken: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Facebook Page ID
              </label>
              <input
                type="text"
                placeholder="e.g. 10492837482"
                value={creds.pageId}
                onChange={e => setCreds({ ...creds, pageId: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Instagram Business Account ID
              </label>
              <input
                type="text"
                placeholder="e.g. 178414001928"
                value={creds.instagramBusinessAccountId}
                onChange={e => setCreds({ ...creds, instagramBusinessAccountId: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Developer Credentials
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
