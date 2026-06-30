'use client';

import Image from 'next/image';
import Link from 'next/link';
import { HEADER_CONTENT_CLEARANCE_MOBILE_PX } from '../../../constants/header';
import {
  HOME_GENDER_CATEGORY_SLUG,
  homeGenderCategoryProductsHref,
} from '../../../constants/home-gender-categories';
import {
  MOBILE_HOME_ASSETS,
  MOBILE_HOME_GENDER_BOYS_BG,
  MOBILE_HOME_GENDER_BUTTON_GAP_PX,
  MOBILE_HOME_GENDER_BUTTON_HEIGHT_PX,
  MOBILE_HOME_GENDER_BUTTON_WIDTH_PX,
  MOBILE_HOME_GENDER_GIRLS_BG,
  MOBILE_HOME_HERO_GENDER_INSET_LEFT_PX,
  MOBILE_HOME_HERO_SALE_TO_GENDER_GAP_PX,
  MOBILE_HOME_HERO_SEARCH_TO_SALE_GAP_PX,
  MOBILE_HOME_HERO_TOP_PADDING_PX,
  MOBILE_HOME_HORIZONTAL_PADDING_PX,
} from '../../../constants/mobile-home';
import { useTranslation } from '../../../lib/i18n-client';
import { MobileHomeSaleBanner } from './MobileHomeSaleBanner';
import { MobileHomeSearchField } from './MobileHomeSearchField';

interface GenderCtaProps {
  href: string;
  label: string;
  backgroundColor: string;
  chevronSrc: string;
}

function GenderCta({ href, label, backgroundColor, chevronSrc }: GenderCtaProps) {
  return (
    <Link
      href={href}
      className="flex shrink-0 items-center justify-between rounded-full pl-5 pr-2.5 text-sm font-semibold leading-7 text-white"
      style={{
        width: MOBILE_HOME_GENDER_BUTTON_WIDTH_PX,
        height: MOBILE_HOME_GENDER_BUTTON_HEIGHT_PX,
        backgroundColor,
      }}
    >
      <span>{label}</span>
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
        <Image src={chevronSrc} alt="" width={20} height={20} className="rotate-90" />
      </span>
    </Link>
  );
}

export function MobileHomeHero() {
  const { t } = useTranslation();

  return (
    <section
      className="relative w-full max-w-full overflow-x-hidden"
      aria-label={t('home.hero.genderButtons.label')}
      style={{
        paddingTop: HEADER_CONTENT_CLEARANCE_MOBILE_PX + MOBILE_HOME_HERO_TOP_PADDING_PX,
      }}
    >
      <div
        className="relative"
        style={{
          paddingLeft: MOBILE_HOME_HORIZONTAL_PADDING_PX,
          paddingRight: MOBILE_HOME_HORIZONTAL_PADDING_PX,
          marginBottom: MOBILE_HOME_HERO_SEARCH_TO_SALE_GAP_PX,
        }}
      >
        <MobileHomeSearchField />
      </div>

      <div
        style={{
          paddingLeft: MOBILE_HOME_HORIZONTAL_PADDING_PX,
          paddingRight: MOBILE_HOME_HORIZONTAL_PADDING_PX,
          marginBottom: MOBILE_HOME_HERO_SALE_TO_GENDER_GAP_PX,
        }}
      >
        <MobileHomeSaleBanner />
      </div>

      <div
        className="scrollbar-hide flex overflow-x-auto pb-1 pr-[22px]"
        style={{
          gap: MOBILE_HOME_GENDER_BUTTON_GAP_PX,
          paddingLeft: MOBILE_HOME_HERO_GENDER_INSET_LEFT_PX,
        }}
        role="group"
        aria-label={t('home.hero.genderButtons.label')}
      >
        <GenderCta
          href={homeGenderCategoryProductsHref(HOME_GENDER_CATEGORY_SLUG.girls)}
          label={t('home.hero.genderButtons.girls')}
          backgroundColor={MOBILE_HOME_GENDER_GIRLS_BG}
          chevronSrc={MOBILE_HOME_ASSETS.genderChevronGirls}
        />
        <GenderCta
          href={homeGenderCategoryProductsHref(HOME_GENDER_CATEGORY_SLUG.boys)}
          label={t('home.hero.genderButtons.boys')}
          backgroundColor={MOBILE_HOME_GENDER_BOYS_BG}
          chevronSrc={MOBILE_HOME_ASSETS.genderChevronBoys}
        />
      </div>
    </section>
  );
}
