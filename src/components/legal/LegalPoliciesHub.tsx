'use client';

import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ProfileSideSheet } from '../../app/profile/components/ProfileSideSheet';
import {
  LEGAL_POLICY_ITEMS,
  type LegalPolicyKey,
} from '../../constants/legal-policy-links';
import {
  LEGAL_POLICY_HUB_LIST_CLASS,
  LEGAL_POLICY_HUB_PAGE_CLASS,
  LEGAL_POLICY_HUB_TITLE_CLASS,
  LEGAL_POLICY_SHEET_DESKTOP_WIDTH_PERCENT,
} from '../../constants/legal-policy-sheet';
import { useTranslation } from '../../lib/i18n-client';
import { LegalPolicySheetContent } from './LegalPolicySheetContent';

/**
 * Policies hub — list of legal documents; each opens in a cart-style side sheet
 * (Grill.am pattern).
 */
export function LegalPoliciesHub() {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState<LegalPolicyKey | null>(null);
  const activeItem = LEGAL_POLICY_ITEMS.find((item) => item.key === activeKey) ?? null;

  return (
    <>
      <div className={LEGAL_POLICY_HUB_PAGE_CLASS}>
        <div className="mx-auto flex w-full min-w-0 max-w-lg flex-col items-stretch overflow-x-hidden px-4 pb-10 pt-12 sm:px-6 md:pt-16">
          <h1 className={LEGAL_POLICY_HUB_TITLE_CLASS}>{t('legal.hubTitle')}</h1>

          <ul className={LEGAL_POLICY_HUB_LIST_CLASS}>
            {LEGAL_POLICY_ITEMS.map((item) => (
              <li key={item.key} className="w-full">
                <button
                  type="button"
                  onClick={() => setActiveKey(item.key)}
                  className="flex w-full items-center justify-between gap-3 rounded-[15px] bg-white px-4 py-4 text-left text-base font-semibold text-gray-900 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ring-1 ring-gray-100/80 transition hover:bg-gray-50"
                >
                  <span className="min-w-0 flex-1">{t(item.labelKey)}</span>
                  <ChevronRight className="size-5 shrink-0 text-brand-pink" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ProfileSideSheet
        isOpen={activeKey != null}
        title={activeItem ? t(activeItem.titleKey) : t('legal.hubTitle')}
        closeLabel={t('common.buttons.close')}
        onClose={() => setActiveKey(null)}
        desktopWidthPercent={LEGAL_POLICY_SHEET_DESKTOP_WIDTH_PERCENT}
      >
        {activeKey ? <LegalPolicySheetContent policyKey={activeKey} /> : null}
      </ProfileSideSheet>
    </>
  );
}
