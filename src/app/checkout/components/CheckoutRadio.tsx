'use client';

import type { InputHTMLAttributes } from 'react';

type CheckoutRadioTone = 'pink' | 'blue';

type CheckoutRadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  tone?: CheckoutRadioTone;
};

const toneCheckedBorderClass: Record<CheckoutRadioTone, string> = {
  pink: 'peer-checked:border-brand-pink',
  blue: 'peer-checked:border-[#5281e1]',
};

const toneDotClass: Record<CheckoutRadioTone, string> = {
  pink: 'bg-brand-pink',
  blue: 'bg-[#5281e1]',
};

/** Custom radio — no native browser ring. */
export function CheckoutRadio({
  className = '',
  disabled,
  tone = 'pink',
  ...props
}: CheckoutRadioProps) {
  return (
    <span className="relative mr-4 inline-flex h-5 w-5 shrink-0 items-center justify-center">
      <input
        type="radio"
        disabled={disabled}
        className={`peer sr-only ${className}`.trim()}
        {...props}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-full border-2 border-gray-300 bg-white transition-colors peer-disabled:opacity-50 ${toneCheckedBorderClass[tone]}`}
      />
      <span
        aria-hidden
        className={`pointer-events-none h-2.5 w-2.5 scale-0 rounded-full transition-transform peer-checked:scale-100 peer-disabled:opacity-50 ${toneDotClass[tone]}`}
      />
    </span>
  );
}
