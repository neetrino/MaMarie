/** Accept only Ameriabank vPOS Pay page URLs before leaving the shop. */
export function isSafeAmeriaPayUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      (parsed.protocol === 'https:' || parsed.protocol === 'http:') &&
      parsed.hostname.endsWith('ameriabank.am') &&
      parsed.pathname.includes('/Payments/Pay')
    );
  } catch {
    return false;
  }
}
