import type { ButtonHTMLAttributes, ReactNode } from 'react';
import {
  CHECKOUT_PRIMARY_BUTTON_CLASS,
  CHECKOUT_PRIMARY_BUTTON_STYLE,
} from '../constants/checkout-ui';

interface CheckoutPrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

/** Brand pink pill CTA — matches cart drawer checkout button. */
export function CheckoutPrimaryButton({
  children,
  className = '',
  type = 'button',
  ...props
}: CheckoutPrimaryButtonProps) {
  return (
    <button
      type={type}
      className={`${CHECKOUT_PRIMARY_BUTTON_CLASS} ${className}`}
      style={CHECKOUT_PRIMARY_BUTTON_STYLE}
      {...props}
    >
      {children}
    </button>
  );
}
