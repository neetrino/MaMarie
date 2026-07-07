/**
 * Runs once when the Next.js server starts — warms DB before the first page request.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  const { ensureDbReady } = await import('@white-shop/db');
  await ensureDbReady().catch(() => {
    // Non-fatal at boot; the first request will establish the connection.
  });
}
