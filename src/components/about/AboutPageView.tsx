'use client';

import { ABOUT_PAGE_BG } from '../../constants/about-page';
import { useTranslation } from '../../lib/i18n-client';
import { AboutPageDesktop, type AboutPageCopy } from './AboutPageDesktop';
import { AboutPageMobile } from './AboutPageMobile';

/**
 * About us page — Figma `300:576`. Header/footer come from root layout.
 */
export function AboutPageView() {
  const { t } = useTranslation();

  const copy: AboutPageCopy = {
    leadAfterLogo: t('about.description.leadAfterLogo'),
    body: t('about.description.paragraph2'),
    pinkParagraphs: [
      t('about.description.paragraph3'),
      t('about.description.paragraph4'),
    ],
    titleAlt: t('about.title'),
  };

  return (
    <div className="w-full bg-white" style={{ backgroundColor: ABOUT_PAGE_BG }}>
      <AboutPageDesktop copy={copy} />
      <AboutPageMobile copy={copy} />
    </div>
  );
}
