import { logger } from '@/lib/utils/logger';
import { STORES_MAP_DEFAULT_CENTER } from '@/constants/stores-page';

const NOMINATIM_SEARCH_URL = 'https://nominatim.openstreetmap.org/search';
const GEOCODE_USER_AGENT = 'MaMarie-Shop/1.0 (partner-stores)';

export interface GeocodedCoordinates {
  latitude: number;
  longitude: number;
}

interface NominatimResult {
  lat?: string;
  lon?: string;
}

/**
 * Resolves store coordinates from a free-text address (OpenStreetMap Nominatim).
 * Falls back to Yerevan center when lookup fails.
 */
export async function geocodePartnerStoreAddress(address: string): Promise<GeocodedCoordinates> {
  const query = address.trim();
  if (!query) {
    return { ...STORES_MAP_DEFAULT_CENTER };
  }

  try {
    const url = new URL(NOMINATIM_SEARCH_URL);
    url.searchParams.set('q', query);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '1');

    const response = await fetch(url.toString(), {
      headers: { 'User-Agent': GEOCODE_USER_AGENT },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      logger.warn('[geocode] Nominatim request failed', { status: response.status, query });
      return { ...STORES_MAP_DEFAULT_CENTER };
    }

    const results = (await response.json()) as NominatimResult[];
    const match = results[0];
    const latitude = Number.parseFloat(match?.lat ?? '');
    const longitude = Number.parseFloat(match?.lon ?? '');

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      logger.warn('[geocode] No coordinates found for address', { query });
      return { ...STORES_MAP_DEFAULT_CENTER };
    }

    return { latitude, longitude };
  } catch (error) {
    logger.warn('[geocode] Address lookup error', { query, error });
    return { ...STORES_MAP_DEFAULT_CENTER };
  }
}
