'use client';

import Image from 'next/image';
import {
  CASH_CHANGE_BANKNOTE_SRC,
  CASH_CHANGE_DENOMINATIONS_AMD,
  CASH_CHANGE_NONE,
  CHECKOUT_CASH_CHANGE_GRID_CLASS,
  CHECKOUT_CASH_CHANGE_HINT_CLASS,
  CHECKOUT_CASH_CHANGE_NONE_CLASS,
  CHECKOUT_CASH_CHANGE_NOTE_BUTTON_CLASS,
  CHECKOUT_CASH_CHANGE_NOTE_IMAGE_CLASS,
  CHECKOUT_CASH_CHANGE_OPTION_BASE_CLASS,
  CHECKOUT_CASH_CHANGE_OPTION_DEFAULT_CLASS,
  CHECKOUT_CASH_CHANGE_OPTION_SELECTED_CLASS,
  CHECKOUT_CASH_CHANGE_SECTION_CLASS,
  CHECKOUT_CASH_CHANGE_TITLE_CLASS,
  type CashChangeFor,
} from '../constants/checkout-cash-change';

interface CheckoutCashChangeSelectorProps {
  value: CashChangeFor;
  disabled?: boolean;
  title: string;
  hint: string;
  noneLabel: string;
  onChange: (value: CashChangeFor) => void;
}

function optionClass(isSelected: boolean): string {
  return `${CHECKOUT_CASH_CHANGE_OPTION_BASE_CLASS} ${
    isSelected
      ? CHECKOUT_CASH_CHANGE_OPTION_SELECTED_CLASS
      : CHECKOUT_CASH_CHANGE_OPTION_DEFAULT_CLASS
  }`;
}

export function CheckoutCashChangeSelector({
  value,
  disabled = false,
  title,
  hint,
  noneLabel,
  onChange,
}: CheckoutCashChangeSelectorProps) {
  return (
    <div className={CHECKOUT_CASH_CHANGE_SECTION_CLASS} data-cash-change-section>
      <h3 className={CHECKOUT_CASH_CHANGE_TITLE_CLASS}>{title}</h3>
      <p className={CHECKOUT_CASH_CHANGE_HINT_CLASS}>{hint}</p>

      <div className={CHECKOUT_CASH_CHANGE_GRID_CLASS} role="radiogroup" aria-label={title}>
        <button
          type="button"
          role="radio"
          aria-checked={value === CASH_CHANGE_NONE}
          disabled={disabled}
          className={`${optionClass(value === CASH_CHANGE_NONE)} ${CHECKOUT_CASH_CHANGE_NONE_CLASS}`}
          onClick={() => onChange(CASH_CHANGE_NONE)}
        >
          {noneLabel}
        </button>

        {CASH_CHANGE_DENOMINATIONS_AMD.map((amount) => {
          const optionValue = String(amount) as CashChangeFor;
          const isSelected = value === optionValue;

          return (
            <button
              key={amount}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              className={`${optionClass(isSelected)} ${CHECKOUT_CASH_CHANGE_NOTE_BUTTON_CLASS}`}
              onClick={() => onChange(optionValue)}
            >
              <Image
                src={CASH_CHANGE_BANKNOTE_SRC[amount]}
                alt={`${amount} AMD`}
                fill
                className={CHECKOUT_CASH_CHANGE_NOTE_IMAGE_CLASS}
                sizes="(max-width: 640px) 33vw, 180px"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
