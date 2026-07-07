import { logger } from "@/lib/utils/logger";

/** When true, emits structured PDP cold-path timing logs (development / profiling only). */
export function isPdpTimingEnabled(): boolean {
  return process.env.PDP_DEBUG_TIMING === "true";
}

/**
 * Runs an async PDP step and logs duration when {@link isPdpTimingEnabled}.
 */
export async function measurePdpStep<T>(
  slug: string,
  step: string,
  fn: () => Promise<T>,
): Promise<T> {
  if (!isPdpTimingEnabled()) {
    return fn();
  }

  const start = performance.now();
  try {
    return await fn();
  } finally {
    logger.info("[PDP_TIMING]", {
      slug,
      step,
      durationMs: Math.round(performance.now() - start),
    });
  }
}

/** Logs elapsed time for a synchronous PDP step. */
export function logPdpStep(slug: string, step: string, durationMs: number): void {
  if (!isPdpTimingEnabled()) {
    return;
  }
  logger.info("[PDP_TIMING]", { slug, step, durationMs: Math.round(durationMs) });
}
