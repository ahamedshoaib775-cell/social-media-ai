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
  error?: string;
}

export const validateMetaConnection = (creds: MetaConnectionState): { valid: boolean; reason?: string } => {
  if (!creds.userAccessToken && !import.meta.env.VITE_META_ACCESS_TOKEN) {
    return {
      valid: false,
      reason: 'Missing Meta Graph API User Access Token. Please add your access token in Social Accounts settings or VITE_META_ACCESS_TOKEN env variable.'
    };
  }
  if (!creds.pageId && !creds.instagramBusinessAccountId) {
    return {
      valid: false,
      reason: 'No connected Meta Facebook Page ID or Instagram Business Account ID found.'
    };
  }
  return { valid: true };
};

export const publishToMetaAccounts = async (post: PostItem): Promise<MetaPublishResult> => {
  const creds = getMetaCredentials();
  const validation = validateMetaConnection(creds);

  if (!validation.valid) {
    return {
      success: false,
      platform: 'instagram',
      error: validation.reason
    };
  }

  // Attempt real Meta Graph API call if token is provided
  const accessToken = creds.userAccessToken || import.meta.env.VITE_META_ACCESS_TOKEN;
  const igAccountId = creds.instagramBusinessAccountId || import.meta.env.VITE_META_IG_ACCOUNT_ID;
  const pageId = creds.pageId || import.meta.env.VITE_META_PAGE_ID;

  try {
    if (igAccountId && accessToken) {
      // Step 1: Create Container on Instagram Graph API
      const createRes = await fetch(
        `https://graph.facebook.com/v19.0/${igAccountId}/media?image_url=${encodeURIComponent(post.media_url || 'https://images.unsplash.com/photo-1542744094-3a31b272c490')}&caption=${encodeURIComponent(post.headline + '\n\n' + post.caption + '\n\n' + post.hashtags.join(' '))}&access_token=${accessToken}`,
        { method: 'POST' }
      );

      const createData = await createRes.json();

      if (createData.error) {
        return {
          success: false,
          platform: 'instagram',
          error: `Meta Graph API Error [${createData.error.code}]: ${createData.error.message}`
        };
      }

      const creationId = createData.id;

      // Step 2: Publish Container
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
    } else if (pageId && accessToken) {
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

  return {
    success: false,
    platform: 'instagram',
    error: 'Meta credentials provided are incomplete or expired.'
  };
};
