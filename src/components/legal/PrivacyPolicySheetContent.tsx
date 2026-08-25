'use client';

import { STORE_EMAIL, STORE_EMAIL_HREF } from '@/constants/store-contact';
import {
  LEGAL_POLICY_SHEET_BODY_CLASS,
  LEGAL_POLICY_SHEET_LIST_CLASS,
  LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS,
  LEGAL_POLICY_SHEET_STACK_CLASS,
  LEGAL_POLICY_SHEET_SUBSECTION_TITLE_CLASS,
} from '../../constants/legal-policy-sheet';
import { useTranslation } from '../../lib/i18n-client';

type TranslateFn = (key: string) => string;

function PrivacySections({ t }: { t: TranslateFn }) {
  return (
    <>
      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('privacy.introduction.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('privacy.introduction.description1')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('privacy.introduction.description2')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('privacy.informationWeCollect.title')}
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className={LEGAL_POLICY_SHEET_SUBSECTION_TITLE_CLASS}>
              {t('privacy.informationWeCollect.personalInformation.title')}
            </h3>
            <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>
              {t('privacy.informationWeCollect.personalInformation.description')}
            </p>
            <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
              <li>{t('privacy.informationWeCollect.personalInformation.items.register')}</li>
              <li>{t('privacy.informationWeCollect.personalInformation.items.order')}</li>
              <li>{t('privacy.informationWeCollect.personalInformation.items.newsletter')}</li>
              <li>{t('privacy.informationWeCollect.personalInformation.items.contact')}</li>
              <li>{t('privacy.informationWeCollect.personalInformation.items.surveys')}</li>
            </ul>
            <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>
              {t('privacy.informationWeCollect.personalInformation.details')}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className={LEGAL_POLICY_SHEET_SUBSECTION_TITLE_CLASS}>
              {t('privacy.informationWeCollect.automaticallyCollected.title')}
            </h3>
            <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>
              {t('privacy.informationWeCollect.automaticallyCollected.description')}
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('privacy.howWeUse.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('privacy.howWeUse.description')}</p>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          <li>{t('privacy.howWeUse.items.process')}</li>
          <li>{t('privacy.howWeUse.items.confirmations')}</li>
          <li>{t('privacy.howWeUse.items.support')}</li>
          <li>{t('privacy.howWeUse.items.marketing')}</li>
          <li>{t('privacy.howWeUse.items.improve')}</li>
          <li>{t('privacy.howWeUse.items.fraud')}</li>
          <li>{t('privacy.howWeUse.items.legal')}</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('privacy.informationSharing.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('privacy.informationSharing.description')}</p>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          <li>{t('privacy.informationSharing.items.providers')}</li>
          <li>{t('privacy.informationSharing.items.law')}</li>
          <li>{t('privacy.informationSharing.items.transfer')}</li>
          <li>{t('privacy.informationSharing.items.consent')}</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('privacy.dataSecurity.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('privacy.dataSecurity.description')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('privacy.yourRights.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('privacy.yourRights.description')}</p>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          <li>{t('privacy.yourRights.items.access')}</li>
          <li>{t('privacy.yourRights.items.correct')}</li>
          <li>{t('privacy.yourRights.items.delete')}</li>
          <li>{t('privacy.yourRights.items.object')}</li>
          <li>{t('privacy.yourRights.items.portability')}</li>
          <li>{t('privacy.yourRights.items.withdraw')}</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('privacy.contact.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>
          {t('privacy.contact.description')}{' '}
          <a href={STORE_EMAIL_HREF} className="text-brand-pink hover:underline">
            {STORE_EMAIL}
          </a>
        </p>
      </section>
    </>
  );
}

/** Privacy policy body for the legal side sheet. */
export function PrivacyPolicySheetContent() {
  const { t } = useTranslation();
  return (
    <article className={LEGAL_POLICY_SHEET_STACK_CLASS}>
      <PrivacySections t={t} />
    </article>
  );
}
