'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import {
  CASH_CHANGE_BANKNOTE_SRC,
  CASH_CHANGE_NONE,
  CHECKOUT_CASH_CHANGE_GRID_CLASS,
  CHECKOUT_CASH_CHANGE_HINT_CLASS,
  CHECKOUT_CASH_CHANGE_NONE_CLASS,
  CHECKOUT_CASH_CHANGE_NOTE_BUTTON_CLASS,
  CHECKOUT_CASH_CHANGE_NOTE_IMAGE_CLASS,
  CHECKOUT_CASH_CHANGE_NO_ELIGIBLE_CLASS,
  CHECKOUT_CASH_CHANGE_OPTION_BASE_CLASS,
  CHECKOUT_CASH_CHANGE_OPTION_DEFAULT_CLASS,
  CHECKOUT_CASH_CHANGE_OPTION_SELECTED_CLASS,
  CHECKOUT_CASH_CHANGE_RETURN_CLASS,
  CHECKOUT_CASH_CHANGE_SECTION_CLASS,
  CHECKOUT_CASH_CHANGE_TITLE_CLASS,
  type CashChangeFor,
} from '../constants/checkout-cash-change';
import {
  calculateCashChangeReturnAmd,
  eligibleCashChangeDenominations,
  isEligibleCashChangeFor,
} from '../utils/cash-change';

interface CheckoutCashChangeSelectorProps {
  value: CashChangeFor;
  orderTotalAmd: number;
  formatMoney: (amountAmd: number) => string;
  disabled?: boolean;
  title: string;
  hint: string;
  noneLabel: string;
  changeReturnLabel: string;
  noEligibleLabel: string;
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
  orderTotalAmd,
  formatMoney,
  disabled = false,
  title,
  hint,
  noneLabel,
  changeReturnLabel,
  noEligibleLabel,
  onChange,
}: CheckoutCashChangeSelectorProps) {
  const denominations = eligibleCashChangeDenominations(orderTotalAmd);
  const changeReturnAmd = calculateCashChangeReturnAmd(value, orderTotalAmd);

  useEffect(() => {
    if (value !== CASH_CHANGE_NONE && !isEligibleCashChangeFor(value, orderTotalAmd)) {
      onChange(CASH_CHANGE_NONE);
    }
  }, [value, orderTotalAmd, onChange]);

  return (
    <div className={CHECKOUT_CASH_CHANGE_SECTION_CLASS} data-cash-change-section>
      <h3 className={CHECKOUT_CASH_CHANGE_TITLE_CLASS}>{title}</h3>
      <p className={CHECKOUT_CASH_CHANGE_HINT_CLASS}>{hint}</p>

      {denominations.length === 0 ? (
        <p className={CHECKOUT_CASH_CHANGE_NO_ELIGIBLE_CLASS}>{noEligibleLabel}</p>
      ) : null}

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

        {denominations.map((amount) => {
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
                alt={formatMoney(amount)}
                fill
                className={CHECKOUT_CASH_CHANGE_NOTE_IMAGE_CLASS}
                sizes="(max-width: 640px) 33vw, 180px"
              />
            </button>
          );
        })}
      </div>

      {value !== CASH_CHANGE_NONE && changeReturnAmd !== null && changeReturnAmd > 0 ? (
        <p className={CHECKOUT_CASH_CHANGE_RETURN_CLASS} data-cash-change-return>
          {changeReturnLabel.replace('{amount}', formatMoney(changeReturnAmd))}
        </p>
      ) : null}
    </div>
  );
}
