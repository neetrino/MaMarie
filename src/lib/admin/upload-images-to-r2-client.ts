import { apiClient } from '@/lib/api-client';

interface UploadImagesResponse {
  urls: string[];
}

/**
 * Compress-ready client helper: sends data URLs to admin R2 upload and returns public URLs.
 */
export async function uploadImagesToR2Client(dataUrls: string[]): Promise<string[]> {
  if (dataUrls.length === 0) {
    return [];
  }

  const response = await apiClient.post<UploadImagesResponse>(
    '/api/v1/admin/products/upload-images',
    { images: dataUrls }
  );

  if (!Array.isArray(response.urls) || response.urls.length === 0) {
    throw new Error('Image upload returned no URLs');
  }

  return response.urls;
}
