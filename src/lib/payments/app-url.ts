/**
 * Public app base URL for payment callbacks (no trailing slash).
 */
export function getAppUrl(): string {
  const fromAppUrl = process.env.APP_URL?.trim();
  if (fromAppUrl) {
    return fromAppUrl.replace(/\/$/, '');
  }

  const fromPublic = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromPublic) {
    return fromPublic.replace(/\/$/, '');
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  throw new Error('APP_URL or NEXT_PUBLIC_APP_URL must be set for payment callbacks');
}
