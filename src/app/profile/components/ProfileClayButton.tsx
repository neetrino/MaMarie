import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import {
  CLAY_DANGER_BUTTON_CLASS,
  CLAY_PRIMARY_BUTTON_CLASS,
  CLAY_SECONDARY_BUTTON_CLASS,
  getClayDangerButtonCompactStyle,
  getClayPrimaryButtonCompactStyle,
  getClaySecondaryButtonCompactStyle,
} from '../../../constants/clay-primary-button';

type ProfileClayButtonVariant = 'primary' | 'secondary' | 'danger';

interface ProfileClayButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ProfileClayButtonVariant;
}

const PROFILE_CLAY_BUTTON_VARIANTS: Record<
  ProfileClayButtonVariant,
  { className: string; getStyle: () => CSSProperties }
> = {
  primary: {
    className: CLAY_PRIMARY_BUTTON_CLASS,
    getStyle: getClayPrimaryButtonCompactStyle,
  },
  secondary: {
    className: CLAY_SECONDARY_BUTTON_CLASS,
    getStyle: getClaySecondaryButtonCompactStyle,
  },
  danger: {
    className: CLAY_DANGER_BUTTON_CLASS,
    getStyle: getClayDangerButtonCompactStyle,
  },
};

/** Compact clay CTA — profile forms (pink / white / danger). */
export function ProfileClayButton({
  variant,
  className = '',
  style,
  ...props
}: ProfileClayButtonProps) {
  const config = PROFILE_CLAY_BUTTON_VARIANTS[variant];

  return (
    <button
      className={`${config.className} ${className}`.trim()}
      style={{ ...config.getStyle(), ...style }}
      {...props}
    />
  );
}
