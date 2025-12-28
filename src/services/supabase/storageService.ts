import { supabase } from './client';
import { File } from 'expo-file-system/next';

const PROFILE_IMAGES_BUCKET = 'profile-images';

class SupabaseStorageService {
  /**
   * Upload profile image from React Native (Expo Image Picker URI)
   * Stores in: profile-images/{userId}/profile_{timestamp}.jpg
   */
  async uploadProfileImage(imageUri: string): Promise<string> {
    // 1. Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('You must be logged in to upload a profile image.');
    }

    const userId = user.id;

    if (__DEV__) {
      console.log('📤 Uploading profile image for user:', userId);
      console.log('📷 Image URI:', imageUri);
    }

    // 2. Read image file using Expo File API (SDK 54+)
    const file = new File(imageUri);
    
    // 3. Read as bytes (Uint8Array) - works reliably in Expo
    const uint8Array = await file.bytes();

    if (__DEV__) {
      console.log('📦 File size:', uint8Array.length, 'bytes');
    }

    // 4. Generate file path: {userId}/profile_{timestamp}.jpg
    const fileName = `profile_${Date.now()}.jpg`;
    const filePath = `${userId}/${fileName}`;

    if (__DEV__) {
      console.log('📁 Upload path:', filePath);
    }

    // 5. Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(PROFILE_IMAGES_BUCKET)
      .upload(filePath, uint8Array, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      if (__DEV__) {
        console.error('❌ Upload failed:', uploadError.message);
      }
      throw new Error('Upload failed, please try again.');
    }

    // 6. Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(PROFILE_IMAGES_BUCKET)
      .getPublicUrl(data.path);

    if (__DEV__) {
      console.log('✅ Upload successful!');
      console.log('🔗 Public URL:', publicUrl);
    }

    return publicUrl;
  }

  /**
   * Delete file from storage
   */
  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
  }

  /**
   * Get public URL for a file
   */
  getPublicUrl(bucket: string, path: string): string {
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
    return publicUrl;
  }
}

export const supabaseStorageService = new SupabaseStorageService();

