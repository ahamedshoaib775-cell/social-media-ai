import type { PostItem } from '../types';

export interface MetaConnectionState {
  appId: string;
  appSecret: string;
  userAccessToken: string;
  pageId: string;
  instagramBusinessAccountId: string;
  isConnected: boolean;
}

export interface InstagramProfileData {
  username: string;
  name: string;
  profile_picture_url: string;
  followers_count?: number;
  biography?: string;
}

const META_STORAGE_KEY = 'socialpilot_meta_credentials';

export const getMetaCredentials = (): MetaConnectionState => {
  const envToken = (import.meta.env.VITE_META_ACCESS_TOKEN as string) || (import.meta.env.NEXT_PUBLIC_META_ACCESS_TOKEN as string) || '';
  const stored = localStorage.getItem(META_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        appId: parsed.appId || (import.meta.env.VITE_META_APP_ID as string) || '',
        appSecret: parsed.appSecret || (import.meta.env.VITE_META_APP_SECRET as string) || '',
        userAccessToken: parsed.userAccessToken || envToken,
        pageId: parsed.pageId || (import.meta.env.VITE_META_PAGE_ID as string) || '',
        instagramBusinessAccountId: parsed.instagramBusinessAccountId || (import.meta.env.VITE_META_IG_ACCOUNT_ID as string) || '',
        isConnected: Boolean(parsed.isConnected || parsed.userAccessToken || envToken)
      };
    } catch (e) {
      // fallback
    }
  }
  return {
    appId: (import.meta.env.VITE_META_APP_ID as string) || '',
    appSecret: (import.meta.env.VITE_META_APP_SECRET as string) || '',
    userAccessToken: envToken,
    pageId: (import.meta.env.VITE_META_PAGE_ID as string) || '',
    instagramBusinessAccountId: (import.meta.env.VITE_META_IG_ACCOUNT_ID as string) || '',
    isConnected: Boolean(envToken)
  };
};

export const saveMetaCredentials = (credentials: MetaConnectionState) => {
  localStorage.setItem(META_STORAGE_KEY, JSON.stringify(credentials));
};

export interface MetaPublishResult {
  success: boolean;
  platform: 'instagram' | 'facebook';
  contentType?: 'Feed Post' | 'Reel' | 'Story';
  metaPostId?: string;
  isSimulated?: boolean;
  error?: string;
}

// Generate realistic Instagram profile data for any handle
export const getMockInstagramProfile = (inputHandle: string): InstagramProfileData => {
  const clean = inputHandle.replace(/^@/, '').trim() || 'artisanbloomcoffee';
  
  // Dynamic high-res profile picture curated list based on username hash
  const avatarPool = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80'
  ];

  let charCodeSum = 0;
  for (let i = 0; i < clean.length; i++) charCodeSum += clean.charCodeAt(i);
  const selectedAvatar = avatarPool[charCodeSum % avatarPool.length];

  // Capitalize name cleanly
  const formattedName = clean
    .replace(/[._-]/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    username: `@${clean.toLowerCase()}`,
    name: formattedName || 'Instagram Creator',
    profile_picture_url: selectedAvatar,
    followers_count: 12400 + (charCodeSum * 37) % 50000,
    biography: `Official Instagram Account for ${formattedName || clean}. Auto-published via SocialPilot AI.`
  };
};

// Fetch real Instagram Profile from Meta Graph API
export const fetchInstagramProfile = async (igAccountId: string, accessToken: string): Promise<InstagramProfileData | null> => {
  if (!igAccountId || !accessToken) return null;
  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${igAccountId}?fields=username,name,profile_picture_url,followers_count,biography&access_token=${accessToken}`
    );
    const data = await res.json();
    if (data && data.username) {
      return {
        username: `@${data.username}`,
        name: data.name || data.username,
        profile_picture_url: data.profile_picture_url || getMockInstagramProfile(data.username).profile_picture_url,
        followers_count: data.followers_count || 15200,
        biography: data.biography || ''
      };
    }
  } catch (err) {
    console.warn('Meta Graph API profile fetch warning:', err);
  }
  return null;
};

export const validateMetaConnection = (creds: MetaConnectionState): { valid: boolean; reason?: string } => {
  const token = creds.userAccessToken || (import.meta.env.VITE_META_ACCESS_TOKEN as string);
  if (!token) {
    return {
      valid: false,
      reason: 'No live Meta Graph API Access Token configured. Operating in Demo/Simulation Mode (Posts will simulate successful dispatch).'
    };
  }
  if (!creds.pageId && !creds.instagramBusinessAccountId && !(import.meta.env.VITE_META_PAGE_ID as string) && !(import.meta.env.VITE_META_IG_ACCOUNT_ID as string)) {
    return {
      valid: false,
      reason: 'No connected Meta Facebook Page ID or Instagram Business Account ID found.'
    };
  }
  return { valid: true };
};

export const publishToMetaAccounts = async (post: PostItem): Promise<MetaPublishResult> => {
  const creds = getMetaCredentials();

  const accessToken = creds.userAccessToken || (import.meta.env.VITE_META_ACCESS_TOKEN as string);
  const igAccountId = creds.instagramBusinessAccountId || (import.meta.env.VITE_META_IG_ACCOUNT_ID as string);
  const pageId = creds.pageId || (import.meta.env.VITE_META_PAGE_ID as string);

  // Determine media & post type: Story, Reel, or Feed Post
  const isReel = post.content_type === 'Reel' || post.required_media_type?.toLowerCase().includes('reel') || post.required_media_type?.toLowerCase().includes('video');
  const isStory = post.content_type?.toLowerCase().includes('story') || post.headline?.toLowerCase().includes('story');
  const formatName: 'Story' | 'Reel' | 'Feed Post' = isStory ? 'Story' : isReel ? 'Reel' : 'Feed Post';

  // Fallback to Demo / Simulated Publishing if no live token is present
  if (!accessToken) {
    await new Promise(resolve => setTimeout(resolve, 800)); // simulate network delay
    return {
      success: true,
      platform: 'instagram',
      contentType: formatName,
      isSimulated: true,
      metaPostId: `DEMO_IG_${formatName.replace(' ', '')}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };
  }

  // Attempt real Meta Graph API call when token is provided
  try {
    if (igAccountId) {
      const fullCaption = `${post.headline}\n\n${post.caption}\n\n${post.hashtags.join(' ')}`;
      const mediaUrl = post.media_url || 'https://images.unsplash.com/photo-1542744094-3a31b272c490';

      let containerEndpoint = `https://graph.facebook.com/v19.0/${igAccountId}/media`;
      
      let params = new URLSearchParams({
        access_token: accessToken
      });

      if (isStory) {
        params.append('media_type', 'STORIES');
        params.append('image_url', mediaUrl);
      } else if (isReel) {
        params.append('media_type', 'REELS');
        params.append('video_url', mediaUrl);
        params.append('caption', fullCaption);
      } else {
        params.append('image_url', mediaUrl);
        params.append('caption', fullCaption);
      }

      // Step 1: Create Container on Instagram Graph API
      const createRes = await fetch(`${containerEndpoint}?${params.toString()}`, { method: 'POST' });
      const createData = await createRes.json();

      if (createData.error) {
        return {
          success: false,
          platform: 'instagram',
          contentType: formatName,
          error: `Meta Graph API Error [${createData.error.code}]: ${createData.error.message}`
        };
      }

      const creationId = createData.id;

      // Step 2: For Videos/Reels, poll container status until FINISHED
      if (isReel) {
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
              contentType: formatName,
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
          contentType: formatName,
          error: `Meta Graph API Publish Error: ${publishData.error.message}`
        };
      }

      return {
        success: true,
        platform: 'instagram',
        contentType: formatName,
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
          contentType: formatName,
          error: `Facebook Graph API Error: ${fbData.error.message}`
        };
      }

      return {
        success: true,
        platform: 'facebook',
        contentType: formatName,
        metaPostId: fbData.id
      };
    }
  } catch (err: any) {
    return {
      success: false,
      platform: 'instagram',
      contentType: formatName,
      error: `Network connection to Meta Graph API failed: ${err?.message || 'Check connection or CORS configuration'}`
    };
  }

  // Final fallback to simulation if account IDs were missing
  return {
    success: true,
    platform: 'instagram',
    contentType: formatName,
    isSimulated: true,
    metaPostId: `DEMO_IG_${formatName.replace(' ', '')}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`
  };
};

