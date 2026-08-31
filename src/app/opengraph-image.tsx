import { createBrandOgImageResponse } from '../lib/brand-og-image';

export const runtime = 'nodejs';
export const alt = 'MaMarie';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return createBrandOgImageResponse();
}
