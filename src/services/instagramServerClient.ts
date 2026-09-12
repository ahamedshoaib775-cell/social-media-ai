export interface InstagramServerStatusResponse {
  connected: boolean;
  metaAppId: string;
  instagramAppId: string;
  username: string;
  accountId: string;
  permissions: string[];
  account?: {
    id: string;
    username: string;
    name?: string;
    profile_picture_url?: string;
    followers_count?: number;
    biography?: string;
  };
  error?: string;
  timestamp: string;
}

export interface InstagramServerTestResponse {
  success: boolean;
  message: string;
  metaAppId: string;
  instagramAppId: string;
  accountId: string;
  username: string;
  permissionsValidated: string[];
  graphApiEndpointTested: string;
  timestamp: string;
  error?: string;
}

/**
 * Client service to query server-side Instagram endpoints.
 * Never requests or exposes tokens to the browser.
 */
export async function fetchInstagramServerStatus(): Promise<InstagramServerStatusResponse> {
  try {
    const res = await fetch('/api/instagram?action=status');
    if (!res.ok) {
      const errData: any = await res.json().catch(() => ({}));
      return {
        connected: false,
        metaAppId: '1430172265635772',
        instagramAppId: '2006832513367438',
        username: '@the.veloce',
        accountId: '17841479913682939',
        permissions: ['instagram_business_basic', 'instagram_business_content_publish'],
        error: errData?.error || `Server API responded with HTTP status ${res.status}`,
        timestamp: new Date().toISOString()
      };
    }
    const data = (await res.json()) as InstagramServerStatusResponse;
    return data;
  } catch (err: any) {
    return {
      connected: false,
      metaAppId: '1430172265635772',
      instagramAppId: '2006832513367438',
      username: '@the.veloce',
      accountId: '17841479913682939',
      permissions: ['instagram_business_basic', 'instagram_business_content_publish'],
      error: `Network error reaching server API: ${err?.message || 'Connection failed'}`,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Client service to run server-side connection test against Graph API endpoint.
 * Returns sanitized test result (no tokens exposed).
 */
export async function runInstagramServerTest(): Promise<InstagramServerTestResponse> {
  try {
    const res = await fetch('/api/instagram?action=test', { method: 'POST' });
    const data = (await res.json()) as InstagramServerTestResponse;
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to execute server-side connection test: ${err?.message || 'Network error'}`,
      metaAppId: '1430172265635772',
      instagramAppId: '2006832513367438',
      accountId: '17841479913682939',
      username: '@the.veloce',
      permissionsValidated: ['instagram_business_basic', 'instagram_business_content_publish'],
      graphApiEndpointTested: 'https://graph.facebook.com/v19.0/17841479913682939',
      timestamp: new Date().toISOString(),
      error: err?.message || 'Client network error'
    };
  }
}
