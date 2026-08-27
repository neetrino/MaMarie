/**
 * Dev-only guard for React RSC performance instrumentation.
 * @see https://github.com/vercel/next.js/issues/86060
 */
export function register(): void {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const originalMeasure = performance.measure.bind(performance);

  performance.measure = ((...args: Parameters<typeof originalMeasure>) => {
    try {
      return originalMeasure(...args);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('cannot have a negative time stamp')
      ) {
        return undefined as unknown as PerformanceMeasure;
      }
      throw error;
    }
  }) as typeof performance.measure;
}
