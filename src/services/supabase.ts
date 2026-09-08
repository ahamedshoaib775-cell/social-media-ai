import { createClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};

const supabaseUrl = 
  env.VITE_SUPABASE_URL || 
  env.NEXT_PUBLIC_SUPABASE_URL || 
  '';

const supabaseAnonKey = 
  env.VITE_SUPABASE_ANON_KEY || 
  env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  '';

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) && 
    Boolean(supabaseAnonKey) && 
    !supabaseUrl.includes('YOUR_SUPABASE') && 
    supabaseUrl.startsWith('https://')
  );
};

// Fallback dummy client if credentials not present yet to avoid runtime throw
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (createClient('https://placeholder-project.supabase.co', 'placeholder-key') as ReturnType<typeof createClient>);

