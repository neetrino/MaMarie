'use client';

import {
  NOT_FOUND_CONTENT_MAX_WIDTH_PX,
  NOT_FOUND_ILLUSTRATION_TO_TITLE_GAP_PX,
  NOT_FOUND_SECTION_PADDING_BOTTOM_PX,
  NOT_FOUND_SECTION_PADDING_TOP_PX,
  NOT_FOUND_TITLE_COLOR,
  NOT_FOUND_TITLE_FONT_SIZE_PX,
  NOT_FOUND_TITLE_LIFT_PX,
  NOT_FOUND_TITLE_LINE_HEIGHT,
  NOT_FOUND_TITLE_TO_ACTIONS_GAP_PX,
  NOT_FOUND_TITLE_TRACKING_PX,
} from '../../constants/not-found-page';
import { useTranslation } from '../../lib/i18n-client';
import { NotFoundActions } from './NotFoundActions';
import { NotFoundIllustrationScene } from './NotFoundIllustrationScene';

/** Figma `276:534` — clay 404 scene, title, and CTAs. */
export function NotFoundPageContent() {
  const { t } = useTranslation();

  return (
    <section
      className="relative flex w-full flex-1 flex-col justify-center overflow-visible bg-white"
      style={{
        paddingTop: NOT_FOUND_SECTION_PADDING_TOP_PX,
        paddingBottom: NOT_FOUND_SECTION_PADDING_BOTTOM_PX,
      }}
    >
      <div
        className="relative z-10 mx-auto flex w-full flex-col items-center px-4 sm:px-6"
        style={{ maxWidth: NOT_FOUND_CONTENT_MAX_WIDTH_PX }}
      >
        <NotFoundIllustrationScene />

        <h1
          className="text-center font-semibold"
          style={{
            color: NOT_FOUND_TITLE_COLOR,
            fontSize: NOT_FOUND_TITLE_FONT_SIZE_PX,
            lineHeight: NOT_FOUND_TITLE_LINE_HEIGHT,
            letterSpacing: `${NOT_FOUND_TITLE_TRACKING_PX}px`,
            marginTop: NOT_FOUND_ILLUSTRATION_TO_TITLE_GAP_PX,
            transform: `translateY(-${NOT_FOUND_TITLE_LIFT_PX}px)`,
          }}
        >
          {t('common.notFound.title')}
        </h1>

        <div
          className="flex w-full flex-col items-center"
          style={{
            marginTop: NOT_FOUND_TITLE_TO_ACTIONS_GAP_PX,
            maxWidth: NOT_FOUND_CONTENT_MAX_WIDTH_PX,
          }}
        >
          <NotFoundActions />
        </div>
      </div>
    </section>
  );
}
