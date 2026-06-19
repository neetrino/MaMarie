'use client';

import {
  FOOTER_COMPANY_COLUMN_WIDTH_PX,
  FOOTER_COMPANY_LINKS,
  FOOTER_CONTENT_GAP_PX,
  FOOTER_NAV_GAP_PX,
  FOOTER_SUPPORT_COLUMN_WIDTH_PX,
  FOOTER_SUPPORT_LINKS,
  FOOTER_TEXT_COLOR,
  FOOTER_TEXT_LINE_HEIGHT_PX,
  FOOTER_TEXT_SIZE_PX,
} from '../../constants/footer';
import { useTranslation } from '../../lib/i18n-client';
import { FooterBrandColumn } from './FooterBrandColumn';
import { FooterContactColumn } from './FooterContactColumn';
import { FooterLinksColumn } from './FooterLinksColumn';

export function FooterSiteContent() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <div className="relative z-10 flex w-full flex-col items-center" style={{ gap: FOOTER_CONTENT_GAP_PX }}>
      <div
        className="flex w-full flex-col flex-wrap gap-10 lg:flex-row lg:flex-nowrap lg:items-start"
        style={{ rowGap: 40, columnGap: FOOTER_NAV_GAP_PX }}
      >
        <FooterBrandColumn />
        <FooterLinksColumn
          titleKey="common.footer.companyTitle"
          links={FOOTER_COMPANY_LINKS}
          widthPx={FOOTER_COMPANY_COLUMN_WIDTH_PX}
        />
        <FooterLinksColumn
          titleKey="common.footer.supportTitle"
          links={FOOTER_SUPPORT_LINKS}
          widthPx={FOOTER_SUPPORT_COLUMN_WIDTH_PX}
        />
        <FooterContactColumn />
      </div>

      <p
        className="w-full text-center font-normal"
        style={{
          color: FOOTER_TEXT_COLOR,
          fontSize: FOOTER_TEXT_SIZE_PX,
          lineHeight: `${FOOTER_TEXT_LINE_HEIGHT_PX}px`,
        }}
      >
        {t('common.footer.copyrightPrefix').replace('{year}', String(year))}
        <span className="font-bold">{t('common.footer.copyrightCompany')}</span>
        {t('common.footer.copyrightSuffix')}
      </p>
    </div>
  );
}
