'use client';

import { useTranslation } from '../../lib/i18n-client';
import { AboutPageDesktop, type AboutPageCopy } from './AboutPageDesktop';
import { AboutPageMobile } from './AboutPageMobile';

/**
 * About us page — Figma `300:576` desktop (from 744px / iPad) / `324:616` phone.
 * Header/footer come from root layout.
 */
export function AboutPageView() {
  const { t } = useTranslation();

  const copy: AboutPageCopy = {
    leadLine1: t('about.description.leadLine1'),
    leadLine2: t('about.description.leadLine2'),
    body: t('about.description.paragraph2'),
    pinkParagraphs: [
      t('about.description.paragraph3'),
      t('about.description.paragraph4'),
    ],
    titleAlt: t('about.title'),
  };

  return (
    <div className="about-page-root w-full">
      <AboutPageDesktop copy={copy} />
      <AboutPageMobile copy={copy} />
    </div>
  );
}
