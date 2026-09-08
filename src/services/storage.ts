import type { MediaAsset } from '../types';
import { isSupabaseConfigured, supabase } from './supabase';

export const uploadMediaFile = async (
  file: File,
  businessId: string,
  assetType: 'image' | 'video' | 'logo' = 'image'
): Promise<MediaAsset> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${businessId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.storage
        .from('brand-assets')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from('brand-assets')
        .getPublicUrl(data.path);

      const newAsset: MediaAsset = {
        id: Math.random().toString(36).substring(2, 11),
        business_id: businessId,
        file_name: file.name,
        public_url: publicUrlData.publicUrl,
        asset_type: assetType,
        file_size: file.size,
        source: 'user_uploaded',
        created_at: new Date().toISOString()
      };

      // Record in Supabase DB if available
      await supabase.from('brand_assets').insert({
        business_id: businessId,
        file_name: file.name,
        file_path: data.path,
        public_url: publicUrlData.publicUrl,
        asset_type: assetType,
        file_size: file.size,
        source: 'user_uploaded'
      });

      return newAsset;
    } catch (err) {
      console.warn('Supabase storage upload error, creating object URL fallback:', err);
    }
  }

  // Local object URL fallback
  const objectUrl = URL.createObjectURL(file);
  return {
    id: Math.random().toString(36).substring(2, 11),
    business_id: businessId,
    file_name: file.name,
    public_url: objectUrl,
    asset_type: assetType,
    file_size: file.size,
    source: 'user_uploaded',
    created_at: new Date().toISOString()
  };
};
