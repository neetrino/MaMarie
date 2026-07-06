'use client';

import Image from 'next/image';
import {
  NOT_FOUND_ASSETS,
  NOT_FOUND_CONTENT_MAX_WIDTH_PX,
  NOT_FOUND_ILLUSTRATION_HEIGHT_PX,
  NOT_FOUND_ILLUSTRATION_MAX_WIDTH_PX,
  NOT_FOUND_ILLUSTRATION_WIDTH_PX,
  NOT_FOUND_SECTION_PADDING_BOTTOM_PX,
  NOT_FOUND_SECTION_PADDING_TOP_PX,
  NOT_FOUND_TITLE_COLOR,
  NOT_FOUND_TITLE_FONT_SIZE_PX,
  NOT_FOUND_TITLE_LINE_HEIGHT,
  NOT_FOUND_TITLE_TO_ACTIONS_GAP_PX,
} from '../../constants/not-found-page';
import { useTranslation } from '../../lib/i18n-client';
import { NotFoundActions } from './NotFoundActions';

/** Figma 404 page — clay illustration, title, and CTAs. */
export function NotFoundPageContent() {
  const { t } = useTranslation();

  return (
    <section
      className="relative flex w-full flex-1 flex-col justify-center overflow-hidden bg-white"
      style={{
        paddingTop: NOT_FOUND_SECTION_PADDING_TOP_PX,
        paddingBottom: NOT_FOUND_SECTION_PADDING_BOTTOM_PX,
      }}
    >
      <div
        className="relative z-10 mx-auto flex w-full flex-col items-center px-4 sm:px-6"
        style={{ maxWidth: NOT_FOUND_CONTENT_MAX_WIDTH_PX }}
      >
        <div className="w-full" style={{ maxWidth: NOT_FOUND_ILLUSTRATION_MAX_WIDTH_PX }}>
          <Image
            src={NOT_FOUND_ASSETS.illustration}
            alt=""
            width={NOT_FOUND_ILLUSTRATION_WIDTH_PX}
            height={NOT_FOUND_ILLUSTRATION_HEIGHT_PX}
            priority
            aria-hidden
            className="h-auto w-full object-contain"
          />
        </div>

        <h1
          className="mt-6 text-center font-bold"
          style={{
            color: NOT_FOUND_TITLE_COLOR,
            fontSize: NOT_FOUND_TITLE_FONT_SIZE_PX,
            lineHeight: NOT_FOUND_TITLE_LINE_HEIGHT,
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
