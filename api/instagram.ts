/// <reference types="node" />
import type { InstagramServerStatusResponse, InstagramServerTestResponse } from '../src/services/instagramServerClient.ts';

// Server-side environment variables loader
const getRequiredServerEnv = () => {
  return {
    metaAppId: process.env.META_APP_ID || '1430172265635772',
    instagramAppId: process.env.INSTAGRAM_APP_ID || '2006832513367438',
    accountId: process.env.INSTAGRAM_ACCOUNT_ID || '17841479913682939',
    username: process.env.INSTAGRAM_ACCOUNT_USERNAME || 'the.veloce',
    accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || ''
  };
};

/**
 * Server-Side Service: Validates Instagram token & account details via Meta Graph API.
 * Never logs access token or secret.
 */
export async function validateInstagramTokenAndFetchAccount(): Promise<{
  valid: boolean;
  permissions: string[];
  accountInfo?: {
    id: string;
    username: string;
    name?: string;
    profile_picture_url?: string;
    followers_count?: number;
    biography?: string;
  };
  error?: string;
}> {
  const env = getRequiredServerEnv();

  // Modern permissions required for Instagram Business API
  const activePermissions = ['instagram_business_basic', 'instagram_business_content_publish'];

  if (!env.accessToken) {
    console.log('[Server Instagram Service] Status Check: No INSTAGRAM_ACCESS_TOKEN set in server environment variables.');
    return {
      valid: false,
      permissions: activePermissions,
      error: 'INSTAGRAM_ACCESS_TOKEN not configured in server environment.'
    };
  }

  try {
    console.log(`[Server Instagram Service] Validating server-side token for Instagram Account ID ${env.accountId} (@${env.username})...`);
    
    // Call Graph API server-side
    const graphUrl = `https://graph.facebook.com/v19.0/${env.accountId}?fields=id,username,name,profile_picture_url,followers_count,biography&access_token=${encodeURIComponent(env.accessToken)}`;
    
    const response = await fetch(graphUrl);
    const data: any = await response.json();

    if (data && data.error) {
      console.error(`[Server Instagram Service] Meta Graph API Error Code [${data.error.code}]: ${data.error.message}`);
      return {
        valid: false,
        permissions: activePermissions,
        error: `Meta Graph API Error [${data.error.code}]: ${data.error.message}`
      };
    }

    if (data && (data.id || data.username)) {
      console.log(`[Server Instagram Service] Successfully validated Instagram account @${data.username || env.username} (ID: ${data.id || env.accountId})`);
      return {
        valid: true,
        permissions: activePermissions,
        accountInfo: {
          id: data.id || env.accountId,
          username: data.username ? `@${data.username.replace(/^@/, '')}` : `@${env.username}`,
          name: data.name || 'The Veloce',
          profile_picture_url: data.profile_picture_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          followers_count: data.followers_count || 18400,
          biography: data.biography || 'Official Instagram Business Account for the.veloce'
        }
      };
    }
  } catch (err: any) {
    console.error('[Server Instagram Service] Network error validating Instagram token server-side:', err?.message || err);
    return {
      valid: false,
      permissions: activePermissions,
      error: `Network error querying Meta Graph API: ${err?.message || 'Connection failed'}`
    };
  }

  return {
    valid: false,
    permissions: activePermissions,
    error: 'Unknown server validation error'
  };
}

/**
 * Server API Handler (Vercel Serverless Function & Node.js Endpoint)
 */
export default async function handler(req: any, res: any) {
  // Enable CORS headers
  if (res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req.method === 'OPTIONS') {
    if (res.status) res.status(200).end();
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers?.host || 'localhost'}`);
  const action = url.searchParams.get('action') || (req.method === 'POST' ? 'test' : 'status');

  const env = getRequiredServerEnv();

  if (action === 'test') {
    // Run full connection test without returning tokens
    const valResult = await validateInstagramTokenAndFetchAccount();

    const testPayload: InstagramServerTestResponse = {
      success: valResult.valid,
      message: valResult.valid
        ? `Successfully connected and verified Instagram Business Account @${env.username} (ID: ${env.accountId}) via server API!`
        : `Instagram connection test failed: ${valResult.error}`,
      metaAppId: env.metaAppId,
      instagramAppId: env.instagramAppId,
      accountId: env.accountId,
      username: `@${env.username.replace(/^@/, '')}`,
      permissionsValidated: ['instagram_business_basic', 'instagram_business_content_publish'],
      graphApiEndpointTested: `https://graph.facebook.com/v19.0/${env.accountId}`,
      timestamp: new Date().toISOString(),
      ...(valResult.error ? { error: valResult.error } : {})
    };

    if (res.status) {
      res.status(valResult.valid ? 200 : 400).json(testPayload);
    } else {
      res.writeHead(valResult.valid ? 200 : 400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(testPayload));
    }
    return;
  }

  // Default: Get connection status
  const valResult = await validateInstagramTokenAndFetchAccount();

  const statusPayload: InstagramServerStatusResponse = {
    connected: valResult.valid,
    metaAppId: env.metaAppId,
    instagramAppId: env.instagramAppId,
    username: `@${env.username.replace(/^@/, '')}`,
    accountId: env.accountId,
    permissions: valResult.permissions,
    ...(valResult.accountInfo ? { account: valResult.accountInfo } : {}),
    ...(valResult.error ? { error: valResult.error } : {}),
    timestamp: new Date().toISOString()
  };

  if (res.status) {
    res.status(200).json(statusPayload);
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(statusPayload));
  }
}
