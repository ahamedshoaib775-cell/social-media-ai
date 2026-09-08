-- SocialPilot AI Supabase Database Schema & RLS Policies
-- Execute this script in your Supabase SQL Editor to set up tables, storage, and security.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. BUSINESSES TABLE
create table if not exists public.businesses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  business_name text not null,
  business_category text not null,
  business_description text,
  location text,
  target_audience text,
  products_services text,
  brand_tone text default 'Professional',
  brand_colors text[] default array['#2563eb', '#4f46e5', '#0f172a'],
  website_url text,
  instagram_username text,
  facebook_page text,
  posting_frequency text default 'Once daily',
  logo_url text,
  onboarding_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. BRAND ASSETS (MEDIA LIBRARY) TABLE
create table if not exists public.brand_assets (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id) on delete cascade not null,
  file_name text not null,
  file_path text not null,
  public_url text not null,
  asset_type text check (asset_type in ('image', 'video', 'logo', 'document')) default 'image',
  file_size bigint,
  source text default 'user_uploaded', -- user_uploaded, ai_generated, licensed_stock
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. SOCIAL ACCOUNTS TABLE
create table if not exists public.social_accounts (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id) on delete cascade not null,
  platform text check (platform in ('instagram', 'facebook')) not null,
  account_name text not null,
  account_handle text,
  meta_account_id text,
  access_token text,
  token_expires_at timestamp with time zone,
  is_connected boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. CONTENT PLANS TABLE
create table if not exists public.content_plans (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id) on delete cascade not null,
  title text not null,
  start_date date not null,
  end_date date not null,
  status text check (status in ('active', 'archived', 'draft')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. POSTS TABLE
create table if not exists public.posts (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id) on delete cascade not null,
  content_plan_id uuid references public.content_plans(id) on delete set null,
  day_number integer check (day_number >= 1 and day_number <= 31),
  scheduled_date date,
  scheduled_time text,
  content_type text not null, -- Educational, Promotional, Behind the scenes, Customer story, FAQ, Industry insight, Engagement, Reel, Carousel, Single image
  headline text,
  caption text not null,
  hashtags text[] default array[]::text[],
  suggested_posting_time text,
  cta text,
  required_media_type text,
  media_id uuid references public.brand_assets(id) on delete set null,
  media_url text,
  status text check (status in ('Draft', 'Approved', 'Scheduled', 'Published', 'Failed')) default 'Draft',
  published_at timestamp with time zone,
  failure_reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. SCHEDULED POSTS TABLE (QUEUE LOGS)
create table if not exists public.scheduled_posts (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  business_id uuid references public.businesses(id) on delete cascade not null,
  scheduled_for timestamp with time zone not null,
  attempt_count integer default 0,
  last_attempt_at timestamp with time zone,
  execution_status text check (execution_status in ('pending', 'processing', 'completed', 'failed')) default 'pending',
  error_log text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. POST ANALYTICS TABLE
create table if not exists public.post_analytics (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  business_id uuid references public.businesses(id) on delete cascade not null,
  platform text not null,
  likes integer default 0,
  comments integer default 0,
  shares integer default 0,
  saves integer default 0,
  reach integer default 0,
  engagement_rate numeric(5,2) default 0.00,
  fetched_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.brand_assets enable row level security;
alter table public.social_accounts enable row level security;
alter table public.content_plans enable row level security;
alter table public.posts enable row level security;
alter table public.scheduled_posts enable row level security;
alter table public.post_analytics enable row level security;

-- Profiles Policy
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Businesses Policy
create policy "Users can view own business" on public.businesses for select using (auth.uid() = user_id);
create policy "Users can insert own business" on public.businesses for insert with check (auth.uid() = user_id);
create policy "Users can update own business" on public.businesses for update using (auth.uid() = user_id);
create policy "Users can delete own business" on public.businesses for delete using (auth.uid() = user_id);

-- Brand Assets Policy
create policy "Users can manage brand assets of their business" on public.brand_assets
  for all using (
    business_id in (select id from public.businesses where user_id = auth.uid())
  );

-- Social Accounts Policy
create policy "Users can manage social accounts of their business" on public.social_accounts
  for all using (
    business_id in (select id from public.businesses where user_id = auth.uid())
  );

-- Content Plans Policy
create policy "Users can manage content plans of their business" on public.content_plans
  for all using (
    business_id in (select id from public.businesses where user_id = auth.uid())
  );

-- Posts Policy
create policy "Users can manage posts of their business" on public.posts
  for all using (
    business_id in (select id from public.businesses where user_id = auth.uid())
  );

-- Scheduled Posts Policy
create policy "Users can manage scheduled posts of their business" on public.scheduled_posts
  for all using (
    business_id in (select id from public.businesses where user_id = auth.uid())
  );

-- Post Analytics Policy
create policy "Users can view post analytics of their business" on public.post_analytics
  for select using (
    business_id in (select id from public.businesses where user_id = auth.uid())
  );

-- STORAGE BUCKETS SETUP
-- Create brand-assets bucket if using Supabase Storage
insert into storage.buckets (id, name, public) 
values ('brand-assets', 'brand-assets', true) 
on conflict (id) do nothing;

create policy "Authenticated users can upload brand assets" on storage.objects
  for insert with check (bucket_id = 'brand-assets' and auth.role() = 'authenticated');

create policy "Public view access for brand assets" on storage.objects
  for select using (bucket_id = 'brand-assets');
