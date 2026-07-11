'use client';

import type { CSSProperties } from 'react';
import { ContactForm } from '../../components/contact/ContactForm';
import { ContactInfoBlock } from '../../components/contact/ContactInfoBlock';
import { ContactPageShell } from '../../components/contact/ContactPageShell';
import { CONTACT_FORM_SECTION_BG } from '../../constants/contact-form';
import {
  CONTACT_PAGE_ASSETS,
  CONTACT_PAGE_COLUMN_GAP_PX,
  CONTACT_PAGE_MOBILE_BG,
  CONTACT_PAGE_MOBILE_HORIZONTAL_PADDING_PX,
  CONTACT_PAGE_MOBILE_PADDING_BOTTOM_PX,
  CONTACT_PAGE_MOBILE_PADDING_RIGHT_PX,
  CONTACT_PAGE_MOBILE_PADDING_TOP_PX,
} from '../../constants/contact-page';
import { useTranslation } from '../../lib/i18n-client';

const contactMobilePageStyle = {
  paddingTop: CONTACT_PAGE_MOBILE_PADDING_TOP_PX,
  paddingBottom: CONTACT_PAGE_MOBILE_PADDING_BOTTOM_PX,
  paddingLeft: CONTACT_PAGE_MOBILE_HORIZONTAL_PADDING_PX,
  paddingRight: CONTACT_PAGE_MOBILE_PADDING_RIGHT_PX,
  backgroundColor: CONTACT_PAGE_MOBILE_BG,
} as CSSProperties;

const contactGridStyle = { gap: CONTACT_PAGE_COLUMN_GAP_PX } as CSSProperties;

function ContactPageContent() {
  const { t } = useTranslation();

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch"
      style={contactGridStyle}
    >
      <div className="flex w-full min-w-0 flex-col gap-8 max-lg:translate-x-4">
        <ContactInfoBlock iconSrc={CONTACT_PAGE_ASSETS.iconPhone} title={t('contact.callToUs.title')}>
          <p className="mb-2 text-gray-600">{t('contact.callToUs.description')}</p>
          <a href={`tel:${t('contact.phone')}`} className="font-medium text-gray-700 hover:text-gray-900">
            {t('contact.phone')}
          </a>
        </ContactInfoBlock>

        <ContactInfoBlock iconSrc={CONTACT_PAGE_ASSETS.iconMail} title={t('contact.writeToUs.title')}>
          <p className="mb-2 text-gray-600">{t('contact.writeToUs.description')}</p>
          <a href={`mailto:${t('contact.email')}`} className="font-medium text-gray-700 hover:text-gray-900">
            {t('contact.writeToUs.emailLabel')} {t('contact.email')}
          </a>
        </ContactInfoBlock>

        <ContactInfoBlock iconSrc={CONTACT_PAGE_ASSETS.iconLocation} title={t('contact.headquarter.title')}>
          <div className="mb-2 space-y-1 text-gray-600">
            <p>{t('contact.headquarter.hours.weekdays')}</p>
            <p>{t('contact.headquarter.hours.saturday')}</p>
          </div>
          <p className="font-medium text-gray-700">{t('contact.address')}</p>
        </ContactInfoBlock>
      </div>

      <div className="relative flex w-full min-w-0 overflow-visible max-lg:-mr-8 max-lg:w-[calc(100%+32px)]">
        <ContactForm />
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <div
        className="mobile-contact-page w-full max-w-full overflow-x-clip lg:hidden"
        style={contactMobilePageStyle}
      >
        <ContactPageShell variant="mobileTrack">
          <ContactPageContent />
        </ContactPageShell>
      </div>

      <div className="hidden bg-white lg:block">
        <div style={{ backgroundColor: CONTACT_FORM_SECTION_BG }}>
          <ContactPageShell>
            <ContactPageContent />
          </ContactPageShell>
        </div>
      </div>
    </>
  );
}
