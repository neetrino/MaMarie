import {
  ABOUT_US_ASSETS,
  ABOUT_US_BG_IMAGE_HEIGHT_PX,
  ABOUT_US_BG_IMAGE_WIDTH_PX,
  ABOUT_US_BG_ROTATE_DEG,
  ABOUT_US_BG_WRAPPER_HEIGHT_PX,
  ABOUT_US_BG_WRAPPER_LEFT_PX,
  ABOUT_US_BG_WRAPPER_TOP_PX,
  ABOUT_US_BG_WRAPPER_WIDTH_PX,
  ABOUT_US_CONTENT_MAX_WIDTH_PX,
  ABOUT_US_SECTION_BG,
  ABOUT_US_SECTION_MIN_HEIGHT_PX,
  ABOUT_US_SECTION_OFFSET_TOP_PX,
  ABOUT_US_SECTION_PADDING_BOTTOM_PX,
  ABOUT_US_SECTION_PADDING_TOP_PX,
  ABOUT_US_SECTION_Z_INDEX,
  ABOUT_US_SHELL_PADDING_LEFT_PX,
  ABOUT_US_SHELL_PADDING_RIGHT_PX,
  ABOUT_US_CARD_DECORATION_OVERFLOW_TOP_PX,
  ABOUT_US_STRAWBERRY_DECORATION_Z_INDEX,
} from '../../constants/about-us-section';
import { HOME_SECTION_MAX_WIDTH_PX } from '../../constants/home-sections';
import { FooterStrawberryDecoration } from '../footer/FooterDecorations';
import { AboutUsSectionBlock } from './AboutUsSectionBlock';

/** Figma node `51:409` — rotated mother & child photo on white section (`51:408`). */
function AboutUsSectionPhoto() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-0 flex items-center justify-center"
      style={{
        left: ABOUT_US_BG_WRAPPER_LEFT_PX,
        top: ABOUT_US_BG_WRAPPER_TOP_PX,
        width: ABOUT_US_BG_WRAPPER_WIDTH_PX,
        height: ABOUT_US_BG_WRAPPER_HEIGHT_PX,
      }}
    >
      <div
        className="shrink-0"
        style={{ transform: `rotate(${ABOUT_US_BG_ROTATE_DEG}deg)` }}
      >
        <div
          className="relative"
          style={{
            width: ABOUT_US_BG_IMAGE_WIDTH_PX,
            height: ABOUT_US_BG_IMAGE_HEIGHT_PX,
          }}
        >
          <img
            src={ABOUT_US_ASSETS.sectionPhoto}
            alt=""
            className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
            width={ABOUT_US_BG_IMAGE_WIDTH_PX}
            height={ABOUT_US_BG_IMAGE_HEIGHT_PX}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * About us section — Figma node `51:408`.
 */
export function AboutUsSection() {
  return (
    <section
      className="relative w-full overflow-visible"
      style={{
        backgroundColor: ABOUT_US_SECTION_BG,
        paddingTop: ABOUT_US_SECTION_OFFSET_TOP_PX,
        minHeight: ABOUT_US_SECTION_MIN_HEIGHT_PX,
        zIndex: ABOUT_US_SECTION_Z_INDEX,
      }}
    >
      <div
        className="relative mx-auto w-full overflow-visible"
        style={{ maxWidth: HOME_SECTION_MAX_WIDTH_PX }}
      >
        <AboutUsSectionPhoto />

        <div
          className="relative z-10 w-full"
          style={{
            paddingLeft: ABOUT_US_SHELL_PADDING_LEFT_PX,
            paddingRight: ABOUT_US_SHELL_PADDING_RIGHT_PX,
            paddingTop: ABOUT_US_SECTION_PADDING_TOP_PX + ABOUT_US_CARD_DECORATION_OVERFLOW_TOP_PX,
            paddingBottom: ABOUT_US_SECTION_PADDING_BOTTOM_PX,
          }}
        >
          <div className="w-full" style={{ maxWidth: ABOUT_US_CONTENT_MAX_WIDTH_PX }}>
            <AboutUsSectionBlock />
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 overflow-visible"
        style={{ zIndex: ABOUT_US_STRAWBERRY_DECORATION_Z_INDEX }}
      >
        <FooterStrawberryDecoration />
      </div>
    </section>
  );
}
