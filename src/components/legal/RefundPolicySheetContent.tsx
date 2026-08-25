'use client';

import { STORE_EMAIL, STORE_EMAIL_HREF } from '@/constants/store-contact';
import {
  LEGAL_POLICY_SHEET_BODY_CLASS,
  LEGAL_POLICY_SHEET_LIST_CLASS,
  LEGAL_POLICY_SHEET_ORDERED_LIST_CLASS,
  LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS,
  LEGAL_POLICY_SHEET_STACK_CLASS,
} from '../../constants/legal-policy-sheet';
import { useTranslation } from '../../lib/i18n-client';

/** Refund policy body for the legal side sheet. */
export function RefundPolicySheetContent() {
  const { t } = useTranslation();

  return (
    <article className={LEGAL_POLICY_SHEET_STACK_CLASS}>
      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('refund-policy.overview.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('refund-policy.overview.description')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('refund-policy.eligibility.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('refund-policy.eligibility.description')}</p>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          <li>{t('refund-policy.eligibility.items.condition')}</li>
          <li>{t('refund-policy.eligibility.items.timeline')}</li>
          <li>{t('refund-policy.eligibility.items.proof')}</li>
          <li>{t('refund-policy.eligibility.items.excluded')}</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('refund-policy.howToInitiate.title')}
        </h2>
        <ol className={LEGAL_POLICY_SHEET_ORDERED_LIST_CLASS}>
          <li>{t('refund-policy.howToInitiate.steps.contact')}</li>
          <li>{t('refund-policy.howToInitiate.steps.authorization')}</li>
          <li>{t('refund-policy.howToInitiate.steps.ship')}</li>
        </ol>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>
          {t('refund-policy.howToInitiate.description')}
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('refund-policy.refundMethod.title')}
        </h2>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          <li>{t('refund-policy.refundMethod.items.method')}</li>
          <li>{t('refund-policy.refundMethod.items.timing')}</li>
          <li>{t('refund-policy.refundMethod.items.shipping')}</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('refund-policy.nonRefundable.title')}
        </h2>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          <li>{t('refund-policy.nonRefundable.items.giftCards')}</li>
          <li>{t('refund-policy.nonRefundable.items.personalized')}</li>
          <li>{t('refund-policy.nonRefundable.items.unauthorized')}</li>
          <li>{t('refund-policy.nonRefundable.items.condition')}</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('refund-policy.contact.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>
          {t('refund-policy.contact.description')}{' '}
          <a href={STORE_EMAIL_HREF} className="text-brand-pink hover:underline">
            {STORE_EMAIL}
          </a>
          .
        </p>
      </section>
    </article>
  );
}
