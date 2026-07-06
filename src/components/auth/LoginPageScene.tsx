import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import {
  LOGIN_CARD_INNER_BG,
  LOGIN_CARD_INNER_GAP_PX,
  LOGIN_CARD_INNER_RADIUS_PX,
  LOGIN_CARD_MAX_WIDTH_PX,
  LOGIN_CARD_OFFSET_TOP_PX,
  LOGIN_CARD_PADDING_X_PX,
  LOGIN_CARD_PADDING_Y_PX,
  LOGIN_DECO_BOW_LEFT_PX,
  LOGIN_DECO_BOW_SIZE_PX,
  LOGIN_DECO_BOW_TOP_PX,
  LOGIN_HEADING_GAP_PX,
  LOGIN_PAGE_ASSETS,
  LOGIN_PAGE_BG_COLOR,
  LOGIN_PAGE_BG_HEIGHT_PX,
  LOGIN_PAGE_SECTION_PADDING_BOTTOM_PX,
  LOGIN_PAGE_SECTION_PADDING_TOP_PX,
  LOGIN_PAGE_SECTION_PADDING_X_PX,
  LOGIN_SUBTITLE_COLOR,
  LOGIN_SUBTITLE_FONT_SIZE_PX,
  LOGIN_SUBTITLE_LINE_HEIGHT,
  LOGIN_TITLE_COLOR,
  LOGIN_TITLE_FONT_SIZE_PX,
  LOGIN_TITLE_LINE_HEIGHT,
  LOGIN_TITLE_TRACKING_PX,
} from '../../constants/login-page';
import { LoginPodFormBackground } from './LoginPodFormBackground';

interface LoginPageSceneProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const sectionStyle = {
  backgroundColor: LOGIN_PAGE_BG_COLOR,
  minHeight: LOGIN_PAGE_BG_HEIGHT_PX,
  paddingTop: LOGIN_PAGE_SECTION_PADDING_TOP_PX,
  paddingBottom: LOGIN_PAGE_SECTION_PADDING_BOTTOM_PX,
  paddingLeft: LOGIN_PAGE_SECTION_PADDING_X_PX,
  paddingRight: LOGIN_PAGE_SECTION_PADDING_X_PX,
} as CSSProperties;

/** Figma `222:491` — pod-form background, centered clay card, bow decoration. */
export function LoginPageScene({ title, subtitle, children }: LoginPageSceneProps) {
  return (
    <section className="relative w-full overflow-hidden" style={sectionStyle}>
      <LoginPodFormBackground />

      <div
        className="relative z-10 mx-auto flex w-full justify-center"
        style={{
          maxWidth: LOGIN_CARD_MAX_WIDTH_PX,
          marginTop: LOGIN_CARD_OFFSET_TOP_PX,
        }}
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
          className="relative flex w-full flex-col items-center"
          style={{
            maxWidth: LOGIN_CARD_MAX_WIDTH_PX,
            paddingLeft: LOGIN_CARD_PADDING_X_PX,
            paddingRight: LOGIN_CARD_PADDING_X_PX,
            paddingTop: LOGIN_CARD_PADDING_Y_PX,
            paddingBottom: LOGIN_CARD_PADDING_Y_PX,
            backgroundColor: LOGIN_CARD_INNER_BG,
            borderRadius: LOGIN_CARD_INNER_RADIUS_PX,
            gap: LOGIN_CARD_INNER_GAP_PX,
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
