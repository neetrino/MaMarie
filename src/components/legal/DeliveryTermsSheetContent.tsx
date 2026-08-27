'use client';

import {
  LEGAL_POLICY_SHEET_BODY_CLASS,
  LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS,
  LEGAL_POLICY_SHEET_STACK_CLASS,
} from '../../constants/legal-policy-sheet';
import { useTranslation } from '../../lib/i18n-client';

type TranslateFn = (key: string) => string;

function DeliveryTermsSections({ t }: { t: TranslateFn }) {
  return (
    <>
      <section className="flex flex-col gap-3">
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('delivery-terms.subtitle')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('delivery-terms.processing.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('delivery-terms.processing.p1')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('delivery-terms.processing.p2')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('delivery-terms.processing.p3')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('delivery-terms.options.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('delivery-terms.options.p1')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('delivery-terms.options.p2')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('delivery-terms.fees.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('delivery-terms.fees.p1')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('delivery-terms.fees.p2')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('delivery-terms.receipt.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('delivery-terms.receipt.p1')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('delivery-terms.receipt.p2')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('delivery-terms.receipt.p3')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('delivery-terms.delays.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('delivery-terms.delays.p1')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('delivery-terms.important.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('delivery-terms.important.p1')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('delivery-terms.brand')}</p>
      </section>
    </>
  );
}

/** Delivery terms body for the legal side sheet. */
export function DeliveryTermsSheetContent() {
  const { t } = useTranslation();
  return (
    <article className={LEGAL_POLICY_SHEET_STACK_CLASS}>
      <DeliveryTermsSections t={t} />
    </article>
  );
}
