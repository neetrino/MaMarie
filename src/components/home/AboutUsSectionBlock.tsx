'use client';

import {
  ABOUT_US_ASSETS,
  ABOUT_US_CARD_LEFT_TEXT_WIDTH_PX,
  ABOUT_US_CARD_LEFT_WIDTH_PX,
  ABOUT_US_CARD_PADDING_X_PX,
  ABOUT_US_CARD_PADDING_Y_PX,
  ABOUT_US_CARD_RADIUS_PX,
  ABOUT_US_BLOCK_MIN_HEIGHT_PX,
  ABOUT_US_CARD_WHITE_BG,
  ABOUT_US_CARD_WHITE_SHADOW,
  ABOUT_US_CARD_YELLOW_BG,
  ABOUT_US_CARD_YELLOW_LEFT_PX,
  ABOUT_US_CARD_YELLOW_TOP_PX,
  ABOUT_US_CARD_YELLOW_WIDTH_PX,
  ABOUT_US_CONTENT_GAP_PX,
  ABOUT_US_CONTENT_OFFSET_LEFT_PX,
  ABOUT_US_CONTENT_SHIFT_UP_PX,
  ABOUT_US_LOGO_CROP_HEIGHT_PERCENT,
  ABOUT_US_LOGO_CROP_LEFT_PERCENT,
  ABOUT_US_LOGO_CROP_TOP_PERCENT,
  ABOUT_US_LOGO_CROP_WIDTH_PERCENT,
  ABOUT_US_LOGO_HEIGHT_PX,
  ABOUT_US_LOGO_WIDTH_PX,
  ABOUT_US_RIGHT_COLUMN_HEIGHT_PX,
  ABOUT_US_RIGHT_COLUMN_WIDTH_PX,
  ABOUT_US_SIDE_CARD_DECORATIONS,
  ABOUT_US_STORY_CARD_BG,
  ABOUT_US_STORY_CARD_HEIGHT_PX,
  ABOUT_US_STORY_CARD_PADDING_X_PX,
  ABOUT_US_STORY_CARD_TOP_PX,
  ABOUT_US_STORY_CARD_WIDTH_PX,
  ABOUT_US_STORY_DECORATIONS,
  ABOUT_US_STORY_LOGO_TEXT_OFFSET_TOP_PX,
  ABOUT_US_STORY_TEXT_LINE_HEIGHT_PX,
  ABOUT_US_STORY_TEXT_TRACKING_PX,
  ABOUT_US_STORY_TEXT_WIDTH_PX,
  ABOUT_US_TEXT_COLOR,
  ABOUT_US_TEXT_LINE_HEIGHT_PX,
  ABOUT_US_TEXT_SIZE_PX,
  type AboutUsDecorationLayout,
} from '../../constants/about-us-section';
import { useTranslation } from '../../lib/i18n-client';

function AboutUsBrandLogo() {
  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{ width: ABOUT_US_LOGO_WIDTH_PX, height: ABOUT_US_LOGO_HEIGHT_PX }}
    >
      <img
        src={ABOUT_US_ASSETS.logoInline}
        alt=""
        className="pointer-events-none absolute max-w-none object-cover"
        style={{
          height: `${ABOUT_US_LOGO_CROP_HEIGHT_PERCENT}%`,
          width: `${ABOUT_US_LOGO_CROP_WIDTH_PERCENT}%`,
          left: `${ABOUT_US_LOGO_CROP_LEFT_PERCENT}%`,
          top: `${ABOUT_US_LOGO_CROP_TOP_PERCENT}%`,
        }}
      />
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
    layout.flipX ? 'scaleX(-1)' : '',
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
        width: layout.wrapperSizePx,
        height: layout.wrapperSizePx,
        zIndex: layout.zIndex,
      }}
    >
      <div
        className="relative shrink-0"
        style={{
          width: layout.imageSizePx,
          height: layout.imageSizePx,
          transform,
        }}
      >
        <img
          src={imageSrc}
          alt=""
          className="size-full object-cover"
          width={layout.imageSizePx}
          height={layout.imageSizePx}
        />
      </div>
    </div>
  );
}

function AboutUsSideCard({
  text,
  backgroundColor,
  widthPx,
}: {
  text: string;
  backgroundColor: string;
  widthPx: number;
}) {
  return (
    <article
      className="relative shrink-0"
      style={{
        width: widthPx,
        backgroundColor,
        borderRadius: ABOUT_US_CARD_RADIUS_PX,
        paddingLeft: ABOUT_US_CARD_PADDING_X_PX,
        paddingRight: ABOUT_US_CARD_PADDING_X_PX,
        paddingTop: ABOUT_US_CARD_PADDING_Y_PX,
        paddingBottom: ABOUT_US_CARD_PADDING_Y_PX,
        boxShadow: backgroundColor === ABOUT_US_CARD_WHITE_BG ? ABOUT_US_CARD_WHITE_SHADOW : undefined,
      }}
    >
      <p
        className="m-0 font-normal"
        style={{
          color: ABOUT_US_TEXT_COLOR,
          fontSize: ABOUT_US_TEXT_SIZE_PX,
          lineHeight: `${ABOUT_US_TEXT_LINE_HEIGHT_PX}px`,
          maxWidth: ABOUT_US_CARD_LEFT_TEXT_WIDTH_PX,
        }}
      >
        {text}
      </p>

      {ABOUT_US_SIDE_CARD_DECORATIONS.map((deco) => (
        <AboutUsDecoration key={deco.imageSrc} layout={deco} imageSrc={deco.imageSrc} />
      ))}
    </article>
  );
}

function AboutUsStoryColumn({
  storyLead,
  storyBody,
}: {
  storyLead: string;
  storyBody: string;
}) {
  return (
    <div
      className="relative shrink-0"
      style={{
        width: ABOUT_US_RIGHT_COLUMN_WIDTH_PX,
        height: ABOUT_US_RIGHT_COLUMN_HEIGHT_PX,
      }}
    >
      <article
        className="absolute left-0 flex flex-col justify-center"
        style={{
          top: ABOUT_US_STORY_CARD_TOP_PX,
          width: ABOUT_US_STORY_CARD_WIDTH_PX,
          height: ABOUT_US_STORY_CARD_HEIGHT_PX,
          borderRadius: ABOUT_US_CARD_RADIUS_PX,
          backgroundColor: ABOUT_US_STORY_CARD_BG,
          paddingLeft: ABOUT_US_STORY_CARD_PADDING_X_PX,
          paddingRight: ABOUT_US_STORY_CARD_PADDING_X_PX,
        }}
      >
        <div className="flow-root">
          <div
            className="float-left"
            style={{ marginTop: ABOUT_US_STORY_LOGO_TEXT_OFFSET_TOP_PX }}
          >
            <AboutUsBrandLogo />
          </div>
          <div style={{ maxWidth: ABOUT_US_STORY_TEXT_WIDTH_PX }}>
            <p
              className="m-0 font-normal"
              style={{
                color: ABOUT_US_TEXT_COLOR,
                fontSize: ABOUT_US_TEXT_SIZE_PX,
                lineHeight: `${ABOUT_US_STORY_TEXT_LINE_HEIGHT_PX}px`,
                letterSpacing: `${ABOUT_US_STORY_TEXT_TRACKING_PX}px`,
              }}
            >
              {storyLead}
            </p>
            <p
              className="m-0 font-normal"
              style={{
                color: ABOUT_US_TEXT_COLOR,
                fontSize: ABOUT_US_TEXT_SIZE_PX,
                lineHeight: `${ABOUT_US_STORY_TEXT_LINE_HEIGHT_PX}px`,
                letterSpacing: `${ABOUT_US_STORY_TEXT_TRACKING_PX}px`,
              }}
            >
              {storyBody}
            </p>
          </div>
        </div>
      </article>

      {ABOUT_US_STORY_DECORATIONS.map((deco) => (
        <AboutUsDecoration key={deco.imageSrc} layout={deco} imageSrc={deco.imageSrc} />
      ))}
    </div>
  );
}

export function AboutUsSectionBlock() {
  const { t } = useTranslation();

  return (
    <div
      className="relative w-full"
      style={{
        marginTop: -ABOUT_US_CONTENT_SHIFT_UP_PX,
        minHeight: ABOUT_US_BLOCK_MIN_HEIGHT_PX - ABOUT_US_CONTENT_SHIFT_UP_PX,
      }}
    >
      <div
        className="flex items-end"
        style={{
          marginLeft: ABOUT_US_CONTENT_OFFSET_LEFT_PX,
          gap: ABOUT_US_CONTENT_GAP_PX,
        }}
      >
        <AboutUsSideCard
          text={t('home.aboutUs.introText')}
          backgroundColor={ABOUT_US_CARD_WHITE_BG}
          widthPx={ABOUT_US_CARD_LEFT_WIDTH_PX}
        />
        <AboutUsStoryColumn
          storyLead={t('home.aboutUs.storyLead')}
          storyBody={t('home.aboutUs.storyBody')}
        />
      </div>

      <div
        className="absolute"
        style={{
          left: ABOUT_US_CARD_YELLOW_LEFT_PX,
          top: ABOUT_US_CARD_YELLOW_TOP_PX,
        }}
      >
        <AboutUsSideCard
          text={t('home.aboutUs.closingText')}
          backgroundColor={ABOUT_US_CARD_YELLOW_BG}
          widthPx={ABOUT_US_CARD_YELLOW_WIDTH_PX}
        />
      </div>
    </div>
  );
}
