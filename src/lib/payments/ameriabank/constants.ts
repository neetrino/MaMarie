/** Provider id stored on Payment.provider and used in API paths. */
export const AMERIABANK_PROVIDER = 'ameriabank';

/** Checkout UI still uses `arca` for card; maps to Ameriabank acquirer. */
export const CARD_CHECKOUT_METHOD = 'arca';

export const AMERIABANK_TEST_BASE_URL = 'https://servicestest.ameriabank.am/VPOS';
export const AMERIABANK_LIVE_BASE_URL = 'https://services.ameriabank.am/VPOS';

/** ISO 4217 numeric — AMD. */
export const AMERIABANK_CURRENCY_AMD = '051';

/** Ameriabank test merchant constraint (bank email). */
export const AMERIABANK_TEST_AMOUNT_AMD = 10;

/** Ameriabank test OrderID range (bank email). */
export const AMERIABANK_TEST_ORDER_ID_MIN = 4_614_001;
export const AMERIABANK_TEST_ORDER_ID_MAX = 4_615_000;

export const AMERIABANK_ORDER_ID_LOCK_KEY = 902_104_880;

/** InitPayment success ResponseCode (number). */
export const AMERIABANK_INIT_SUCCESS_CODE = 1;

/** GetPaymentDetails / Cancel / Refund success prefix. */
export const AMERIABANK_DETAILS_SUCCESS_PREFIX = '00';

export const AMERIABANK_CALLBACK_PATH = '/api/v1/payments/ameriabank/callback';
