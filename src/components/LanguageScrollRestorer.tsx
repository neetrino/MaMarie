'use client';

import { useEffect } from 'react';
import { takePendingLanguageScrollY } from '../lib/language';

/** Restores scroll position after client-side language switch (post React paint). */
export function LanguageScrollRestorer() {
  useEffect(() => {
    const restoreScroll = () => {
      const scrollY = takePendingLanguageScrollY();
      if (scrollY === null) {
        return;
      }

      window.setTimeout(() => {
        if (window.scrollY !== scrollY) {
          window.scrollTo({ top: scrollY, left: 0, behavior: 'auto' });
        }
      }, 0);
    };

    window.addEventListener('language-updated', restoreScroll);
    return () => {
      window.removeEventListener('language-updated', restoreScroll);
    };
  }, []);

  return null;
}
