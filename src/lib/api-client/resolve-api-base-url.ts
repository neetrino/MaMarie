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

/**
 * Resolves the API base URL for the current runtime.
 * Browser: relative paths when the configured API is this Next.js app (avoids CSP / origin mismatch).
 * Server: absolute URL required for self-fetch.
 */
export function resolveApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim() ?? '';

  if (typeof window === 'undefined') {
    return configured || process.env.NEXT_PUBLIC_APP_URL?.trim() || 'http://localhost:3000';
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
