import {
  CASH_CHANGE_DENOMINATIONS_AMD,
  CASH_CHANGE_NONE,
  type CashChangeDenominationAmd,
  type CashChangeFor,
} from '../constants/checkout-cash-change';

export function isCashChangeDenomination(
  value: string,
): value is `${CashChangeDenominationAmd}` {
  return (CASH_CHANGE_DENOMINATIONS_AMD as readonly number[]).includes(Number(value));
}

export function isCashChangeFor(value: string): value is CashChangeFor {
  return value === CASH_CHANGE_NONE || isCashChangeDenomination(value);
}

/** Human-readable note stored on the order for couriers / admin. */
export function formatCashChangeOrderNote(
  cashChangeFor: CashChangeFor,
  labels: { none: string; changeFor: (amount: string) => string },
): string {
  if (cashChangeFor === CASH_CHANGE_NONE) {
    return labels.none;
  }

  const amount = Number(cashChangeFor).toLocaleString('en-US');
  return labels.changeFor(amount);
}

export function parseCashChangeAmount(cashChangeFor: CashChangeFor): number | null {
  if (cashChangeFor === CASH_CHANGE_NONE) {
    return null;
  }

  return Number(cashChangeFor);
}
