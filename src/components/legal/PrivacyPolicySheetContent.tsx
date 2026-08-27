'use client';

import {
  LEGAL_POLICY_SHEET_BODY_CLASS,
  LEGAL_POLICY_SHEET_LIST_CLASS,
  LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS,
  LEGAL_POLICY_SHEET_STACK_CLASS,
} from '../../constants/legal-policy-sheet';
import { useTranslation } from '../../lib/i18n-client';

type TranslateFn = (key: string) => string;

const COLLECTED_DATA_KEYS = ['contact', 'purchase', 'technical', 'cookies'] as const;
const USE_OF_DATA_KEYS = ['orders', 'support', 'improve', 'legal'] as const;
const RETENTION_KEYS = ['account', 'purchase', 'marketing'] as const;
const SECURITY_KEYS = ['ssl', 'access', 'audits'] as const;
const SHARING_KEYS = ['shipping', 'payment', 'law'] as const;
const RIGHTS_KEYS = ['copy', 'edit', 'optOut', 'restrict'] as const;
const COOKIES_KEYS = ['functional', 'analytical', 'marketing'] as const;

function OptionalBody({ text, className }: { text: string; className: string }) {
  if (!text.trim()) {
    return null;
  }
  return <p className={className}>{text}</p>;
}

function PrivacySections({ t }: { t: TranslateFn }) {
  return (
    <>
      <section className="flex flex-col gap-3">
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('privacy.intro.p1')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('privacy.intro.p2')}</p>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('privacy.intro.p3')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>
          {t('privacy.collectedData.title')}
        </h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('privacy.collectedData.intro')}</p>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          {COLLECTED_DATA_KEYS.map((key) => (
            <li key={key}>{t(`privacy.collectedData.items.${key}`)}</li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('privacy.useOfData.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('privacy.useOfData.intro')}</p>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          {USE_OF_DATA_KEYS.map((key) => (
            <li key={key}>{t(`privacy.useOfData.items.${key}`)}</li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('privacy.retention.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('privacy.retention.intro')}</p>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          {RETENTION_KEYS.map((key) => (
            <li key={key}>{t(`privacy.retention.items.${key}`)}</li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('privacy.security.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('privacy.security.intro')}</p>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          {SECURITY_KEYS.map((key) => (
            <li key={key}>{t(`privacy.security.items.${key}`)}</li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('privacy.sharing.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('privacy.sharing.intro')}</p>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          {SHARING_KEYS.map((key) => (
            <li key={key}>{t(`privacy.sharing.items.${key}`)}</li>
          ))}
        </ul>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('privacy.sharing.outro')}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('privacy.rights.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('privacy.rights.intro')}</p>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          {RIGHTS_KEYS.map((key) => (
            <li key={key}>{t(`privacy.rights.items.${key}`)}</li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('privacy.cookies.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('privacy.cookies.intro')}</p>
        <ul className={LEGAL_POLICY_SHEET_LIST_CLASS}>
          {COOKIES_KEYS.map((key) => (
            <li key={key}>{t(`privacy.cookies.items.${key}`)}</li>
          ))}
        </ul>
        <OptionalBody text={t('privacy.cookies.outro')} className={LEGAL_POLICY_SHEET_BODY_CLASS} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={LEGAL_POLICY_SHEET_SECTION_TITLE_CLASS}>{t('privacy.changes.title')}</h2>
        <p className={LEGAL_POLICY_SHEET_BODY_CLASS}>{t('privacy.changes.p1')}</p>
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
