import Image from 'next/image';
import {
  ABOUT_PAGE_ASSETS,
  ABOUT_PAGE_BODY_TEXT_COLOR,
  ABOUT_PAGE_HERO_IMG_HEIGHT_PERCENT,
  ABOUT_PAGE_HERO_IMG_LEFT_PERCENT,
  ABOUT_PAGE_HERO_IMG_TOP_PERCENT,
  ABOUT_PAGE_HERO_IMG_WIDTH_PERCENT,
  ABOUT_PAGE_IMAGE_QUALITY,
  ABOUT_PAGE_LEAD_TEXT_COLOR,
  ABOUT_PAGE_MOBILE_BG,
  ABOUT_PAGE_MOBILE_BODY_LINE_HEIGHT_PX,
  ABOUT_PAGE_MOBILE_BODY_TEXT_SIZE_PX,
  ABOUT_PAGE_MOBILE_CARD_PADDING_BOTTOM_PX,
  ABOUT_PAGE_MOBILE_CARD_PADDING_TOP_PX,
  ABOUT_PAGE_MOBILE_CARD_PADDING_X_PX,
  ABOUT_PAGE_MOBILE_CARD_RADIUS_PX,
  ABOUT_PAGE_MOBILE_CARD_WIDTH_PX,
  ABOUT_PAGE_MOBILE_CLOSING_LINE_HEIGHT_PX,
  ABOUT_PAGE_MOBILE_CLOSING_PADDING_TOP_PX,
  ABOUT_PAGE_MOBILE_CLOSING_TEXT_SIZE_PX,
  ABOUT_PAGE_MOBILE_HERO_HEIGHT_PX,
  ABOUT_PAGE_MOBILE_HERO_OFFSET_X_PX,
  ABOUT_PAGE_MOBILE_HERO_OVERLAP_TITLE_PX,
  ABOUT_PAGE_MOBILE_HERO_RADIUS_PX,
  ABOUT_PAGE_MOBILE_HERO_WIDTH_PX,
  ABOUT_PAGE_MOBILE_LEAD_GAP_PX,
  ABOUT_PAGE_MOBILE_LEAD_LOGO_CROP_HEIGHT_PERCENT,
  ABOUT_PAGE_MOBILE_LEAD_LOGO_CROP_LEFT_PERCENT,
  ABOUT_PAGE_MOBILE_LEAD_LOGO_CROP_TOP_PERCENT,
  ABOUT_PAGE_MOBILE_LEAD_LOGO_CROP_WIDTH_PERCENT,
  ABOUT_PAGE_MOBILE_LEAD_LOGO_HEIGHT_PX,
  ABOUT_PAGE_MOBILE_LEAD_LOGO_WIDTH_PX,
  ABOUT_PAGE_MOBILE_LEAD_TEXT_OFFSET_TOP_PX,
  ABOUT_PAGE_MOBILE_MAX_WIDTH_PX,
  ABOUT_PAGE_MOBILE_PADDING_BOTTOM_PX,
  ABOUT_PAGE_MOBILE_PADDING_TOP_PX,
  ABOUT_PAGE_MOBILE_PADDING_X_PX,
  ABOUT_PAGE_MOBILE_PHOTO_HEIGHT_PX,
  ABOUT_PAGE_MOBILE_PHOTO_IMG_HEIGHT_PERCENT,
  ABOUT_PAGE_MOBILE_PHOTO_IMG_LEFT_PERCENT,
  ABOUT_PAGE_MOBILE_PHOTO_IMG_TOP_PERCENT,
  ABOUT_PAGE_MOBILE_PHOTO_IMG_WIDTH_PERCENT,
  ABOUT_PAGE_MOBILE_PHOTO_TO_CLOSING_GAP_PX,
  ABOUT_PAGE_MOBILE_SECTION_GAP_PX,
  ABOUT_PAGE_MOBILE_STRAWBERRY_IMAGE_SIZE_PX,
  ABOUT_PAGE_MOBILE_STRAWBERRY_LEFT_PX,
  ABOUT_PAGE_MOBILE_STRAWBERRY_ROTATE_DEG,
  ABOUT_PAGE_MOBILE_STRAWBERRY_TOP_PX,
  ABOUT_PAGE_MOBILE_STRAWBERRY_WRAPPER_SIZE_PX,
  ABOUT_PAGE_MOBILE_STORY_CARD_GAP_PX,
  ABOUT_PAGE_MOBILE_STORY_CARD_PADDING_BOTTOM_PX,
  ABOUT_PAGE_MOBILE_STORY_TO_PHOTO_GAP_PX,
  ABOUT_PAGE_MOBILE_TITLE_HEIGHT_PX,
  ABOUT_PAGE_MOBILE_TITLE_WIDTH_PX,
} from '../../constants/about-page';
import { AboutDecoration } from './AboutDecoration';
import type { AboutPageCopy } from './AboutPageDesktop';

/**
 * Mobile About — Figma `324:616` (navbar from root layout).
 */
export function AboutPageMobile({ copy }: { copy: AboutPageCopy }) {
  const contentMaxWidth = `calc(100% - ${ABOUT_PAGE_MOBILE_PADDING_X_PX * 2}px)`;

  return (
    <div
      className="mobile-about-page w-full overflow-x-clip lg:hidden"
      style={{
        paddingTop: ABOUT_PAGE_MOBILE_PADDING_TOP_PX,
        paddingBottom: ABOUT_PAGE_MOBILE_PADDING_BOTTOM_PX,
        backgroundColor: ABOUT_PAGE_MOBILE_BG,
      }}
    >
      <div
        className="mx-auto w-full"
        style={{ maxWidth: ABOUT_PAGE_MOBILE_MAX_WIDTH_PX }}
      >
        <div
          className="relative mx-auto"
          style={{
            width: ABOUT_PAGE_MOBILE_TITLE_WIDTH_PX,
            height: ABOUT_PAGE_MOBILE_TITLE_HEIGHT_PX,
            maxWidth: contentMaxWidth,
          }}
        >
          <Image
            src={ABOUT_PAGE_ASSETS.title}
            alt={copy.titleAlt}
            fill
            priority
            quality={ABOUT_PAGE_IMAGE_QUALITY}
            unoptimized
            sizes={`${ABOUT_PAGE_MOBILE_TITLE_WIDTH_PX}px`}
            className="object-contain"
          />
        </div>

        <div
          className="relative left-1/2 overflow-hidden"
          style={{
            width: ABOUT_PAGE_MOBILE_HERO_WIDTH_PX,
            maxWidth: '115%',
            height: ABOUT_PAGE_MOBILE_HERO_HEIGHT_PX,
            marginTop: -ABOUT_PAGE_MOBILE_HERO_OVERLAP_TITLE_PX,
            borderRadius: ABOUT_PAGE_MOBILE_HERO_RADIUS_PX,
            transform: `translateX(calc(-50% + ${ABOUT_PAGE_MOBILE_HERO_OFFSET_X_PX}px))`,
          }}
        >
          <div
            className="pointer-events-none absolute"
            style={{
              width: `${ABOUT_PAGE_HERO_IMG_WIDTH_PERCENT}%`,
              height: `${ABOUT_PAGE_HERO_IMG_HEIGHT_PERCENT}%`,
              left: `${ABOUT_PAGE_HERO_IMG_LEFT_PERCENT}%`,
              top: `${ABOUT_PAGE_HERO_IMG_TOP_PERCENT}%`,
            }}
          >
            <Image
              src={ABOUT_PAGE_ASSETS.hero}
              alt=""
              fill
              priority
              quality={ABOUT_PAGE_IMAGE_QUALITY}
              unoptimized
              sizes={`${ABOUT_PAGE_MOBILE_HERO_WIDTH_PX}px`}
              className="object-cover"
            />
          </div>
        </div>

        <div
          className="relative z-10 mx-auto"
          style={{
            width: ABOUT_PAGE_MOBILE_CARD_WIDTH_PX,
            maxWidth: contentMaxWidth,
            marginTop: ABOUT_PAGE_MOBILE_SECTION_GAP_PX,
            borderTopLeftRadius: ABOUT_PAGE_MOBILE_CARD_RADIUS_PX,
            borderTopRightRadius: ABOUT_PAGE_MOBILE_CARD_RADIUS_PX,
            backgroundColor: '#ffffff',
            paddingLeft: ABOUT_PAGE_MOBILE_CARD_PADDING_X_PX,
            paddingRight: ABOUT_PAGE_MOBILE_CARD_PADDING_X_PX,
            paddingTop: ABOUT_PAGE_MOBILE_CARD_PADDING_TOP_PX,
            paddingBottom: ABOUT_PAGE_MOBILE_STORY_CARD_PADDING_BOTTOM_PX,
          }}
        >
          <div className="flex items-start" style={{ gap: ABOUT_PAGE_MOBILE_LEAD_GAP_PX }}>
            <span
              className="relative shrink-0 overflow-hidden"
              style={{
                width: ABOUT_PAGE_MOBILE_LEAD_LOGO_WIDTH_PX,
                height: ABOUT_PAGE_MOBILE_LEAD_LOGO_HEIGHT_PX,
              }}
            >
              <Image
                src={ABOUT_PAGE_ASSETS.logoInline}
                alt=""
                width={ABOUT_PAGE_MOBILE_LEAD_LOGO_WIDTH_PX}
                height={ABOUT_PAGE_MOBILE_LEAD_LOGO_HEIGHT_PX}
                quality={ABOUT_PAGE_IMAGE_QUALITY}
                unoptimized
                className="pointer-events-none absolute max-w-none"
                style={{
                  height: `${ABOUT_PAGE_MOBILE_LEAD_LOGO_CROP_HEIGHT_PERCENT}%`,
                  width: `${ABOUT_PAGE_MOBILE_LEAD_LOGO_CROP_WIDTH_PERCENT}%`,
                  left: `${ABOUT_PAGE_MOBILE_LEAD_LOGO_CROP_LEFT_PERCENT}%`,
                  top: `${ABOUT_PAGE_MOBILE_LEAD_LOGO_CROP_TOP_PERCENT}%`,
                }}
              />
            </span>
            <p
              className="m-0 min-w-0 flex-1 font-normal"
              style={{
                color: ABOUT_PAGE_LEAD_TEXT_COLOR,
                fontSize: ABOUT_PAGE_MOBILE_BODY_TEXT_SIZE_PX,
                lineHeight: 1.548,
                marginTop: ABOUT_PAGE_MOBILE_LEAD_TEXT_OFFSET_TOP_PX,
              }}
            >
              {copy.leadLine1}
              <br />
              {copy.leadLine2}
            </p>
          </div>

          <p
            className="m-0 font-normal"
            style={{
              marginTop: ABOUT_PAGE_MOBILE_STORY_CARD_GAP_PX,
              color: ABOUT_PAGE_BODY_TEXT_COLOR,
              fontSize: ABOUT_PAGE_MOBILE_BODY_TEXT_SIZE_PX,
              lineHeight: `${ABOUT_PAGE_MOBILE_BODY_LINE_HEIGHT_PX}px`,
            }}
          >
            {copy.body}
          </p>
        </div>

        <div
          className="relative z-20 mx-auto overflow-visible"
          style={{
            width: ABOUT_PAGE_MOBILE_CARD_WIDTH_PX,
            maxWidth: contentMaxWidth,
            marginTop: ABOUT_PAGE_MOBILE_STORY_TO_PHOTO_GAP_PX,
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              height: ABOUT_PAGE_MOBILE_PHOTO_HEIGHT_PX,
              borderRadius: ABOUT_PAGE_MOBILE_CARD_RADIUS_PX,
            }}
          >
            <div
              className="pointer-events-none absolute"
              style={{
                width: `${ABOUT_PAGE_MOBILE_PHOTO_IMG_WIDTH_PERCENT}%`,
                height: `${ABOUT_PAGE_MOBILE_PHOTO_IMG_HEIGHT_PERCENT}%`,
                left: `${ABOUT_PAGE_MOBILE_PHOTO_IMG_LEFT_PERCENT}%`,
                top: `${ABOUT_PAGE_MOBILE_PHOTO_IMG_TOP_PERCENT}%`,
              }}
            >
              <Image
                src={ABOUT_PAGE_ASSETS.gallery2}
                alt=""
                fill
                quality={ABOUT_PAGE_IMAGE_QUALITY}
                unoptimized
                sizes={`${ABOUT_PAGE_MOBILE_CARD_WIDTH_PX}px`}
                className="object-cover"
              />
            </div>
          </div>

          <AboutDecoration
            imageSrc={ABOUT_PAGE_ASSETS.decoStrawberry}
            layout={{
              leftPx: ABOUT_PAGE_MOBILE_STRAWBERRY_LEFT_PX,
              topPx: ABOUT_PAGE_MOBILE_STRAWBERRY_TOP_PX,
              wrapperSizePx: ABOUT_PAGE_MOBILE_STRAWBERRY_WRAPPER_SIZE_PX,
              imageSizePx: ABOUT_PAGE_MOBILE_STRAWBERRY_IMAGE_SIZE_PX,
              rotateDeg: ABOUT_PAGE_MOBILE_STRAWBERRY_ROTATE_DEG,
              zIndex: 30,
            }}
          />
        </div>

        <div
          className="relative z-20 mx-auto"
          style={{
            width: ABOUT_PAGE_MOBILE_CARD_WIDTH_PX,
            maxWidth: contentMaxWidth,
            marginTop: ABOUT_PAGE_MOBILE_PHOTO_TO_CLOSING_GAP_PX,
            borderRadius: ABOUT_PAGE_MOBILE_CARD_RADIUS_PX,
            backgroundColor: '#ffffff',
            paddingLeft: ABOUT_PAGE_MOBILE_CARD_PADDING_X_PX,
            paddingRight: ABOUT_PAGE_MOBILE_CARD_PADDING_X_PX,
            paddingTop: ABOUT_PAGE_MOBILE_CLOSING_PADDING_TOP_PX,
            paddingBottom: ABOUT_PAGE_MOBILE_CARD_PADDING_BOTTOM_PX,
          }}
        >
          <p
            className="m-0 whitespace-pre-wrap font-normal"
            style={{
              color: ABOUT_PAGE_BODY_TEXT_COLOR,
              fontSize: ABOUT_PAGE_MOBILE_CLOSING_TEXT_SIZE_PX,
              lineHeight: `${ABOUT_PAGE_MOBILE_CLOSING_LINE_HEIGHT_PX}px`,
            }}
          >
            {copy.pinkParagraphs[0]}
            {'\n\n'}
            {copy.pinkParagraphs[1]}
          </p>
        </div>
      </div>
    </div>
  );
}
