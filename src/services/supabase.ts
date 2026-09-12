import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  (import.meta.env.VITE_SUPABASE_URL as string) || 
  (import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string) || 
  '';

const supabaseAnonKey = 
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) || 
  (import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string) || 
  (import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string) || 
  '';

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) && 
    Boolean(supabaseAnonKey) && 
    !supabaseUrl.includes('YOUR_SUPABASE') && 
    !supabaseUrl.includes('placeholder-project') &&
    supabaseUrl.startsWith('https://')
  );
};

// Fallback dummy client if credentials not present yet to avoid runtime throw
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (createClient('https://placeholder-project.supabase.co', 'placeholder-key') as ReturnType<typeof createClient>);


