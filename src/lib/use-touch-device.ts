'use client';

import { useEffect, useState } from 'react';

function detectTouchDevice(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
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
