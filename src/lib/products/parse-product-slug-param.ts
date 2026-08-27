export interface ParsedProductSlugParam {
  slug: string;
  variantId: string | null;
}

/**
 * Parses a storefront product route param that may include a variant suffix.
 * Handles both literal (`slug:variantId`) and URL-encoded (`slug%3AvariantId`) colons.
 */
export function parseProductSlugParam(rawSlug: string): ParsedProductSlugParam {
  const trimmed = rawSlug.trim();
  if (!trimmed) {
    return { slug: '', variantId: null };
  }

  let decoded = trimmed;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    // Malformed percent-encoding — use the raw segment.
  }

  const colonIndex = decoded.indexOf(':');
  if (colonIndex === -1) {
    return { slug: decoded, variantId: null };
  }

  const slug = decoded.slice(0, colonIndex);
  const variantId = decoded.slice(colonIndex + 1).trim() || null;
  return { slug, variantId };
}

/** Product slug only — strips an optional `:variantId` suffix from route params. */
export function normalizeProductSlug(rawSlug: string): string {
  return parseProductSlugParam(rawSlug).slug;
}
