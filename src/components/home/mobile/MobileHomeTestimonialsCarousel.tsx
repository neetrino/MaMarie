'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  MOBILE_HOME_ASSETS,
  MOBILE_HOME_HORIZONTAL_PADDING_PX,
  MOBILE_HOME_TESTIMONIAL_BLUE_BG,
  MOBILE_HOME_TESTIMONIAL_CARD_HEIGHT_PX,
  MOBILE_HOME_TESTIMONIAL_CARD_RADIUS_PX,
  MOBILE_HOME_TESTIMONIAL_PROMO_BG,
  MOBILE_HOME_TESTIMONIAL_YELLOW_BG,
} from '../../../constants/mobile-home';
import { useTranslation } from '../../../lib/i18n-client';
import { MobileCarouselDots } from './MobileCarouselDots';
import { useHorizontalScrollIndex } from './useHorizontalScrollIndex';

const TESTIMONIAL_CARD_WIDTH_PX = 343;
const TESTIMONIAL_CARD_GAP_PX = 10;
const STAR_COUNT = 5;

function StarRow() {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: STAR_COUNT }, (_, index) => (
        <Image key={index} src={MOBILE_HOME_ASSETS.star} alt="" width={14} height={14} />
      ))}
    </div>
  );
}

interface TestimonialCardProps {
  quote: string;
  author: string;
  initial: string;
  backgroundColor: string;
}

function TestimonialCard({ quote, author, initial, backgroundColor }: TestimonialCardProps) {
  return (
    <article
      className="flex shrink-0 snap-start flex-col rounded-[30px] p-6 text-brand-brown"
      style={{
        width: TESTIMONIAL_CARD_WIDTH_PX,
        minHeight: MOBILE_HOME_TESTIMONIAL_CARD_HEIGHT_PX,
        borderRadius: MOBILE_HOME_TESTIMONIAL_CARD_RADIUS_PX,
        backgroundColor,
      }}
    >
      <StarRow />
      <p className="mt-4 text-sm leading-[22px]">{quote}</p>
      <div className="mt-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-pink text-sm font-bold text-white">
          {initial}
        </span>
        <p className="text-[13px] font-bold leading-5">{author}</p>
      </div>
    </article>
  );
}

function PromoCard() {
  const { t } = useTranslation();

  return (
    <article
      className="relative shrink-0 snap-start overflow-hidden rounded-[30px] text-brand-brown"
      style={{
        width: TESTIMONIAL_CARD_WIDTH_PX,
        height: MOBILE_HOME_TESTIMONIAL_CARD_HEIGHT_PX,
        borderRadius: MOBILE_HOME_TESTIMONIAL_CARD_RADIUS_PX,
        backgroundColor: MOBILE_HOME_TESTIMONIAL_PROMO_BG,
      }}
    >
      <span className="absolute left-6 top-6 inline-flex rounded-full bg-brand-yellow px-3 py-1.5 text-xs font-semibold leading-[18px] text-black">
        {t('home.mobile.testimonials.promoBadge')}
      </span>

      <p className="absolute left-6 top-[62px] max-w-[178px] text-xl font-bold leading-6 text-white">
        {t('home.mobile.testimonials.promoTitle')}
      </p>

      <Image
        src={MOBILE_HOME_ASSETS.promoImage}
        alt=""
        width={207}
        height={262}
        className="pointer-events-none absolute -top-14 right-0 rounded-br-[30px] object-cover"
      />

      <Link
        href="/products"
        className="absolute bottom-4 left-6 flex w-44 items-center justify-between rounded-full bg-white py-1.5 pl-5 pr-2.5 text-sm font-medium text-brand-brown"
      >
        <span>{t('home.mobile.heroSale.cta')}</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow/40">
          <Image src={MOBILE_HOME_ASSETS.chevronCta} alt="" width={20} height={20} />
        </span>
      </Link>
    </article>
  );
}

export function MobileHomeTestimonialsCarousel() {
  const { t } = useTranslation();
  const itemStridePx = TESTIMONIAL_CARD_WIDTH_PX + TESTIMONIAL_CARD_GAP_PX;
  const slideCount = 3;
  const { scrollRef, activeIndex } = useHorizontalScrollIndex({
    itemCount: slideCount,
    itemStridePx,
  });

  return (
    <section
      className="w-full max-w-full overflow-x-hidden"
      aria-label={t('home.whyUs.title')}
      style={{ paddingLeft: MOBILE_HOME_HORIZONTAL_PADDING_PX - 2, paddingRight: MOBILE_HOME_HORIZONTAL_PADDING_PX - 2 }}
    >
      <div
        ref={scrollRef}
        className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto pb-4"
        style={{ gap: TESTIMONIAL_CARD_GAP_PX }}
      >
        <TestimonialCard
          quote={t('home.mobile.testimonials.quote1')}
          author={t('home.mobile.testimonials.author1')}
          initial={t('home.mobile.testimonials.author1').charAt(0)}
          backgroundColor={MOBILE_HOME_TESTIMONIAL_BLUE_BG}
        />
        <PromoCard />
        <TestimonialCard
          quote={t('home.mobile.testimonials.quote2')}
          author={t('home.mobile.testimonials.author2')}
          initial={t('home.mobile.testimonials.author2').charAt(0)}
          backgroundColor={MOBILE_HOME_TESTIMONIAL_YELLOW_BG}
        />
      </div>

      <MobileCarouselDots
        count={slideCount}
        activeIndex={activeIndex}
        variant="pink"
        className="mt-2"
      />
    </section>
  );
}
