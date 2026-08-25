'use client';

import Link from 'next/link';
import {
  LEGAL_POLICY_SHEET_BODY_CLASS,
  LEGAL_POLICY_SHEET_LIST_CLASS,
  LEGAL_POLICY_SHEET_ORDERED_LIST_CLASS,
  LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS,
  LEGAL_POLICY_SHEET_STACK_CLASS,
} from '../../constants/legal-policy-sheet';
import { useTranslation } from '../../lib/i18n-client';

/** Returns policy body for the legal side sheet. */
export function ReturnsPolicySheetContent() {
  const { t } = useTranslation();

  return (
    <article className={LEGAL_POLICY_SHEET_STACK_CLASS}>
      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('returns.returnPolicy.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('returns.returnPolicy.description')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('returns.returnConditions.title')}
        </h2>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          <li>{t('returns.returnConditions.items.unworn')}</li>
          <li>{t('returns.returnConditions.items.tags')}</li>
          <li>{t('returns.returnConditions.items.saleable')}</li>
          <li>{t('returns.returnConditions.items.proof')}</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('returns.howToReturn.title')}</h2>
        <ol className={LEGAL_POLICY_SHEET_ORDERED_LIST_CLASS}>
          <li>{t('returns.howToReturn.steps.contact')}</li>
          <li>{t('returns.howToReturn.steps.authorization')}</li>
          <li>{t('returns.howToReturn.steps.package')}</li>
          <li>{t('returns.howToReturn.steps.ship')}</li>
          <li>{t('returns.howToReturn.steps.process')}</li>
        </ol>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('returns.refundProcess.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('returns.refundProcess.description')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('returns.nonReturnable.title')}
        </h2>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          <li>{t('returns.nonReturnable.items.personalized')}</li>
          <li>{t('returns.nonReturnable.items.packaging')}</li>
          <li>{t('returns.nonReturnable.items.damaged')}</li>
          <li>{t('returns.nonReturnable.items.sale')}</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('returns.needMoreInfo.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>
          {t('returns.needMoreInfo.description1')}{' '}
          <Link href="/delivery" className="text-brand-pink hover:underline">
            {t('returns.needMoreInfo.deliveryLink')}
          </Link>
          .
        </p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>
          {t('returns.needMoreInfo.description2')}{' '}
          <Link href="/contact" className="text-brand-pink hover:underline">
            {t('returns.needMoreInfo.contactLink')}
          </Link>
          .
        </p>
      </section>
    </article>
  );
}
