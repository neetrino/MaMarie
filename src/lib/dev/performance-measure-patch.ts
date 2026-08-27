/**
 * Dev-only guard for React RSC performance instrumentation.
 * Imported synchronously so it runs before React hydrates the RSC payload.
 * @see https://github.com/vercel/next.js/issues/86060
 */
if (process.env.NODE_ENV === 'development' && typeof performance !== 'undefined') {
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
