'use client';

import {
  NOT_FOUND_CONTENT_MAX_WIDTH_PX,
  NOT_FOUND_SECTION_PADDING_BOTTOM_PX,
  NOT_FOUND_SECTION_PADDING_TOP_PX,
  NOT_FOUND_TITLE_COLOR,
  NOT_FOUND_TITLE_FONT_SIZE_PX,
  NOT_FOUND_TITLE_LINE_HEIGHT,
  NOT_FOUND_TITLE_TRACKING_PX,
} from '../../constants/not-found-page';
import { useTranslation } from '../../lib/i18n-client';
import { NotFoundActions } from './NotFoundActions';
import { NotFoundIllustrationScene } from './NotFoundIllustrationScene';
import './not-found-layout.css';

type NotFoundPageLayout = 'default' | 'standalone';

interface NotFoundPageContentProps {
  layout?: NotFoundPageLayout;
}

/** Figma `276:534` — clay 404 scene, title, and CTAs. */
export function NotFoundPageContent({ layout = 'default' }: NotFoundPageContentProps) {
  const { t } = useTranslation();
  const isStandalone = layout === 'standalone';

  return (
    <section
      className={`not-found-page relative flex w-full flex-1 flex-col overflow-visible bg-white ${
        isStandalone ? 'not-found-page--standalone justify-center' : 'max-lg:justify-start lg:justify-center'
      }`}
      style={
        isStandalone
          ? undefined
          : {
              paddingTop: NOT_FOUND_SECTION_PADDING_TOP_PX,
              paddingBottom: NOT_FOUND_SECTION_PADDING_BOTTOM_PX,
            }
      }
    >
      <div
        className="relative z-10 mx-auto flex w-full flex-col items-center px-4 sm:px-6"
        style={{ maxWidth: NOT_FOUND_CONTENT_MAX_WIDTH_PX }}
      >
        <NotFoundIllustrationScene />

        <div
          className="flex w-full flex-col items-center"
          style={{
            marginTop: 'var(--nf-copy-offset)',
            maxWidth: NOT_FOUND_CONTENT_MAX_WIDTH_PX,
          }}
        >
          <h1
            className="text-center font-semibold"
            style={{
              color: NOT_FOUND_TITLE_COLOR,
              fontSize: NOT_FOUND_TITLE_FONT_SIZE_PX,
              lineHeight: NOT_FOUND_TITLE_LINE_HEIGHT,
              letterSpacing: `${NOT_FOUND_TITLE_TRACKING_PX}px`,
              marginTop: 'var(--nf-ill-to-title)',
              transform: 'translateY(calc(-1 * var(--nf-title-lift)))',
            }}
          >
            {t('common.notFound.title')}
          </h1>

          <div
            className="flex w-full flex-col items-center"
            style={{ marginTop: 'var(--nf-title-actions)' }}
          >
            <NotFoundActions />
          </div>
        </div>
      </div>
    </section>
  );
}
