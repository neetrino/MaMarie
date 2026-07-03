import { LogOut } from 'lucide-react';
import { PROFILE_MOBILE_CARD_RADIUS_PX } from '../../../constants/profile-mobile-page';

interface ProfileMobileLogoutButtonProps {
  label: string;
  onClick: () => void;
}

/** Full-width pink logout CTA — separate from the menu card on mobile profile. */
export function ProfileMobileLogoutButton({ label, onClick }: ProfileMobileLogoutButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2.5 bg-brand-pink py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90 active:opacity-90"
      style={{ borderRadius: PROFILE_MOBILE_CARD_RADIUS_PX }}
    >
      <LogOut className="h-5 w-5 shrink-0" aria-hidden />
      <span>{label}</span>
    </button>
  );
}
