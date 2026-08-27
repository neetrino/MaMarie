'use client';

import {
  LEGAL_POLICY_SHEET_BODY_CLASS,
  LEGAL_POLICY_SHEET_LIST_CLASS,
  LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS,
  LEGAL_POLICY_SHEET_STACK_CLASS,
} from '../../constants/legal-policy-sheet';
import { useTranslation } from '../../lib/i18n-client';

type TranslateFn = (key: string) => string;

const NON_RETURNABLE_KEYS = [
  'underwear',
  'socks',
  'swimwear',
  'giftCards',
  'other',
] as const;

function RefundPolicySections({ t }: { t: TranslateFn }) {
  return (
    <>
      <section className="flex flex-col gap-3">
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('refund-policy.subtitle')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('refund-policy.exchanges.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('refund-policy.exchanges.p1')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('refund-policy.exchanges.p2')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('refund-policy.exchanges.p3')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('refund-policy.exchanges.p4')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('refund-policy.returns.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('refund-policy.returns.p1')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('refund-policy.returns.p2')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('refund-policy.returns.p3')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('refund-policy.refunds.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('refund-policy.refunds.p1')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('refund-policy.refunds.p2')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('refund-policy.refunds.p3')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('refund-policy.cancellation.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('refund-policy.cancellation.p1')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('refund-policy.cancellation.p2')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('refund-policy.personalized.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('refund-policy.personalized.p1')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('refund-policy.nonReturnable.title')}
        </h2>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          {NON_RETURNABLE_KEYS.map((key) => (
            <li key={key}>{t(`refund-policy.nonReturnable.items.${key}`)}</li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('refund-policy.specialNote.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('refund-policy.specialNote.p1')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('refund-policy.specialNote.p2')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('refund-policy.brand')}</p>
      </section>
    </>
  );
}

/** Return and exchange policy body for the legal side sheet. */
export function RefundPolicySheetContent() {
  const { t } = useTranslation();
  return (
    <article className={LEGAL_POLICY_SHEET_STACK_CLASS}>
      <RefundPolicySections t={t} />
    </article>
  );
}
