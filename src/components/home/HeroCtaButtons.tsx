'use client';

import Link from 'next/link';
import { useTranslation } from '../../lib/i18n-client';
import {
  HERO_CTA_GAP_PX,
  HERO_CTA_PRIMARY_WIDTH_PX,
  HERO_CTA_SECONDARY_WIDTH_PX,
} from '../../constants/hero';

const CTA_HEIGHT_PX = 64;

export function HeroCtaButtons() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center" style={{ gap: HERO_CTA_GAP_PX }}>
      <Link
        href="/products"
        className="inline-flex h-16 items-center justify-center rounded-full bg-brand-pink text-base leading-7 text-white transition-opacity hover:opacity-90"
        style={{ width: HERO_CTA_PRIMARY_WIDTH_PX }}
      >
        {t('home.hero.ctaShopNow')}
      </Link>

      <Link
        href="/products"
        className="inline-flex h-16 items-center justify-center rounded-full border-2 border-brand-pink text-base leading-7 text-brand-pink transition-colors hover:bg-brand-pink/5"
        style={{ width: HERO_CTA_SECONDARY_WIDTH_PX }}
      >
        {t('home.hero.ctaNewCollection')}
      </Link>
    </div>
  );
}

export { CTA_HEIGHT_PX };
