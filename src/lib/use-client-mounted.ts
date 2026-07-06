'use client';

import { useEffect, useState } from 'react';

/** True after the first client effect — use to defer browser-only DOM (autofill, etc.). */
export function useClientMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
