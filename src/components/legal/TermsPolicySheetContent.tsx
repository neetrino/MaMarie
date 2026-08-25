'use client';

import { STORE_EMAIL, STORE_EMAIL_HREF } from '@/constants/store-contact';
import {
  LEGAL_POLICY_SHEET_BODY_CLASS,
  LEGAL_POLICY_SHEET_LIST_CLASS,
  LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS,
  LEGAL_POLICY_SHEET_STACK_CLASS,
} from '../../constants/legal-policy-sheet';
import { useTranslation } from '../../lib/i18n-client';

/** Terms of service body for the legal side sheet. */
export function TermsPolicySheetContent() {
  const { t } = useTranslation();

  return (
    <article className={LEGAL_POLICY_SHEET_STACK_CLASS}>
      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('terms.agreementToTerms.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.agreementToTerms.description1')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.agreementToTerms.description2')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('terms.useLicense.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.useLicense.description')}</p>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          <li>{t('terms.useLicense.restrictions.modify')}</li>
          <li>{t('terms.useLicense.restrictions.commercial')}</li>
          <li>{t('terms.useLicense.restrictions.reverse')}</li>
          <li>{t('terms.useLicense.restrictions.copyright')}</li>
          <li>{t('terms.useLicense.restrictions.transfer')}</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('terms.accountRegistration.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.accountRegistration.description')}</p>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          <li>{t('terms.accountRegistration.requirements.accurate')}</li>
          <li>{t('terms.accountRegistration.requirements.maintain')}</li>
          <li>{t('terms.accountRegistration.requirements.security')}</li>
          <li>{t('terms.accountRegistration.requirements.responsibility')}</li>
          <li>{t('terms.accountRegistration.requirements.notify')}</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('terms.productInformation.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.productInformation.description1')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.productInformation.description2')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('terms.pricingAndPayment.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.pricingAndPayment.description1')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.pricingAndPayment.description2')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.pricingAndPayment.description3')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('terms.shippingAndDelivery.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.shippingAndDelivery.description1')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.shippingAndDelivery.description2')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('terms.returnsAndRefunds.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.returnsAndRefunds.description1')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.returnsAndRefunds.description2')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('terms.prohibitedUses.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.prohibitedUses.description')}</p>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          <li>{t('terms.prohibitedUses.items.violate')}</li>
          <li>{t('terms.prohibitedUses.items.transmit')}</li>
          <li>{t('terms.prohibitedUses.items.impersonate')}</li>
          <li>{t('terms.prohibitedUses.items.infringe')}</li>
          <li>{t('terms.prohibitedUses.items.automated')}</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('terms.limitationOfLiability.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.limitationOfLiability.description')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('terms.revisionsAndErrata.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.revisionsAndErrata.description')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('terms.governingLaw.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.governingLaw.description')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('terms.contactInformation.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>
          {t('terms.contactInformation.description')}{' '}
          <a href={STORE_EMAIL_HREF} className="text-brand-pink hover:underline">
            {STORE_EMAIL}
          </a>
        </p>
      </section>
    </article>
  );
}
