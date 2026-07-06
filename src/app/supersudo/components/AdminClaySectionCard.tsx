import type { ReactNode } from 'react';
import { ProfileSectionCard } from '../../profile/components/ProfileSectionCard';

interface AdminClaySectionCardProps {
  children: ReactNode;
  className?: string;
}

/** Admin panel section — reuses profile clay card styling. */
export function AdminClaySectionCard({ children, className = '' }: AdminClaySectionCardProps) {
  return <ProfileSectionCard className={className}>{children}</ProfileSectionCard>;
}
