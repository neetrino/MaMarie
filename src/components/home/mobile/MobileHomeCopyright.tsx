'use client';

import Link from 'next/link';
import { FOOTER_COPYRIGHT_COMPANY_HREF } from '../../../constants/footer';
import {
  MOBILE_HOME_COPYRIGHT_COLOR,
  MOBILE_HOME_COPYRIGHT_FONT_SIZE_PX,
  MOBILE_HOME_COPYRIGHT_LINE_HEIGHT_PX,
  MOBILE_HOME_COPYRIGHT_PADDING_TOP_PX,
  MOBILE_HOME_HORIZONTAL_PADDING_PX,
} from '../../../constants/mobile-home';
import { useTranslation } from '../../../lib/i18n-client';

/** Compact copyright under mobile home banners (site footer is desktop-only). */
export function MobileHomeCopyright() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <p
      className="w-full text-center font-normal"
      style={{
        paddingTop: MOBILE_HOME_COPYRIGHT_PADDING_TOP_PX,
        paddingLeft: MOBILE_HOME_HORIZONTAL_PADDING_PX,
        paddingRight: MOBILE_HOME_HORIZONTAL_PADDING_PX,
        color: MOBILE_HOME_COPYRIGHT_COLOR,
        fontSize: MOBILE_HOME_COPYRIGHT_FONT_SIZE_PX,
        lineHeight: `${MOBILE_HOME_COPYRIGHT_LINE_HEIGHT_PX}px`,
      }}
    >
      {t('common.footer.copyrightPrefix').replace('{year}', String(year))}
      <Link
        href={FOOTER_COPYRIGHT_COMPANY_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold text-brand-pink transition-opacity hover:opacity-80"
      >
        {t('common.footer.copyrightCompany')}
      </Link>
      {t('common.footer.copyrightSuffix')}
    </p>
  );
}
