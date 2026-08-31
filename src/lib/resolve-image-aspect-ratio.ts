export const DEFAULT_IMAGE_ASPECT_RATIO = 1;

/** Width / height from natural image metrics; falls back to square. */
export function resolveImageAspectRatio(width: number, height: number): number {
  if (width <= 0 || height <= 0) {
    return DEFAULT_IMAGE_ASPECT_RATIO;
  }

  return width / height;
}
