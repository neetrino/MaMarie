/**
 * Fit a natural aspect ratio inside a max width × height box (letterbox-free).
 * Returns CSS pixel size for the frame.
 */
export function resolveContainedFrameSizePx(
  aspectRatio: number,
  maxWidthPx: number,
  maxHeightPx: number,
): { widthPx: number; heightPx: number } {
  const safeAspect =
    Number.isFinite(aspectRatio) && aspectRatio > 0 ? aspectRatio : 1;

  let widthPx = maxWidthPx;
  let heightPx = widthPx / safeAspect;

  if (heightPx > maxHeightPx) {
    heightPx = maxHeightPx;
    widthPx = heightPx * safeAspect;
  }

  return {
    widthPx: Math.round(widthPx),
    heightPx: Math.round(heightPx),
  };
}
