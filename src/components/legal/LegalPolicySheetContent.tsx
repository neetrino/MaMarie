'use client';

import type { LegalPolicyKey } from '../../constants/legal-policy-links';
import { DeliveryTermsSheetContent } from './DeliveryTermsSheetContent';
import { PrivacyPolicySheetContent } from './PrivacyPolicySheetContent';
import { RefundPolicySheetContent } from './RefundPolicySheetContent';
import { ReturnsPolicySheetContent } from './ReturnsPolicySheetContent';
import { TermsPolicySheetContent } from './TermsPolicySheetContent';

interface LegalPolicySheetContentProps {
  policyKey: LegalPolicyKey;
}

/** Renders the active policy body inside the cart-style side sheet. */
export function LegalPolicySheetContent({ policyKey }: LegalPolicySheetContentProps) {
  switch (policyKey) {
    case 'privacy':
      return <PrivacyPolicySheetContent />;
    case 'terms':
      return <TermsPolicySheetContent />;
    case 'refund':
      return <RefundPolicySheetContent />;
    case 'delivery':
      return <DeliveryTermsSheetContent />;
    case 'returns':
      return <ReturnsPolicySheetContent />;
    default: {
      const _exhaustive: never = policyKey;
      return _exhaustive;
    }
  }
}
