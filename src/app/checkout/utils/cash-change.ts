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

/** Whole AMD units for tender / change math (matches displayed totals). */
export function roundCashOrderTotalAmd(orderTotalAmd: number): number {
  if (!Number.isFinite(orderTotalAmd) || orderTotalAmd < 0) {
    return 0;
  }
  return Math.round(orderTotalAmd);
}

/** Denominations large enough to cover the order total. */
export function eligibleCashChangeDenominations(
  orderTotalAmd: number,
): readonly CashChangeDenominationAmd[] {
  const total = roundCashOrderTotalAmd(orderTotalAmd);
  return CASH_CHANGE_DENOMINATIONS_AMD.filter((amount) => amount >= total);
}

/**
 * Change the courier must prepare: tendered note − order total.
 * `null` / `none` → exact payment (0). Amount below total → null (invalid).
 */
export function calculateCashChangeReturnAmd(
  cashChangeFor: CashChangeFor,
  orderTotalAmd: number,
): number | null {
  if (cashChangeFor === CASH_CHANGE_NONE) {
    return 0;
  }

  const tendered = Number(cashChangeFor);
  const total = roundCashOrderTotalAmd(orderTotalAmd);

  if (!Number.isFinite(tendered) || tendered < total) {
    return null;
  }

  return tendered - total;
}

export function isEligibleCashChangeFor(
  cashChangeFor: CashChangeFor,
  orderTotalAmd: number,
): boolean {
  if (cashChangeFor === CASH_CHANGE_NONE) {
    return true;
  }

  return eligibleCashChangeDenominations(orderTotalAmd).includes(
    Number(cashChangeFor) as CashChangeDenominationAmd,
  );
}

/** Human-readable note stored on the order for couriers / admin. */
export function formatCashChangeOrderNote(
  cashChangeFor: CashChangeFor,
  labels: {
    none: string;
    changeFor: (amount: string) => string;
    changeReturn?: (amount: string) => string;
  },
  orderTotalAmd?: number,
): string {
  if (cashChangeFor === CASH_CHANGE_NONE) {
    return labels.none;
  }

  const tenderedLabel = Number(cashChangeFor).toLocaleString('en-US');
  const base = labels.changeFor(tenderedLabel);

  if (orderTotalAmd === undefined || !labels.changeReturn) {
    return base;
  }

  const change = calculateCashChangeReturnAmd(cashChangeFor, orderTotalAmd);
  if (change === null || change <= 0) {
    return base;
  }

  return `${base}. ${labels.changeReturn(change.toLocaleString('en-US'))}`;
}

export function parseCashChangeAmount(cashChangeFor: CashChangeFor): number | null {
  if (cashChangeFor === CASH_CHANGE_NONE) {
    return null;
  }

  return Number(cashChangeFor);
}
