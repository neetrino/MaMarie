'use client';

import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import {
  CLAY_PRIMARY_BUTTON_CLASS,
  CLAY_SECONDARY_BUTTON_CLASS,
  getClayPrimaryButtonCompactStyle,
  getClaySecondaryButtonCompactStyle,
} from '../constants/clay-primary-button';

type BrandPillButtonVariant = 'primary' | 'secondary';

interface BrandPillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BrandPillButtonVariant;
}

const BRAND_PILL_BUTTON_VARIANTS: Record<
  BrandPillButtonVariant,
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
};

/** Site-wide pink / white clay pill — profile, checkout, reviews. */
export function BrandPillButton({
  variant = 'primary',
  className = '',
  style,
  ...props
}: BrandPillButtonProps) {
  const config = BRAND_PILL_BUTTON_VARIANTS[variant];

  return (
    <button
      className={`${config.className} ${className}`.trim()}
      style={{ ...config.getStyle(), ...style }}
      {...props}
    />
  );
}
