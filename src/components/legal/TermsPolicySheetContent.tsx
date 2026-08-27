'use client';

import {
  LEGAL_POLICY_SHEET_BODY_CLASS,
  LEGAL_POLICY_SHEET_LIST_CLASS,
  LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS,
  LEGAL_POLICY_SHEET_STACK_CLASS,
} from '../../constants/legal-policy-sheet';
import { useTranslation } from '../../lib/i18n-client';

type TranslateFn = (key: string) => string;

const DEFINITION_ITEM_KEYS = [
  'website',
  'user',
  'services',
  'content',
  'intellectualProperty',
  'transaction',
] as const;

const USER_OBLIGATION_ITEM_KEYS = [
  'lawful',
  'interfere',
  'malware',
  'access',
  'content',
] as const;

const LIABILITY_ITEM_KEYS = ['errors', 'userInfo', 'thirdParty', 'content'] as const;

const FORCE_MAJEURE_ITEM_KEYS = ['natural', 'government', 'conflict', 'technical'] as const;

function TermsSections({ t }: { t: TranslateFn }) {
  return (
    <>
      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('terms.general.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.general.p1')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.general.p2')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.general.p3')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.general.p4')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.general.p5')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('terms.definitions.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.definitions.intro')}</p>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          {DEFINITION_ITEM_KEYS.map((key) => (
            <li key={key}>{t(`terms.definitions.items.${key}`)}</li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('terms.userObligations.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.userObligations.intro')}</p>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          {USER_OBLIGATION_ITEM_KEYS.map((key) => (
            <li key={key}>{t(`terms.userObligations.items.${key}`)}</li>
          ))}
        </ul>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.userObligations.block')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('terms.liability.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.liability.asIs')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.liability.intro')}</p>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          {LIABILITY_ITEM_KEYS.map((key) => (
            <li key={key}>{t(`terms.liability.items.${key}`)}</li>
          ))}
        </ul>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.liability.indirect')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('terms.intellectualProperty.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.intellectualProperty.p1')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.intellectualProperty.p2')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.intellectualProperty.p3')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('terms.payments.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.payments.p1')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.payments.p2')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.payments.p3')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('terms.disputes.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.disputes.p1')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.disputes.p2')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.disputes.p3')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('terms.forceMajeure.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.forceMajeure.intro')}</p>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          {FORCE_MAJEURE_ITEM_KEYS.map((key) => (
            <li key={key}>{t(`terms.forceMajeure.items.${key}`)}</li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('terms.dataProtection.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.dataProtection.p1')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.dataProtection.p2')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('terms.dataProtection.p3')}</p>
      </section>
    </>
  );
}

/** Terms of service body for the legal side sheet. */
export function TermsPolicySheetContent() {
  const { t } = useTranslation();

  return (
    <article className={LEGAL_POLICY_SHEET_STACK_CLASS}>
      <TermsSections t={t} />
    </article>
  );
}
