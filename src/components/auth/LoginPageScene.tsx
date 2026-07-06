import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import {
  LOGIN_CARD_INNER_RADIUS_PX,
  LOGIN_CARD_MAX_WIDTH_PX,
  LOGIN_CARD_PADDING_X_PX,
  LOGIN_CARD_PADDING_Y_MOBILE_PX,
  LOGIN_CARD_PADDING_Y_PX,
  LOGIN_DECO_BOW_LEFT_PX,
  LOGIN_DECO_BOW_SIZE_PX,
  LOGIN_DECO_BOW_TOP_PX,
  LOGIN_HEADING_GAP_PX,
  LOGIN_PAGE_ASSETS,
  LOGIN_PAGE_BG_HEIGHT_PX,
  LOGIN_PAGE_SECTION_PADDING_BOTTOM_MOBILE_PX,
  LOGIN_PAGE_SECTION_PADDING_BOTTOM_PX,
  LOGIN_PAGE_SECTION_PADDING_TOP_MOBILE_PX,
  LOGIN_PAGE_SECTION_PADDING_TOP_PX,
  LOGIN_PAGE_SECTION_PADDING_X_PX,
  LOGIN_SECTION_FOOTER_OVERLAP_PX,
  LOGIN_SUBTITLE_COLOR,
  LOGIN_SUBTITLE_FONT_SIZE_PX,
  LOGIN_SUBTITLE_LINE_HEIGHT,
  LOGIN_TITLE_COLOR,
  LOGIN_TITLE_FONT_SIZE_PX,
  LOGIN_TITLE_LINE_HEIGHT,
  LOGIN_TITLE_TRACKING_PX,
  SIGN_IN_CARD_OFFSET_TOP_MOBILE_PX,
  SIGN_IN_CARD_OFFSET_TOP_PX,
} from '../../constants/login-page';
import { LoginPodFormBackground } from './LoginPodFormBackground';

interface LoginPageSceneProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  cardMaxWidthPx?: number;
  sectionMinHeightPx?: number;
  cardOffsetTopPx?: number;
  cardOffsetTopMobilePx?: number;
}

const buildSceneStyle = (
  sectionMinHeightPx: number,
  cardOffsetTopPx: number,
  cardOffsetTopMobilePx: number,
): CSSProperties => ({
  minHeight: sectionMinHeightPx,
  paddingTop: LOGIN_PAGE_SECTION_PADDING_TOP_PX,
  paddingBottom: LOGIN_PAGE_SECTION_PADDING_BOTTOM_PX,
  paddingLeft: LOGIN_PAGE_SECTION_PADDING_X_PX,
  paddingRight: LOGIN_PAGE_SECTION_PADDING_X_PX,
  marginBottom: -LOGIN_SECTION_FOOTER_OVERLAP_PX,
  ['--auth-card-offset-top' as string]: `${cardOffsetTopPx}px`,
  ['--auth-card-offset-top-mobile' as string]: `${cardOffsetTopMobilePx}px`,
  ['--auth-section-padding-top-mobile' as string]: `${LOGIN_PAGE_SECTION_PADDING_TOP_MOBILE_PX}px`,
  ['--auth-section-padding-bottom-mobile' as string]: `${LOGIN_PAGE_SECTION_PADDING_BOTTOM_MOBILE_PX}px`,
  ['--auth-card-padding-y-mobile' as string]: `${LOGIN_CARD_PADDING_Y_MOBILE_PX}px`,
});

/** Figma `222:491` — pod-form background, centered clay card, bow decoration. */
export function LoginPageScene({
  title,
  subtitle,
  children,
  cardMaxWidthPx = LOGIN_CARD_MAX_WIDTH_PX,
  sectionMinHeightPx = LOGIN_PAGE_BG_HEIGHT_PX,
  cardOffsetTopPx = SIGN_IN_CARD_OFFSET_TOP_PX,
  cardOffsetTopMobilePx = SIGN_IN_CARD_OFFSET_TOP_MOBILE_PX,
}: LoginPageSceneProps) {
  return (
    <section
      className="mobile-auth-page auth-page-scene relative w-full overflow-visible max-lg:!mb-0 max-lg:!min-h-0 max-lg:!pb-0 max-lg:!pt-4 lg:bg-white"
      style={buildSceneStyle(sectionMinHeightPx, cardOffsetTopPx, cardOffsetTopMobilePx)}
    >
      <LoginPodFormBackground />

      <div
        className="auth-page-card-offset relative z-10 mx-auto flex w-full justify-center overflow-visible"
        style={{ maxWidth: cardMaxWidthPx }}
      >
        <div
          className="pointer-events-none absolute hidden sm:block"
          style={{
            top: LOGIN_DECO_BOW_TOP_PX,
            left: LOGIN_DECO_BOW_LEFT_PX,
            width: LOGIN_DECO_BOW_SIZE_PX,
            height: LOGIN_DECO_BOW_SIZE_PX,
          }}
        >
          <Image
            src={LOGIN_PAGE_ASSETS.bow}
            alt=""
            fill
            className="object-contain"
            sizes={`${LOGIN_DECO_BOW_SIZE_PX}px`}
            aria-hidden
          />
        </div>

        <div
          className="auth-page-card relative flex w-full flex-col items-center gap-6 bg-white max-lg:!px-7 max-lg:!py-8 max-lg:shadow-sm max-lg:ring-1 max-lg:ring-gray-200/70 lg:gap-[22px] lg:bg-[#f4f4f4]"
          style={{
            maxWidth: cardMaxWidthPx,
            paddingLeft: LOGIN_CARD_PADDING_X_PX,
            paddingRight: LOGIN_CARD_PADDING_X_PX,
            paddingTop: LOGIN_CARD_PADDING_Y_PX,
            paddingBottom: LOGIN_CARD_PADDING_Y_PX,
            borderRadius: LOGIN_CARD_INNER_RADIUS_PX,
          }}
        >
          <div
            className="flex w-full flex-col items-center text-center"
            style={{ gap: LOGIN_HEADING_GAP_PX }}
          >
            <h1
              className="font-semibold"
              style={{
                fontSize: LOGIN_TITLE_FONT_SIZE_PX,
                lineHeight: LOGIN_TITLE_LINE_HEIGHT,
                color: LOGIN_TITLE_COLOR,
                letterSpacing: `${LOGIN_TITLE_TRACKING_PX}px`,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: LOGIN_SUBTITLE_FONT_SIZE_PX,
                lineHeight: LOGIN_SUBTITLE_LINE_HEIGHT,
                color: LOGIN_SUBTITLE_COLOR,
              }}
            >
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </div>
    </section>
  );
}
