export interface PartnerStoreItem {
  id: string;
  slug: string;
  name: string;
  address: string;
  logoUrl: string | null;
  latitude: number;
  longitude: number;
  position: number;
  published?: boolean;
}

export interface PartnerStoreFormData {
  name: string;
  address: string;
  logoUrl: string;
  published: 'published' | 'draft';
}

export function buildGoogleMapsDirectionsUrl(
  latitude: number,
  longitude: number,
  address: string,
): string {
  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
