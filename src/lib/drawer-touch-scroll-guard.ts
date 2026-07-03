/** Attribute on drawer panels whose touch scroll must not be blocked by parent overlays. */
export const DRAWER_TOUCH_SCROLL_ROOT_ATTR = 'data-drawer-touch-scroll-root';

const DRAWER_TOUCH_SCROLL_ROOT_SELECTOR = `[${DRAWER_TOUCH_SCROLL_ROOT_ATTR}]`;

/**
 * Returns true when `target` is inside a drawer panel that should receive touch scroll
 * (including nested portaled sheets, e.g. order details over profile tab sheet).
 */
export function isTouchInsideDrawerScrollRoot(
  target: Node,
  extraRoots: ReadonlyArray<HTMLElement | null> = [],
): boolean {
  if (extraRoots.some((root) => root?.contains(target))) {
    return true;
  }

  if (target instanceof Element && target.closest(DRAWER_TOUCH_SCROLL_ROOT_SELECTOR)) {
    return true;
  }

  return false;
}

/** Blocks touchmove on the backdrop while allowing scroll inside drawer panels. */
export function preventTouchMoveUnlessInsideDrawer(
  event: TouchEvent,
  extraRoots: ReadonlyArray<HTMLElement | null> = [],
): void {
  const target = event.target;
  if (!(target instanceof Node)) {
    return;
  }

  if (!isTouchInsideDrawerScrollRoot(target, extraRoots)) {
    event.preventDefault();
  }
}
