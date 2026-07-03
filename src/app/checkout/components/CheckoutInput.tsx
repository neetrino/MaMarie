'use client';

import type { ComponentProps } from 'react';
import { Input } from '@shop/ui';
import { CHECKOUT_FORM_INPUT_CLASS } from '../constants/checkout-ui';

type CheckoutInputProps = ComponentProps<typeof Input>;

/** Checkout text field — 15px corner radius. */
export function CheckoutInput({ className = '', ...props }: CheckoutInputProps) {
  return <Input className={`${CHECKOUT_FORM_INPUT_CLASS} ${className}`.trim()} {...props} />;
}
