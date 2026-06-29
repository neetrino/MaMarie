'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  HEADER_CONTENT_CLEARANCE_MOBILE_PX,
} from '../../../constants/header';
import {
  MOBILE_HOME_ASSETS,
  MOBILE_HOME_GENDER_BOYS_BG,
  MOBILE_HOME_GENDER_BUTTON_GAP_PX,
  MOBILE_HOME_GENDER_BUTTON_HEIGHT_PX,
  MOBILE_HOME_GENDER_BUTTON_WIDTH_PX,
  MOBILE_HOME_GENDER_GIRLS_BG,
  MOBILE_HOME_HORIZONTAL_PADDING_PX,
  MOBILE_HOME_SALE_BANNER_BG,
  MOBILE_HOME_SALE_BANNER_HEIGHT_PX,
  MOBILE_HOME_SALE_BANNER_RADIUS_PX,
  MOBILE_HOME_SALE_TITLE_COLOR,
  MOBILE_HOME_SEARCH_HEIGHT_PX,
  MOBILE_HOME_SEARCH_RADIUS_PX,
} from '../../../constants/mobile-home';
import { useTranslation } from '../../../lib/i18n-client';

interface GenderCtaProps {
  href: string;
  label: string;
  backgroundColor: string;
}

function GenderCta({ href, label, backgroundColor }: GenderCtaProps) {
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
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/25">
        <Image src={MOBILE_HOME_ASSETS.chevronCta} alt="" width={20} height={20} />
      </span>
    </Link>
  );
}

export function MobileHomeHero() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleSearchFocus = () => {
    router.push('/products');
  };

  return (
    <section
      className="relative w-full"
      aria-label={t('home.hero.genderButtons.label')}
      style={{
        paddingTop: HEADER_CONTENT_CLEARANCE_MOBILE_PX + 16,
        paddingLeft: MOBILE_HOME_HORIZONTAL_PADDING_PX,
        paddingRight: MOBILE_HOME_HORIZONTAL_PADDING_PX,
      }}
    >
      <div className="relative mb-4">
        <label htmlFor="mobile-home-search" className="sr-only">
          {t('home.mobile.searchPlaceholder')}
        </label>
        <input
          id="mobile-home-search"
          type="search"
          readOnly
          onFocus={handleSearchFocus}
          placeholder={t('home.mobile.searchPlaceholder')}
          className="w-full border-none bg-white text-sm text-[rgba(0,0,0,0.72)] outline-none placeholder:text-[rgba(0,0,0,0.45)]"
          style={{
            height: MOBILE_HOME_SEARCH_HEIGHT_PX,
            borderRadius: MOBILE_HOME_SEARCH_RADIUS_PX,
            paddingLeft: 52,
            paddingRight: 16,
          }}
        />
        <Image
          src={MOBILE_HOME_ASSETS.search}
          alt=""
          width={28}
          height={28}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
        />
      </div>

      <div
        className="relative mx-auto mb-4 overflow-hidden"
        style={{
          maxWidth: 370,
          height: MOBILE_HOME_SALE_BANNER_HEIGHT_PX,
          borderRadius: MOBILE_HOME_SALE_BANNER_RADIUS_PX,
          backgroundColor: MOBILE_HOME_SALE_BANNER_BG,
        }}
      >
        <p
          className="absolute left-5 top-7 font-bold leading-[45px]"
          style={{ color: MOBILE_HOME_SALE_TITLE_COLOR, fontSize: 52 }}
        >
          {t('home.mobile.heroSale.label')}
        </p>
        <p
          className="absolute left-[18px] top-[74px] font-bold leading-[45px]"
          style={{ color: MOBILE_HOME_SALE_TITLE_COLOR, fontSize: 60 }}
        >
          {t('home.mobile.heroSale.discount')}
        </p>

        <Link
          href="/products"
          className="absolute bottom-4 left-[18px] flex w-44 items-center justify-between rounded-full bg-white py-1.5 pl-5 pr-2.5 text-sm font-medium text-brand-brown"
        >
          <span>{t('home.mobile.heroSale.cta')}</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow/40">
            <Image src={MOBILE_HOME_ASSETS.chevronCta} alt="" width={20} height={20} />
          </span>
        </Link>

        <Image
          src={MOBILE_HOME_ASSETS.saleHeroImage}
          alt=""
          width={279}
          height={288}
          className="pointer-events-none absolute -top-px left-1/2 -translate-x-1/2 rounded-md object-cover"
        />
      </div>

      <div
        className="scrollbar-hide flex overflow-x-auto pb-1"
        style={{ gap: MOBILE_HOME_GENDER_BUTTON_GAP_PX }}
        role="group"
        aria-label={t('home.hero.genderButtons.label')}
      >
        <GenderCta
          href="/products"
          label={t('home.hero.genderButtons.girls')}
          backgroundColor={MOBILE_HOME_GENDER_GIRLS_BG}
        />
        <GenderCta
          href="/products"
          label={t('home.hero.genderButtons.boys')}
          backgroundColor={MOBILE_HOME_GENDER_BOYS_BG}
        />
      </div>
    </section>
  );
}
