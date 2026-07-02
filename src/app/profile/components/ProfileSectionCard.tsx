import type { ReactNode } from 'react';
import { Card } from '@shop/ui';
import { PROFILE_DESKTOP_CARD_CLASS } from '../../../constants/profile-desktop-page';

interface ProfileSectionCardProps {
  children: ReactNode;
  className?: string;
}

/** Clay profile panel — matches dashboard cards. */
export function ProfileSectionCard({ children, className = '' }: ProfileSectionCardProps) {
  return (
    <Card className={`border-0 p-6 lg:p-8 ${PROFILE_DESKTOP_CARD_CLASS} ${className}`.trim()}>
      {children}
    </Card>
  );
}
