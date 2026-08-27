'use client';

import { useEffect, useState } from 'react';

/**
 * True when the primary input cannot hover (phones / most tablets).
 * MacBooks report maxTouchPoints > 0 for the trackpad — that alone must not
 * disable desktop product-card hover UI.
 */
function detectTouchDevice(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const canHoverFinePointer = window.matchMedia(
    '(hover: hover) and (pointer: fine)'
  ).matches;
  if (canHoverFinePointer) {
    return false;
  }

  return (
    window.matchMedia('(pointer: coarse)').matches ||
    navigator.maxTouchPoints > 0 ||
    'ontouchstart' in window
  );
}

/** True on iPad/phones — used to disable desktop product-card hover animations. */
export function useTouchDevice(): boolean {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(detectTouchDevice());
  }, []);

  return isTouchDevice;
}
