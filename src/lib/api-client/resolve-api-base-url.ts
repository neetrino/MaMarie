const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

function isPrivateLanHost(hostname: string): boolean {
  return (
    /^192\.168\./.test(hostname) ||
    /^10\./.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(hostname) ||
    hostname.endsWith('.local')
  );
}

function isLocalDevHost(hostname: string): boolean {
  return LOOPBACK_HOSTS.has(hostname) || isPrivateLanHost(hostname);
}

function resolvePort(url: URL): string {
  if (url.port) {
    return url.port;
  }
  return url.protocol === 'https:' ? '443' : '80';
}

function isSameDevServer(apiOrigin: string, pageOrigin: string): boolean {
  try {
    const api = new URL(apiOrigin);
    const page = new URL(pageOrigin);
    if (resolvePort(api) !== resolvePort(page)) {
      return false;
    }
    return isLocalDevHost(api.hostname) && isLocalDevHost(page.hostname);
  } catch {
    return false;
  }
}

function isLoopbackConfiguredUrl(url: string): boolean {
  if (!url) {
    return false;
  }
  try {
    return isLocalDevHost(new URL(url).hostname);
  } catch {
    return false;
  }
}

function isProductionRuntime(): boolean {
  return process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
}

/** Ignore localhost API URL copied from .env when deployed (browser cannot reach it; CSP blocks it). */
function effectiveConfiguredApiUrl(raw: string): string {
  if (!raw) {
    return '';
  }
  if (isLoopbackConfiguredUrl(raw) && isProductionRuntime()) {
    return '';
  }
  return raw;
}

function resolveServerApiBaseUrl(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() ?? '';
  if (appUrl && !isLoopbackConfiguredUrl(appUrl)) {
    return appUrl;
  }
  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }
  return appUrl || 'http://localhost:3000';
}

/**
 * Resolves the API base URL for the current runtime.
 * Browser: relative paths when the configured API is this Next.js app (avoids CSP / origin mismatch).
 * Server: absolute URL required for self-fetch.
 */
export function resolveApiBaseUrl(): string {
  const configured = effectiveConfiguredApiUrl(process.env.NEXT_PUBLIC_API_URL?.trim() ?? '');

  if (typeof window === 'undefined') {
    return configured || resolveServerApiBaseUrl();
  }

  if (!configured) {
    return '';
  }

  try {
    const apiOrigin = new URL(configured).origin;
    if (apiOrigin === window.location.origin) {
      return '';
    }
    if (process.env.NODE_ENV === 'development' && isSameDevServer(apiOrigin, window.location.origin)) {
      return '';
    }
  } catch {
    return configured;
  }

  return configured;
}
