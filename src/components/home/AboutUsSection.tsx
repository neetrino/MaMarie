import Image from 'next/image';
import {
  ABOUT_US_CONTENT_MAX_WIDTH_PX,
  ABOUT_US_SECTION_MIN_HEIGHT_PX,
  ABOUT_US_SECTION_OFFSET_TOP_PX,
  ABOUT_US_SECTION_PADDING_BOTTOM_PX,
  ABOUT_US_SECTION_PADDING_TOP_PX,
  ABOUT_US_ASSETS,
} from '../../constants/about-us-section';
import { FOOTER_TOP_OVERLAP_PX } from '../../constants/footer';
import { HOME_SECTION_MAX_WIDTH_PX, HOME_SECTION_PADDING_LEFT_PX, HOME_SECTION_PADDING_RIGHT_PX } from '../../constants/home-sections';
import { AboutUsSectionBlock } from './AboutUsSectionBlock';

/**
 * About us background section — Figma node `1:150`.
 */
export function AboutUsSection() {
  return (
    <section
      className="relative w-full overflow-visible bg-white"
      style={{
        paddingTop: ABOUT_US_SECTION_OFFSET_TOP_PX,
        minHeight: ABOUT_US_SECTION_MIN_HEIGHT_PX,
      }}
    >
      <div
        className="absolute left-1/2 w-screen -translate-x-1/2"
        style={{
          top: 0,
          bottom: -FOOTER_TOP_OVERLAP_PX,
          left: '50%',
        }}
      >
        <Image
          src={ABOUT_US_ASSETS.sectionBg}
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div
        className="relative z-10 mx-auto w-full"
        style={{
          maxWidth: HOME_SECTION_MAX_WIDTH_PX,
          paddingLeft: HOME_SECTION_PADDING_LEFT_PX,
          paddingRight: HOME_SECTION_PADDING_RIGHT_PX,
          paddingTop: ABOUT_US_SECTION_PADDING_TOP_PX,
          paddingBottom: ABOUT_US_SECTION_PADDING_BOTTOM_PX,
        }}
      >
        <div className="w-full" style={{ maxWidth: ABOUT_US_CONTENT_MAX_WIDTH_PX }}>
          <AboutUsSectionBlock />
        </div>
      </div>
    </section>
  );
}
