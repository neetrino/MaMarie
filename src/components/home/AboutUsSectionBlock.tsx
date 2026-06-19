'use client';

import Image from 'next/image';
import {
  ABOUT_US_ASSETS,
  ABOUT_US_CARD_LARGE_HEIGHT_PX,
  ABOUT_US_CARD_LARGE_PADDING_X_PX,
  ABOUT_US_CARD_LARGE_PADDING_Y_PX,
  ABOUT_US_CARD_LARGE_RADIUS_PX,
  ABOUT_US_CARD_LARGE_WIDTH_PX,
  ABOUT_US_CARD_SMALL_PADDING_X_PX,
  ABOUT_US_CARD_SMALL_PADDING_Y_PX,
  ABOUT_US_CARD_SMALL_RADIUS_PX,
  ABOUT_US_CARD_SMALL_WIDTH_PX,
  ABOUT_US_CONTENT_GAP_PX,
  ABOUT_US_LARGE_DECORATIONS,
  ABOUT_US_LOGO_CROP_HEIGHT_PERCENT,
  ABOUT_US_LOGO_CROP_LEFT_PERCENT,
  ABOUT_US_LOGO_CROP_TOP_PERCENT,
  ABOUT_US_LOGO_CROP_WIDTH_PERCENT,
  ABOUT_US_LOGO_HEIGHT_PX,
  ABOUT_US_LOGO_WIDTH_PX,
  ABOUT_US_RIGHT_CARD_TOP_PX,
  ABOUT_US_RIGHT_COLUMN_HEIGHT_PX,
  ABOUT_US_RIGHT_COLUMN_WIDTH_PX,
  ABOUT_US_SMALL_CARD_DECORATIONS,
  ABOUT_US_TEXT_COLOR,
  ABOUT_US_TEXT_LINE_HEIGHT_LARGE_PX,
  ABOUT_US_TEXT_LINE_HEIGHT_PX,
  ABOUT_US_TEXT_SIZE_PX,
  ABOUT_US_TEXT_TRACKING_LARGE_PX,
  type AboutUsDecorationLayout,
} from '../../constants/about-us-section';
import { useTranslation } from '../../lib/i18n-client';

function AboutUsBrandLogo() {
  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{ width: ABOUT_US_LOGO_WIDTH_PX, height: ABOUT_US_LOGO_HEIGHT_PX }}
    >
      <div
        className="pointer-events-none absolute max-w-none"
        style={{
          height: `${ABOUT_US_LOGO_CROP_HEIGHT_PERCENT}%`,
          width: `${ABOUT_US_LOGO_CROP_WIDTH_PERCENT}%`,
          left: `${ABOUT_US_LOGO_CROP_LEFT_PERCENT}%`,
          top: `${ABOUT_US_LOGO_CROP_TOP_PERCENT}%`,
        }}
      >
        <Image
          src={ABOUT_US_ASSETS.logoInline}
          alt=""
          fill
          sizes={`${ABOUT_US_LOGO_WIDTH_PX}px`}
          className="object-cover"
        />
      </div>
    </div>
  );
}

function AboutUsDecoration({
  layout,
  imageSrc,
}: {
  layout: AboutUsDecorationLayout;
  imageSrc: string;
}) {
  const transform = [
    layout.flipY ? 'scaleY(-1)' : '',
    layout.rotateDeg !== undefined ? `rotate(${layout.rotateDeg}deg)` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute flex items-center justify-center"
      style={{
        left: layout.leftPx,
        top: layout.topPx,
        width: layout.sizePx,
        height: layout.sizePx,
      }}
    >
      <div className="relative shrink-0" style={{ width: layout.sizePx, height: layout.sizePx, transform }}>
        <Image src={imageSrc} alt="" fill sizes={`${layout.sizePx}px`} className="object-cover" />
      </div>
    </div>
  );
}

function AboutUsSmallCard({ text }: { text: string }) {
  return (
    <article
      className="relative shrink-0 bg-white"
      style={{
        width: ABOUT_US_CARD_SMALL_WIDTH_PX,
        borderRadius: ABOUT_US_CARD_SMALL_RADIUS_PX,
        paddingLeft: ABOUT_US_CARD_SMALL_PADDING_X_PX,
        paddingRight: ABOUT_US_CARD_SMALL_PADDING_X_PX,
        paddingTop: ABOUT_US_CARD_SMALL_PADDING_Y_PX,
        paddingBottom: ABOUT_US_CARD_SMALL_PADDING_Y_PX,
      }}
    >
      <div className="flex flex-wrap items-start" style={{ gap: 4 }}>
        <AboutUsBrandLogo />
        <p
          className="min-w-0 flex-1 font-normal"
          style={{
            color: ABOUT_US_TEXT_COLOR,
            fontSize: ABOUT_US_TEXT_SIZE_PX,
            lineHeight: `${ABOUT_US_TEXT_LINE_HEIGHT_PX}px`,
          }}
        >
          {text}
        </p>
      </div>

      <AboutUsDecoration layout={ABOUT_US_SMALL_CARD_DECORATIONS[0]} imageSrc={ABOUT_US_ASSETS.decoBunny} />
      <AboutUsDecoration layout={ABOUT_US_SMALL_CARD_DECORATIONS[1]} imageSrc={ABOUT_US_ASSETS.decoShoes} />
    </article>
  );
}

function AboutUsLargeCard({ text }: { text: string }) {
  return (
    <div
      className="relative shrink-0"
      style={{
        width: ABOUT_US_RIGHT_COLUMN_WIDTH_PX,
        height: ABOUT_US_RIGHT_COLUMN_HEIGHT_PX,
      }}
    >
      <article
        className="absolute left-0 flex flex-col justify-center bg-white"
        style={{
          top: ABOUT_US_RIGHT_CARD_TOP_PX,
          width: ABOUT_US_CARD_LARGE_WIDTH_PX,
          height: ABOUT_US_CARD_LARGE_HEIGHT_PX,
          borderRadius: ABOUT_US_CARD_LARGE_RADIUS_PX,
          paddingLeft: ABOUT_US_CARD_LARGE_PADDING_X_PX,
          paddingRight: ABOUT_US_CARD_LARGE_PADDING_X_PX,
          paddingTop: ABOUT_US_CARD_LARGE_PADDING_Y_PX,
          paddingBottom: ABOUT_US_CARD_LARGE_PADDING_Y_PX,
        }}
      >
        <div className="flex flex-wrap items-start" style={{ gap: 4 }}>
          <AboutUsBrandLogo />
          <p
            className="min-w-0 flex-1 font-normal"
            style={{
              color: ABOUT_US_TEXT_COLOR,
              fontSize: ABOUT_US_TEXT_SIZE_PX,
              lineHeight: `${ABOUT_US_TEXT_LINE_HEIGHT_LARGE_PX}px`,
              letterSpacing: `${ABOUT_US_TEXT_TRACKING_LARGE_PX}px`,
            }}
          >
            {text}
          </p>
        </div>
      </article>

      {ABOUT_US_LARGE_DECORATIONS.map((deco) => (
        <AboutUsDecoration key={deco.imageSrc} layout={deco} imageSrc={deco.imageSrc} />
      ))}
    </div>
  );
}

export function AboutUsSectionBlock() {
  const { t } = useTranslation();

  return (
    <div
      className="flex w-full flex-col items-center gap-10 lg:flex-row lg:items-end lg:justify-center"
      style={{ gap: ABOUT_US_CONTENT_GAP_PX }}
    >
      <AboutUsSmallCard text={t('home.aboutUs.shortText')} />
      <AboutUsLargeCard text={t('home.aboutUs.longText')} />
    </div>
  );
}
