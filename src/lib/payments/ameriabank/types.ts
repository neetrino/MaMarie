export type AmeriabankLang = 'en' | 'am' | 'ru';

export type AmeriabankCredentials = {
  clientId: string;
  username: string;
  password: string;
};

export type AmeriabankConfig = {
  testMode: boolean;
  baseUrl: string;
  credentials: AmeriabankCredentials;
};

export type InitPaymentRequestBody = {
  ClientID: string;
  Username: string;
  Password: string;
  OrderID: number;
  Amount: number;
  Description: string;
  BackURL: string;
  Currency?: string;
  Opaque?: string;
  lang?: AmeriabankLang;
  Timeout?: number;
};

export type InitPaymentResponseBody = {
  PaymentID?: string;
  paymentID?: string;
  ResponseCode?: number | string;
  responseCode?: number | string;
  ResponseMessage?: string;
  responseMessage?: string;
};

export type GetPaymentDetailsRequestBody = {
  PaymentID: string;
  Username: string;
  Password: string;
};

export type GetPaymentDetailsResponseBody = {
  ResponseCode?: string | number;
  responseCode?: string | number;
  PaymentState?: string | number;
  paymentState?: string | number;
  OrderStatus?: string | number;
  orderStatus?: string | number;
  Amount?: number;
  amount?: number;
  Opaque?: string;
  opaque?: string;
  [key: string]: unknown;
};

export type AmeriabankProviderResponse = {
  ameriaOrderId?: number;
  paymentId?: string;
  initResponse?: InitPaymentResponseBody;
  detailsResponse?: GetPaymentDetailsResponseBody;
};
