import type { ReactNode } from 'react';
import { Card } from '@shop/ui';
import { PROFILE_DESKTOP_CARD_CLASS } from '../../../constants/profile-desktop-page';
import { PROFILE_MOBILE_FORM_SECTION_FRAMELESS_CLASS } from '../../../constants/profile-mobile-page';

interface ProfileSectionCardProps {
  children: ReactNode;
  className?: string;
  /** Strip outer clay card on mobile (form tabs in bottom sheet). */
  mobileFrameless?: boolean;
}

/** Clay profile panel — matches dashboard cards. */
export function ProfileSectionCard({
  children,
  className = '',
  mobileFrameless = false,
}: ProfileSectionCardProps) {
  return (
    <Card
      className={`border-0 p-6 lg:p-8 ${PROFILE_DESKTOP_CARD_CLASS} ${
        mobileFrameless ? PROFILE_MOBILE_FORM_SECTION_FRAMELESS_CLASS : ''
      } ${className}`.trim()}
    >
      {children}
    </Card>
  );
}
