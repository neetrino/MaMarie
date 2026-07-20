import Image from 'next/image';
import {
  ABOUT_PAGE_ASSETS,
  ABOUT_PAGE_BODY_LEFT_PX,
  ABOUT_PAGE_BODY_LINE_HEIGHT_PX,
  ABOUT_PAGE_BODY_TEXT_COLOR,
  ABOUT_PAGE_BODY_TEXT_SIZE_PX,
  ABOUT_PAGE_BODY_TOP_PX,
  ABOUT_PAGE_BODY_WIDTH_PX,
  ABOUT_PAGE_BUNNY_IMAGE_SIZE_PX,
  ABOUT_PAGE_BUNNY_LEFT_PX,
  ABOUT_PAGE_BUNNY_ROTATE_DEG,
  ABOUT_PAGE_BUNNY_TOP_PX,
  ABOUT_PAGE_BUNNY_WRAPPER_SIZE_PX,
  ABOUT_PAGE_CANVAS_HEIGHT_PX,
  ABOUT_PAGE_GALLERY_TOP_PX,
  ABOUT_PAGE_HERO_HEIGHT_PX,
  ABOUT_PAGE_HERO_IMG_HEIGHT_PERCENT,
  ABOUT_PAGE_HERO_IMG_LEFT_PERCENT,
  ABOUT_PAGE_HERO_IMG_TOP_PERCENT,
  ABOUT_PAGE_HERO_IMG_WIDTH_PERCENT,
  ABOUT_PAGE_HERO_OFFSET_X_PX,
  ABOUT_PAGE_HERO_RADIUS_PX,
  ABOUT_PAGE_HERO_TOP_PX,
  ABOUT_PAGE_HERO_WIDTH_PX,
  ABOUT_PAGE_IMAGE_QUALITY,
  ABOUT_PAGE_LEAD_LOGO_CROP_HEIGHT_PERCENT,
  ABOUT_PAGE_LEAD_LOGO_CROP_TOP_PERCENT,
  ABOUT_PAGE_LEAD_LOGO_HEIGHT_PX,
  ABOUT_PAGE_LEAD_LOGO_RAISE_PX,
  ABOUT_PAGE_LEAD_LOGO_TOP_PX,
  ABOUT_PAGE_LEAD_LOGO_WIDTH_PX,
  ABOUT_PAGE_LEAD_TEXT_COLOR,
  ABOUT_PAGE_LEAD_TEXT_LEFT_PX,
  ABOUT_PAGE_LEAD_TEXT_SIZE_PX,
  ABOUT_PAGE_LEAD_TEXT_WIDTH_PX,
  ABOUT_PAGE_MAX_WIDTH_PX,
  ABOUT_PAGE_TITLE_HEIGHT_PX,
  ABOUT_PAGE_TITLE_TOP_PX,
  ABOUT_PAGE_TITLE_WIDTH_PX,
} from '../../constants/about-page';
import { AboutDecoration } from './AboutDecoration';
import { AboutGallery } from './AboutGallery';

export interface AboutPageCopy {
  leadAfterLogo: string;
  body: string;
  pinkParagraphs: [string, string];
  titleAlt: string;
}

function AboutLeadBlock({ leadAfterLogo }: { leadAfterLogo: string }) {
  return (
    <p
      className="absolute m-0 font-normal leading-normal"
      style={{
        left: ABOUT_PAGE_LEAD_TEXT_LEFT_PX,
        top: ABOUT_PAGE_LEAD_LOGO_TOP_PX,
        width: ABOUT_PAGE_LEAD_TEXT_WIDTH_PX,
        color: ABOUT_PAGE_LEAD_TEXT_COLOR,
        fontSize: ABOUT_PAGE_LEAD_TEXT_SIZE_PX,
        zIndex: 10,
      }}
    >
      <span
        className="relative mr-1 inline-block shrink-0 overflow-hidden align-baseline"
        style={{
          width: ABOUT_PAGE_LEAD_LOGO_WIDTH_PX,
          height: ABOUT_PAGE_LEAD_LOGO_HEIGHT_PX,
          transform: `translateY(-${ABOUT_PAGE_LEAD_LOGO_RAISE_PX}px)`,
        }}
      >
        <Image
          src={ABOUT_PAGE_ASSETS.logoInline}
          alt=""
          width={ABOUT_PAGE_LEAD_LOGO_WIDTH_PX}
          height={ABOUT_PAGE_LEAD_LOGO_HEIGHT_PX}
          quality={ABOUT_PAGE_IMAGE_QUALITY}
          unoptimized
          className="pointer-events-none absolute left-0 w-full max-w-none"
          style={{
            height: `${ABOUT_PAGE_LEAD_LOGO_CROP_HEIGHT_PERCENT}%`,
            top: `${ABOUT_PAGE_LEAD_LOGO_CROP_TOP_PERCENT}%`,
            width: '100%',
          }}
        />
      </span>
      {leadAfterLogo}
    </p>
  );
}

function AboutHeroPortrait() {
  return (
    <div
      className="absolute left-1/2 overflow-hidden"
      style={{
        top: ABOUT_PAGE_HERO_TOP_PX,
        width: ABOUT_PAGE_HERO_WIDTH_PX,
        height: ABOUT_PAGE_HERO_HEIGHT_PX,
        marginLeft: ABOUT_PAGE_HERO_OFFSET_X_PX,
        borderRadius: ABOUT_PAGE_HERO_RADIUS_PX,
        transform: 'translateX(-50%)',
        zIndex: 1,
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
          sizes={`${ABOUT_PAGE_HERO_WIDTH_PX}px`}
          className="object-cover"
        />
      </div>
    </div>
  );
}

/**
 * Desktop About canvas — Figma `300:576` (minus global header/footer).
 */
export function AboutPageDesktop({ copy }: { copy: AboutPageCopy }) {
  return (
    <div
      className="relative mx-auto hidden w-full overflow-x-clip lg:block"
      style={{
        maxWidth: ABOUT_PAGE_MAX_WIDTH_PX,
        height: ABOUT_PAGE_CANVAS_HEIGHT_PX,
      }}
    >
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: ABOUT_PAGE_TITLE_TOP_PX,
          width: ABOUT_PAGE_TITLE_WIDTH_PX,
          height: ABOUT_PAGE_TITLE_HEIGHT_PX,
        }}
      >
        <Image
          src={ABOUT_PAGE_ASSETS.title}
          alt={copy.titleAlt}
          fill
          priority
          quality={ABOUT_PAGE_IMAGE_QUALITY}
          unoptimized
          sizes={`${ABOUT_PAGE_TITLE_WIDTH_PX}px`}
          className="object-contain"
        />
      </div>

      <AboutHeroPortrait />
      <AboutLeadBlock leadAfterLogo={copy.leadAfterLogo} />

      <AboutDecoration
        imageSrc={ABOUT_PAGE_ASSETS.decoBunny}
        layout={{
          leftPx: ABOUT_PAGE_BUNNY_LEFT_PX,
          topPx: ABOUT_PAGE_BUNNY_TOP_PX,
          wrapperSizePx: ABOUT_PAGE_BUNNY_WRAPPER_SIZE_PX,
          imageSizePx: ABOUT_PAGE_BUNNY_IMAGE_SIZE_PX,
          rotateDeg: ABOUT_PAGE_BUNNY_ROTATE_DEG,
          flipX: true,
          flipY: true,
          zIndex: 10,
        }}
      />

      <div
        className="absolute flex -translate-y-1/2 flex-col justify-center break-words font-normal"
        style={{
          left: ABOUT_PAGE_BODY_LEFT_PX,
          top: ABOUT_PAGE_BODY_TOP_PX,
          width: ABOUT_PAGE_BODY_WIDTH_PX,
          color: ABOUT_PAGE_BODY_TEXT_COLOR,
          fontSize: ABOUT_PAGE_BODY_TEXT_SIZE_PX,
          lineHeight: `${ABOUT_PAGE_BODY_LINE_HEIGHT_PX}px`,
          zIndex: 10,
        }}
      >
        <p className="m-0">{copy.body}</p>
      </div>

      <div
        className="absolute left-0 w-full"
        style={{ top: ABOUT_PAGE_GALLERY_TOP_PX, zIndex: 20 }}
      >
        <AboutGallery pinkParagraphs={copy.pinkParagraphs} />
      </div>
    </div>
  );
}
