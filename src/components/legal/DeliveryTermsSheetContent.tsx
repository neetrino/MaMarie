'use client';

import { STORE_EMAIL, STORE_EMAIL_HREF } from '@/constants/store-contact';
import {
  LEGAL_POLICY_SHEET_BODY_CLASS,
  LEGAL_POLICY_SHEET_LIST_CLASS,
  LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS,
  LEGAL_POLICY_SHEET_STACK_CLASS,
} from '../../constants/legal-policy-sheet';
import { useTranslation } from '../../lib/i18n-client';

/** Delivery terms body for the legal side sheet. */
export function DeliveryTermsSheetContent() {
  const { t } = useTranslation();

  return (
    <article className={LEGAL_POLICY_SHEET_STACK_CLASS}>
      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('delivery-terms.overview.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('delivery-terms.overview.description')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('delivery-terms.shippingOptions.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>
          {t('delivery-terms.shippingOptions.description')}
        </p>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          <li>{t('delivery-terms.shippingOptions.options.standard')}</li>
          <li>{t('delivery-terms.shippingOptions.options.express')}</li>
          <li>{t('delivery-terms.shippingOptions.options.pickup')}</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('delivery-terms.processingTimes.title')}
        </h2>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          <li>{t('delivery-terms.processingTimes.items.typical')}</li>
          <li>{t('delivery-terms.processingTimes.items.weekends')}</li>
          <li>{t('delivery-terms.processingTimes.items.preorder')}</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('delivery-terms.deliveryTimeframes.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>
          {t('delivery-terms.deliveryTimeframes.description')}
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('delivery-terms.shippingFees.title')}
        </h2>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          <li>{t('delivery-terms.shippingFees.items.costs')}</li>
          <li>{t('delivery-terms.shippingFees.items.duties')}</li>
          <li>{t('delivery-terms.shippingFees.items.promotional')}</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('delivery-terms.delaysDamageLoss.title')}
        </h2>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          <li>{t('delivery-terms.delaysDamageLoss.items.delays')}</li>
          <li>{t('delivery-terms.delaysDamageLoss.items.damage')}</li>
          <li>{t('delivery-terms.delaysDamageLoss.items.loss')}</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('delivery-terms.contact.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>
          {t('delivery-terms.contact.description')}{' '}
          <a href={STORE_EMAIL_HREF} className="text-brand-pink hover:underline">
            {STORE_EMAIL}
          </a>
          .
        </p>
      </section>
    </article>
  );
}
