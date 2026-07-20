'use client';

import { ProfileSideSheet } from '../../app/profile/components/ProfileSideSheet';
import { t } from '../../lib/i18n';
import type { LanguageCode } from '../../lib/language';
import { SizeGuideContent } from './SizeGuideContent';

type SizeGuideSideSheetProps = {
  isOpen: boolean;
  language: LanguageCode;
  onClose: () => void;
};

/** PDP size chart — slides in as a storefront side sheet. */
export function SizeGuideSideSheet({ isOpen, language, onClose }: SizeGuideSideSheetProps) {
  return (
    <ProfileSideSheet
      isOpen={isOpen}
      title={t(language, 'product.sizeGuide.title')}
      subtitle={t(language, 'product.sizeGuide.subtitle')}
      closeLabel={t(language, 'common.buttons.close')}
      onClose={onClose}
    >
      <SizeGuideContent language={language} />
    </ProfileSideSheet>
  );
}
