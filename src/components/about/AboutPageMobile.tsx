import Image from 'next/image';
import {
  ABOUT_PAGE_ASSETS,
  ABOUT_PAGE_BODY_TEXT_COLOR,
  ABOUT_PAGE_GALLERY_PINK_BG,
  ABOUT_PAGE_IMAGE_QUALITY,
  ABOUT_PAGE_LEAD_GAP_PX,
  ABOUT_PAGE_LEAD_LOGO_CROP_HEIGHT_PERCENT,
  ABOUT_PAGE_LEAD_LOGO_CROP_LEFT_PERCENT,
  ABOUT_PAGE_LEAD_LOGO_CROP_TOP_PERCENT,
  ABOUT_PAGE_LEAD_LOGO_CROP_WIDTH_PERCENT,
  ABOUT_PAGE_LEAD_LOGO_HEIGHT_PX,
  ABOUT_PAGE_LEAD_LOGO_WIDTH_PX,
  ABOUT_PAGE_LEAD_TEXT_COLOR,
  ABOUT_PAGE_LEAD_TEXT_LINE_HEIGHT_PX,
  ABOUT_PAGE_LEAD_TEXT_OFFSET_TOP_PX,
  ABOUT_PAGE_LEAD_TEXT_SIZE_PX,
  ABOUT_PAGE_MOBILE_CARD_RADIUS_PX,
  ABOUT_PAGE_MOBILE_GALLERY_GAP_PX,
  ABOUT_PAGE_MOBILE_HERO_HEIGHT_PX,
  ABOUT_PAGE_MOBILE_HERO_MAX_WIDTH_PX,
  ABOUT_PAGE_MOBILE_PADDING_BOTTOM_PX,
  ABOUT_PAGE_MOBILE_PADDING_TOP_PX,
  ABOUT_PAGE_MOBILE_PADDING_X_PX,
  ABOUT_PAGE_MOBILE_PINK_PADDING_PX,
  ABOUT_PAGE_MOBILE_SECTION_GAP_PX,
  ABOUT_PAGE_MOBILE_TITLE_MAX_WIDTH_PX,
  ABOUT_PAGE_TITLE_HEIGHT_PX,
  ABOUT_PAGE_TITLE_WIDTH_PX,
} from '../../constants/about-page';
import type { AboutPageCopy } from './AboutPageDesktop';

/**
 * Stacked About layout for viewports below `lg`.
 */
export function AboutPageMobile({ copy }: { copy: AboutPageCopy }) {
  return (
    <div
      className="mx-auto flex w-full max-w-lg flex-col lg:hidden"
      style={{
        paddingLeft: ABOUT_PAGE_MOBILE_PADDING_X_PX,
        paddingRight: ABOUT_PAGE_MOBILE_PADDING_X_PX,
        paddingTop: ABOUT_PAGE_MOBILE_PADDING_TOP_PX,
        paddingBottom: ABOUT_PAGE_MOBILE_PADDING_BOTTOM_PX,
        gap: ABOUT_PAGE_MOBILE_SECTION_GAP_PX,
      }}
    >
      <div
        className="relative mx-auto w-full"
        style={{
          maxWidth: ABOUT_PAGE_MOBILE_TITLE_MAX_WIDTH_PX,
          aspectRatio: `${ABOUT_PAGE_TITLE_WIDTH_PX} / ${ABOUT_PAGE_TITLE_HEIGHT_PX}`,
        }}
      >
        <Image
          src={ABOUT_PAGE_ASSETS.title}
          alt={copy.titleAlt}
          fill
          priority
          quality={ABOUT_PAGE_IMAGE_QUALITY}
          unoptimized
          sizes="320px"
          className="object-contain"
        />
      </div>

      <div
        className="relative mx-auto w-full overflow-hidden"
        style={{
          maxWidth: ABOUT_PAGE_MOBILE_HERO_MAX_WIDTH_PX,
          height: ABOUT_PAGE_MOBILE_HERO_HEIGHT_PX,
          borderRadius: ABOUT_PAGE_MOBILE_CARD_RADIUS_PX,
        }}
      >
        <Image
          src={ABOUT_PAGE_ASSETS.hero}
          alt=""
          fill
          priority
          quality={ABOUT_PAGE_IMAGE_QUALITY}
          unoptimized
          sizes="320px"
          className="object-cover object-[center_20%]"
        />
      </div>

      <div className="flex items-start" style={{ gap: ABOUT_PAGE_LEAD_GAP_PX }}>
        <span
          className="relative shrink-0 overflow-hidden"
          style={{
            width: ABOUT_PAGE_LEAD_LOGO_WIDTH_PX,
            height: ABOUT_PAGE_LEAD_LOGO_HEIGHT_PX,
          }}
        >
          <Image
            src={ABOUT_PAGE_ASSETS.logoInline}
            alt=""
            width={ABOUT_PAGE_LEAD_LOGO_WIDTH_PX}
            height={ABOUT_PAGE_LEAD_LOGO_HEIGHT_PX}
            quality={ABOUT_PAGE_IMAGE_QUALITY}
            unoptimized
            className="pointer-events-none absolute max-w-none"
            style={{
              height: `${ABOUT_PAGE_LEAD_LOGO_CROP_HEIGHT_PERCENT}%`,
              width: `${ABOUT_PAGE_LEAD_LOGO_CROP_WIDTH_PERCENT}%`,
              left: `${ABOUT_PAGE_LEAD_LOGO_CROP_LEFT_PERCENT}%`,
              top: `${ABOUT_PAGE_LEAD_LOGO_CROP_TOP_PERCENT}%`,
            }}
          />
        </span>
        <p
          className="m-0 min-w-0 flex-1 font-normal"
          style={{
            color: ABOUT_PAGE_LEAD_TEXT_COLOR,
            fontSize: ABOUT_PAGE_LEAD_TEXT_SIZE_PX,
            lineHeight: `${ABOUT_PAGE_LEAD_TEXT_LINE_HEIGHT_PX}px`,
            marginTop: ABOUT_PAGE_LEAD_TEXT_OFFSET_TOP_PX,
          }}
        >
          {copy.leadLine1}
          <br />
          {copy.leadLine2}
        </p>
      </div>

      <p
        className="m-0 text-[15px] font-normal leading-5"
        style={{ color: ABOUT_PAGE_BODY_TEXT_COLOR }}
      >
        {copy.body}
      </p>

      <div
        className="grid grid-cols-1"
        style={{ gap: ABOUT_PAGE_MOBILE_GALLERY_GAP_PX }}
      >
        <MobilePhoto src={ABOUT_PAGE_ASSETS.gallery1} />
        <MobilePhoto src={ABOUT_PAGE_ASSETS.gallery2} />
        <div
          className="relative overflow-hidden text-white"
          style={{
            borderRadius: ABOUT_PAGE_MOBILE_CARD_RADIUS_PX,
            backgroundColor: ABOUT_PAGE_GALLERY_PINK_BG,
            padding: ABOUT_PAGE_MOBILE_PINK_PADDING_PX,
          }}
        >
          <p className="m-0 whitespace-pre-wrap text-base leading-snug">
            {copy.pinkParagraphs[0]}
            {'\n\n'}
            {copy.pinkParagraphs[1]}
          </p>
        </div>
        <MobilePhoto src={ABOUT_PAGE_ASSETS.gallery3} />
      </div>
    </div>
  );
}

function MobilePhoto({ src }: { src: string }) {
  return (
    <div
      className="relative aspect-[2/3] w-full overflow-hidden"
      style={{ borderRadius: ABOUT_PAGE_MOBILE_CARD_RADIUS_PX }}
    >
      <Image
        src={src}
        alt=""
        fill
        quality={ABOUT_PAGE_IMAGE_QUALITY}
        unoptimized
        sizes="100vw"
        className="object-cover"
      />
    </div>
  );
}
