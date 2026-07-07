'use client';

import Link from 'next/link';
import { useTranslation } from '../../lib/i18n-client';
import { mergeStorefrontCatalogPrefetchProps } from '../../lib/storefront/storefront-catalog-prefetch';
import {
  HOME_GENDER_CATEGORY_SLUG,
  homeGenderCategoryProductsHref,
} from '../../constants/home-gender-categories';
import {
  HERO_GENDER_BUTTON_BOYS_BG_COLOR,
  HERO_GENDER_BUTTON_GIRLS_BG_COLOR,
  HERO_GENDER_BUTTON_GIRLS_WIDTH_PX,
  HERO_GENDER_BUTTONS_GAP_PX,
} from '../../constants/hero';
import { CLAY_PRIMARY_BUTTON_CLASS, getClayPrimaryButtonStyle } from '../../constants/clay-primary-button';

const genderButtonClassName = CLAY_PRIMARY_BUTTON_CLASS;

interface GenderButtonProps {
  href: string;
  label: string;
  backgroundColor: string;
  widthPx?: number;
}

function GenderButton({ href, label, backgroundColor, widthPx }: GenderButtonProps) {
  const prefetchProps = mergeStorefrontCatalogPrefetchProps(href);

  return (
    <Link
      href={href}
      className={genderButtonClassName}
      style={{
        ...getClayPrimaryButtonStyle(backgroundColor),
        width: widthPx,
      }}
      {...prefetchProps}
    >
      {label}
    </Link>
  );
}

/** Figma nodes `51:338`–`51:342` — girls / boys shop CTAs. */
export function HeroGenderButtons() {
  const { t } = useTranslation();

  return (
    <div
      className="flex flex-wrap items-center justify-center"
      style={{ gap: HERO_GENDER_BUTTONS_GAP_PX }}
      role="group"
      aria-label={t('home.hero.genderButtons.label')}
    >
      <GenderButton
        href={homeGenderCategoryProductsHref(HOME_GENDER_CATEGORY_SLUG.girls)}
        label={t('home.hero.genderButtons.girls')}
        backgroundColor={HERO_GENDER_BUTTON_GIRLS_BG_COLOR}
        widthPx={HERO_GENDER_BUTTON_GIRLS_WIDTH_PX}
      />
      <GenderButton
        href={homeGenderCategoryProductsHref(HOME_GENDER_CATEGORY_SLUG.boys)}
        label={t('home.hero.genderButtons.boys')}
        backgroundColor={HERO_GENDER_BUTTON_BOYS_BG_COLOR}
      />
    </div>
  );
}
