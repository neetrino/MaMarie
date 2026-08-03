import { PRODUCT_PDP_IMAGE_ZOOM_SWIPE_MIN_DISTANCE_PX } from './constants';

interface TouchPoint {
  x: number;
  y: number;
}

/** Horizontal swipe → previous/next; ignores mostly vertical gestures. */
export function resolveProductImageZoomSwipeDirection(
  start: TouchPoint,
  end: TouchPoint,
): 'previous' | 'next' | null {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;

  if (Math.abs(deltaX) < PRODUCT_PDP_IMAGE_ZOOM_SWIPE_MIN_DISTANCE_PX) {
    return null;
  }

  if (Math.abs(deltaX) <= Math.abs(deltaY)) {
    return null;
  }

  return deltaX < 0 ? 'next' : 'previous';
}
