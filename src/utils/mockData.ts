import type { BusinessProfile, MediaAsset, PostItem, SocialAccount } from '../types';
import { generate7DayContentPlan } from '../services/aiGenerator';

export const initialSampleBusiness: BusinessProfile = {
  id: 'biz_sample_101',
  user_id: 'user_demo_01',
  business_name: 'Artisan Bloom Coffee Roasters',
  business_category: 'Restaurant & Cafe',
  business_description: 'Artisan craft coffee roastery and organic bakery serving single-origin beans, specialty espresso drinks, and fresh pastries.',
  location: 'Austin, TX',
  target_audience: 'Coffee enthusiasts, remote professionals, students, and local neighborhood foodies.',
  products_services: 'Single-origin espresso, Cold brew growlers, Housemade sourdough pastries, Coffee subscription boxes',
  brand_tone: 'Casual & Friendly',
  brand_colors: ['#7c2d12', '#b45309', '#fef3c7', '#0f172a'],
  website_url: 'https://artisanbloomcoffee.example.com',
  instagram_username: '@artisanbloomcoffee',
  facebook_page: 'Artisan Bloom Coffee Austin',
  posting_frequency: 'Once daily',
  logo_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
  onboarding_completed: true,
  created_at: new Date().toISOString()
};

export const sampleMediaAssets: MediaAsset[] = [
  {
    id: 'media_1',
    business_id: 'biz_sample_101',
    file_name: 'espresso-artisan.jpg',
    public_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    asset_type: 'image',
    source: 'user_uploaded',
    tags: ['coffee', 'espresso', 'hero'],
    created_at: new Date().toISOString()
  },
  {
    id: 'media_2',
    business_id: 'biz_sample_101',
    file_name: 'roasting-process.jpg',
    public_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    asset_type: 'image',
    source: 'licensed_stock',
    tags: ['behind-the-scenes', 'beans'],
    created_at: new Date().toISOString()
  },
  {
    id: 'media_3',
    business_id: 'biz_sample_101',
    file_name: 'pastry-spread.jpg',
    public_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    asset_type: 'image',
    source: 'user_uploaded',
    tags: ['food', 'croissant', 'breakfast'],
    created_at: new Date().toISOString()
  },
  {
    id: 'media_4',
    business_id: 'biz_sample_101',
    file_name: 'team-barista.jpg',
    public_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    asset_type: 'image',
    source: 'user_uploaded',
    tags: ['team', 'community'],
    created_at: new Date().toISOString()
  },
  {
    id: 'media_5',
    business_id: 'biz_sample_101',
    file_name: 'coffee-beans-bag.jpg',
    public_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    asset_type: 'image',
    source: 'ai_generated',
    tags: ['product', 'packaging'],
    created_at: new Date().toISOString()
  }
];

export const generateInitialPosts = (business: BusinessProfile): PostItem[] => {
  const plan = generate7DayContentPlan(business);
  return plan.map((item, idx) => ({
    ...item,
    id: `post_sample_${idx + 1}`,
    created_at: new Date().toISOString(),
    status: idx === 0 ? 'Approved' : idx === 1 ? 'Scheduled' : idx === 4 ? 'Published' : 'Draft'
  }));
};

export const sampleSocialAccounts: SocialAccount[] = [
  {
    id: 'acc_ig_1',
    business_id: 'biz_sample_101',
    platform: 'instagram',
    account_name: 'Artisan Bloom Coffee',
    account_handle: '@artisanbloomcoffee',
    is_connected: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'acc_fb_1',
    business_id: 'biz_sample_101',
    platform: 'facebook',
    account_name: 'Artisan Bloom Coffee Austin',
    account_handle: 'facebook.com/artisanbloomcoffee',
    is_connected: false,
    created_at: new Date().toISOString()
  }
];
