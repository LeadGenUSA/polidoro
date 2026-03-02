import { supabase } from '@/integrations/supabase/client';

export function isHeicFile(file: File): boolean {
  const type = file.type.toLowerCase();
  if (type === 'image/heic' || type === 'image/heif') return true;
  const ext = file.name.split('.').pop()?.toLowerCase();
  return ext === 'heic' || ext === 'heif';
}

/**
 * Uploads a file to the specified bucket. HEIC/HEIF files are sent to the
 * convert-image edge function for server-side conversion to JPEG.
 * All other files are uploaded directly to storage.
 */
export async function uploadFileWithConversion(
  file: File,
  bucket: string
): Promise<string> {
  if (isHeicFile(file)) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);

    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/convert-image`,
      {
        method: 'POST',
        headers: {
          apikey: anonKey,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Conversion failed' }));
      throw new Error(err.error || 'HEIC conversion failed');
    }

    const { publicUrl } = await response.json();
    return publicUrl;
  }

  // Standard upload for non-HEIC files
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}
