export type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
};

export type BusinessProfile = {
  id: string;
  user_id: string;
  business_name: string;
  business_category: string;
  business_description: string;
  location: string;
  target_audience: string;
  products_services: string;
  brand_tone: string;
  brand_colors: string[];
  website_url?: string;
  instagram_username?: string;
  facebook_page?: string;
  posting_frequency: string;
  logo_url?: string;
  onboarding_completed: boolean;
  created_at?: string;
};

export type MediaAsset = {
  id: string;
  business_id: string;
  file_name: string;
  public_url: string;
  asset_type: 'image' | 'video' | 'logo';
  file_size?: number;
  source: 'user_uploaded' | 'ai_generated' | 'licensed_stock';
  tags?: string[];
  created_at: string;
};

export type SocialAccount = {
  id: string;
  business_id: string;
  platform: 'instagram' | 'facebook';
  account_name: string;
  account_handle?: string;
  meta_account_id?: string;
  access_token?: string;
  token_expires_at?: string;
  is_connected: boolean;
  created_at: string;
};

export type ContentType = 
  | 'Educational'
  | 'Promotional'
  | 'Behind the scenes'
  | 'Customer story'
  | 'FAQ'
  | 'Industry insight'
  | 'Engagement'
  | 'Reel'
  | 'Carousel'
  | 'Single image';

export type PostStatus = 'Draft' | 'Approved' | 'Scheduled' | 'Published' | 'Failed';

export type PostItem = {
  id: string;
  business_id: string;
  content_plan_id?: string;
  day_number: number;
  scheduled_date: string; // YYYY-MM-DD
  scheduled_time: string; // e.g. "09:30"
  content_type: ContentType;
  headline: string;
  caption: string;
  hashtags: string[];
  suggested_posting_time: string;
  cta: string;
  required_media_type: string;
  media_id?: string;
  media_url?: string;
  status: PostStatus;
  published_at?: string;
  failure_reason?: string;
  created_at: string;
};

export type ScheduledPostQueue = {
  id: string;
  post_id: string;
  business_id: string;
  scheduled_for: string; // ISO String
  attempt_count: number;
  execution_status: 'pending' | 'processing' | 'completed' | 'failed';
  error_log?: string;
  created_at: string;
};

export type PostAnalytics = {
  id: string;
  post_id: string;
  business_id: string;
  platform: 'instagram' | 'facebook';
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  engagement_rate: number;
  fetched_at: string;
};

export type SchedulerLog = {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  post_id?: string;
};
