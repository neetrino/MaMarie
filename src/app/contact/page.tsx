'use client';

import { ContactForm } from '../../components/contact/ContactForm';
import { ContactInfoBlock } from '../../components/contact/ContactInfoBlock';
import { ContactPageShell } from '../../components/contact/ContactPageShell';
import { CONTACT_FORM_SECTION_BG } from '../../constants/contact-form';
import { CONTACT_PAGE_ASSETS, CONTACT_PAGE_COLUMN_GAP_PX } from '../../constants/contact-page';
import { useTranslation } from '../../lib/i18n-client';

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      <div style={{ backgroundColor: CONTACT_FORM_SECTION_BG }}>
        <ContactPageShell>
          <div
            className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch"
            style={{ gap: CONTACT_PAGE_COLUMN_GAP_PX }}
          >
            <div className="flex w-full min-w-0 flex-col gap-8">
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

            <div className="relative flex w-full min-w-0 overflow-visible">
              <ContactForm />
            </div>
          </div>
        </ContactPageShell>
      </div>
    </div>
  );
}
