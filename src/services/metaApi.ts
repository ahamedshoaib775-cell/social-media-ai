import type { PostItem } from '../types';

export interface MetaConnectionState {
  appId: string;
  appSecret: string;
  userAccessToken: string;
  pageId: string;
  instagramBusinessAccountId: string;
  isConnected: boolean;
}

const META_STORAGE_KEY = 'socialpilot_meta_credentials';

export const getMetaCredentials = (): MetaConnectionState => {
  const stored = localStorage.getItem(META_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
  }
  return {
    appId: import.meta.env.VITE_META_APP_ID || '',
    appSecret: import.meta.env.VITE_META_APP_SECRET || '',
    userAccessToken: import.meta.env.VITE_META_ACCESS_TOKEN || '',
    pageId: import.meta.env.VITE_META_PAGE_ID || '',
    instagramBusinessAccountId: import.meta.env.VITE_META_IG_ACCOUNT_ID || '',
    isConnected: false
  };
};

export const saveMetaCredentials = (credentials: MetaConnectionState) => {
  localStorage.setItem(META_STORAGE_KEY, JSON.stringify(credentials));
};

export interface MetaPublishResult {
  success: boolean;
  platform: 'instagram' | 'facebook';
  metaPostId?: string;
  isSimulated?: boolean;
  error?: string;
}

export const validateMetaConnection = (creds: MetaConnectionState): { valid: boolean; reason?: string } => {
  const token = creds.userAccessToken || import.meta.env.VITE_META_ACCESS_TOKEN;
  if (!token) {
    return {
      valid: false,
      reason: 'No live Meta Graph API Access Token configured. Operating in Demo/Simulation Mode (Posts will simulate successful dispatch).'
    };
  }
  if (!creds.pageId && !creds.instagramBusinessAccountId && !import.meta.env.VITE_META_PAGE_ID && !import.meta.env.VITE_META_IG_ACCOUNT_ID) {
    return {
      valid: false,
      reason: 'No connected Meta Facebook Page ID or Instagram Business Account ID found.'
    };
  }
  return { valid: true };
};

export const publishToMetaAccounts = async (post: PostItem): Promise<MetaPublishResult> => {
  const creds = getMetaCredentials();

  const accessToken = creds.userAccessToken || import.meta.env.VITE_META_ACCESS_TOKEN;
  const igAccountId = creds.instagramBusinessAccountId || import.meta.env.VITE_META_IG_ACCOUNT_ID;
  const pageId = creds.pageId || import.meta.env.VITE_META_PAGE_ID;

  // Fallback to Demo / Simulated Publishing if no live token is present
  if (!accessToken) {
    await new Promise(resolve => setTimeout(resolve, 800)); // simulate network delay
    return {
      success: true,
      platform: 'instagram',
      isSimulated: true,
      metaPostId: `DEMO_IG_${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };
  }

  // Attempt real Meta Graph API call when token is provided
  try {
    if (igAccountId) {
      const fullCaption = `${post.headline}\n\n${post.caption}\n\n${post.hashtags.join(' ')}`;
      const mediaUrl = post.media_url || 'https://images.unsplash.com/photo-1542744094-3a31b272c490';
      const isVideoOrReel = (post.required_media_type && post.required_media_type.toLowerCase().includes('video')) || 
                            mediaUrl.match(/\.(mp4|mov|webm)(\?.*)?$/i) !== null || 
                            post.content_type?.toLowerCase().includes('reel');

      let containerEndpoint = `https://graph.facebook.com/v19.0/${igAccountId}/media`;
      
      let params = new URLSearchParams({
        access_token: accessToken,
        caption: fullCaption
      });

      if (isVideoOrReel) {
        params.append('media_type', 'REELS');
        params.append('video_url', mediaUrl);
      } else {
        params.append('image_url', mediaUrl);
      }

      // Step 1: Create Container on Instagram Graph API
      const createRes = await fetch(`${containerEndpoint}?${params.toString()}`, { method: 'POST' });
      const createData = await createRes.json();

      if (createData.error) {
        return {
          success: false,
          platform: 'instagram',
          error: `Meta Graph API Error [${createData.error.code}]: ${createData.error.message}`
        };
      }

      const creationId = createData.id;

      // Step 2: For Videos/Reels, poll container status until FINISHED
      if (isVideoOrReel) {
        let isReady = false;
        let attempts = 0;
        while (!isReady && attempts < 10) {
          await new Promise(r => setTimeout(r, 2000));
          attempts++;
          const statusRes = await fetch(`https://graph.facebook.com/v19.0/${creationId}?fields=status_code&access_token=${accessToken}`);
          const statusData = await statusRes.json();
          if (statusData.status_code === 'FINISHED') {
            isReady = true;
          } else if (statusData.status_code === 'ERROR') {
            return {
              success: false,
              platform: 'instagram',
              error: 'Instagram Reel processing error on Meta server.'
            };
          }
        }
      }

      // Step 3: Publish Container
      const publishRes = await fetch(
        `https://graph.facebook.com/v19.0/${igAccountId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`,
        { method: 'POST' }
      );

      const publishData = await publishRes.json();

      if (publishData.error) {
        return {
          success: false,
          platform: 'instagram',
          error: `Meta Graph API Publish Error: ${publishData.error.message}`
        };
      }

      return {
        success: true,
        platform: 'instagram',
        metaPostId: publishData.id
      };
    } else if (pageId) {
      // Publish to Facebook Page Feed
      const fbRes = await fetch(
        `https://graph.facebook.com/v19.0/${pageId}/feed?message=${encodeURIComponent(post.caption)}&link=${encodeURIComponent(post.media_url || '')}&access_token=${accessToken}`,
        { method: 'POST' }
      );

      const fbData = await fbRes.json();

      if (fbData.error) {
        return {
          success: false,
          platform: 'facebook',
          error: `Facebook Graph API Error: ${fbData.error.message}`
        };
      }

      return {
        success: true,
        platform: 'facebook',
        metaPostId: fbData.id
      };
    }
  } catch (err: any) {
    return {
      success: false,
      platform: 'instagram',
      error: `Network connection to Meta Graph API failed: ${err?.message || 'Check connection or CORS configuration'}`
    };
  }

  // Final fallback to simulation if account IDs were missing
  return {
    success: true,
    platform: 'instagram',
    isSimulated: true,
    metaPostId: `DEMO_IG_${Math.random().toString(36).substring(2, 9).toUpperCase()}`
  };
};
