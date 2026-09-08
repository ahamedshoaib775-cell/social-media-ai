import React, { createContext, useContext, useEffect, useState } from 'react';
import type { BusinessProfile, MediaAsset, PostItem, SchedulerLog, SocialAccount, UserProfile } from '../types';
import { generate7DayContentPlan } from '../services/aiGenerator';
import { isSupabaseConfigured, supabase } from '../services/supabase';
import { generateInitialPosts, initialSampleBusiness, sampleMediaAssets, sampleSocialAccounts } from '../utils/mockData';
import { schedulerInstance } from '../services/scheduler';

export type AppView = 
  | 'landing'
  | 'onboarding'
  | 'dashboard'
  | 'calendar'
  | 'generator'
  | 'media'
  | 'scheduled'
  | 'analytics'
  | 'profile'
  | 'social'
  | 'settings';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface AppContextType {
  // Auth
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  signup: (email: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  
  // Navigation
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // Business & Onboarding
  business: BusinessProfile | null;
  updateBusiness: (updated: Partial<BusinessProfile>) => void;
  completeOnboarding: (data: BusinessProfile) => void;

  // Posts & Calendar
  posts: PostItem[];
  setPosts: React.Dispatch<React.SetStateAction<PostItem[]>>;
  generateNew7DayPlan: (customTopic?: string) => void;
  updatePost: (id: string, updated: Partial<PostItem>) => void;
  deletePost: (id: string) => void;
  duplicatePost: (id: string) => void;
  approvePost: (id: string) => void;
  schedulePost: (id: string, dateStr?: string, timeStr?: string) => void;
  publishPostNow: (id: string) => Promise<void>;

  // Post Editor Modal
  editingPost: PostItem | null;
  setEditingPost: (post: PostItem | null) => void;

  // Media Assets
  mediaAssets: MediaAsset[];
  addMediaAsset: (asset: MediaAsset) => void;
  deleteMediaAsset: (id: string) => void;

  // Social Accounts
  socialAccounts: SocialAccount[];
  updateSocialAccount: (id: string, updated: Partial<SocialAccount>) => void;

  // Scheduler
  schedulerLogs: SchedulerLog[];
  isSchedulerActive: boolean;
  toggleScheduler: () => void;
  runSchedulerManual: () => Promise<void>;

  // Toast System
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User state
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('socialpilot_user');
    return saved ? JSON.parse(saved) : { id: 'usr_demo_1', email: 'owner@artisanbloom.com', full_name: 'Alex Morgan' };
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('socialpilot_authed') === 'true' || true);
  });

  // Current view
  const [currentView, setCurrentView] = useState<AppView>('landing');

  // Business state
  const [business, setBusiness] = useState<BusinessProfile | null>(() => {
    const saved = localStorage.getItem('socialpilot_business');
    return saved ? JSON.parse(saved) : initialSampleBusiness;
  });

  // Posts state
  const [posts, setPosts] = useState<PostItem[]>(() => {
    const saved = localStorage.getItem('socialpilot_posts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return generateInitialPosts(initialSampleBusiness);
  });

  // Editing post modal state
  const [editingPost, setEditingPost] = useState<PostItem | null>(null);

  // Media assets
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(() => {
    const saved = localStorage.getItem('socialpilot_media');
    return saved ? JSON.parse(saved) : sampleMediaAssets;
  });

  // Social accounts
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>(() => {
    const saved = localStorage.getItem('socialpilot_social');
    return saved ? JSON.parse(saved) : sampleSocialAccounts;
  });

  // Scheduler logs & status
  const [schedulerLogs, setSchedulerLogs] = useState<SchedulerLog[]>([]);
  const [isSchedulerActive, setIsSchedulerActive] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    if (business) localStorage.setItem('socialpilot_business', JSON.stringify(business));
  }, [business]);

  useEffect(() => {
    localStorage.setItem('socialpilot_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('socialpilot_media', JSON.stringify(mediaAssets));
  }, [mediaAssets]);

  useEffect(() => {
    localStorage.setItem('socialpilot_social', JSON.stringify(socialAccounts));
  }, [socialAccounts]);

  // Setup Scheduler Callbacks
  useEffect(() => {
    schedulerInstance.setCallbacks(
      (logs) => setSchedulerLogs(logs),
      (postId, newStatus, err) => {
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              status: newStatus,
              published_at: newStatus === 'Published' ? new Date().toISOString() : p.published_at,
              failure_reason: err
            };
          }
          return p;
        }));
      }
    );
    setSchedulerLogs(schedulerInstance.getLogs());
  }, []);

  // Supabase Auth listener if configured
  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name
          });
          setIsAuthenticated(true);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name
          });
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const addToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth Methods
  const login = async (email: string) => {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      addToast('info', 'Magic login link sent to your email!');
    }
    const demoUser = { id: 'usr_demo_1', email, full_name: email.split('@')[0] };
    setUser(demoUser);
    setIsAuthenticated(true);
    localStorage.setItem('socialpilot_user', JSON.stringify(demoUser));
    localStorage.setItem('socialpilot_authed', 'true');
    addToast('success', 'Logged in successfully!');
    if (!business?.onboarding_completed) {
      setCurrentView('onboarding');
    } else {
      setCurrentView('dashboard');
    }
  };

  const signup = async (email: string, name: string) => {
    const newUser = { id: `usr_${Date.now()}`, email, full_name: name };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('socialpilot_user', JSON.stringify(newUser));
    localStorage.setItem('socialpilot_authed', 'true');
    addToast('success', 'Account created successfully!');
    setCurrentView('onboarding');
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('socialpilot_authed');
    addToast('info', 'Signed out.');
    setCurrentView('landing');
  };

  const resetPassword = async (email: string) => {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    }
    addToast('success', 'Password reset instructions sent to ' + email);
  };

  // Business Profile Actions
  const updateBusiness = (updated: Partial<BusinessProfile>) => {
    setBusiness(prev => prev ? { ...prev, ...updated } : null);
    addToast('success', 'Business profile updated!');
  };

  const completeOnboarding = (data: BusinessProfile) => {
    const fullData = { ...data, onboarding_completed: true };
    setBusiness(fullData);
    const newPosts = generateInitialPosts(fullData);
    setPosts(newPosts);
    addToast('success', 'Onboarding complete! Your 7-day AI content calendar is ready.');
    setCurrentView('dashboard');
  };

  // Content Actions
  const generateNew7DayPlan = (customTopic?: string) => {
    if (!business) return;
    const rawPlan = generate7DayContentPlan(business, customTopic);
    const formatted: PostItem[] = rawPlan.map((item, idx) => ({
      ...item,
      id: `post_gen_${Date.now()}_${idx}`,
      created_at: new Date().toISOString()
    }));
    setPosts(formatted);
    addToast('success', 'Generated a new 7-Day AI Content Plan!');
  };

  const updatePost = (id: string, updated: Partial<PostItem>) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    addToast('success', 'Post updated.');
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    addToast('info', 'Post removed.');
  };

  const duplicatePost = (id: string) => {
    const target = posts.find(p => p.id === id);
    if (!target) return;
    const dup: PostItem = {
      ...target,
      id: `post_dup_${Date.now()}`,
      headline: `${target.headline} (Copy)`,
      status: 'Draft',
      created_at: new Date().toISOString()
    };
    setPosts(prev => [dup, ...prev]);
    addToast('success', 'Post duplicated as Draft.');
  };

  const approvePost = (id: string) => {
    updatePost(id, { status: 'Approved' });
    addToast('success', 'Post approved!');
  };

  const schedulePost = (id: string, dateStr?: string, timeStr?: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: 'Scheduled',
          scheduled_date: dateStr || p.scheduled_date,
          scheduled_time: timeStr || p.scheduled_time
        };
      }
      return p;
    }));
    addToast('success', 'Post scheduled for automatic publishing.');
  };

  const publishPostNow = async (id: string) => {
    const target = posts.find(p => p.id === id);
    if (!target) return;

    addToast('info', `Attempting to publish "${target.headline}"...`);
    const res = await schedulerInstance.processDuePosts([{ ...target, status: 'Scheduled' }]);
    if (res.successCount > 0) {
      addToast('success', 'Post published successfully to connected account!');
    } else {
      addToast('error', 'Publish failed. Check social accounts setup or scheduler log.');
    }
  };

  // Media Actions
  const addMediaAsset = (asset: MediaAsset) => {
    setMediaAssets(prev => [asset, ...prev]);
    addToast('success', `Added ${asset.file_name} to Media Library.`);
  };

  const deleteMediaAsset = (id: string) => {
    setMediaAssets(prev => prev.filter(m => m.id !== id));
    addToast('info', 'Media asset removed.');
  };

  // Social Account Actions
  const updateSocialAccount = (id: string, updated: Partial<SocialAccount>) => {
    setSocialAccounts(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
    addToast('success', 'Social account connection updated.');
  };

  // Scheduler Controls
  const toggleScheduler = () => {
    if (isSchedulerActive) {
      schedulerInstance.stopAutoCheck();
      setIsSchedulerActive(false);
      addToast('info', 'Automated background scheduler paused.');
    } else {
      schedulerInstance.startAutoCheck(30, () => posts);
      setIsSchedulerActive(true);
      addToast('success', 'Automated background scheduler active! (Checks every 30s)');
    }
  };

  const runSchedulerManual = async () => {
    addToast('info', 'Triggering manual scheduler check cycle...');
    await schedulerInstance.processDuePosts(posts);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        resetPassword,
        currentView,
        setCurrentView,
        business,
        updateBusiness,
        completeOnboarding,
        posts,
        setPosts,
        generateNew7DayPlan,
        updatePost,
        deletePost,
        duplicatePost,
        approvePost,
        schedulePost,
        publishPostNow,
        editingPost,
        setEditingPost,
        mediaAssets,
        addMediaAsset,
        deleteMediaAsset,
        socialAccounts,
        updateSocialAccount,
        schedulerLogs,
        isSchedulerActive,
        toggleScheduler,
        runSchedulerManual,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
