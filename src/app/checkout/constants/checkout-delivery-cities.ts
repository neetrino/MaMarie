/** Stable keys for checkout delivery city select — values sent to delivery price API. */
export const CHECKOUT_DELIVERY_CITY_VALUES = [
  'Yerevan',
  'Aragatsotn',
  'Ararat',
  'Armavir',
  'Gegharkunik',
  'Kotayk',
  'Lori',
  'Shirak',
  'Syunik',
  'Tavush',
  'Vayots Dzor',
] as const;

export type CheckoutDeliveryCity = (typeof CHECKOUT_DELIVERY_CITY_VALUES)[number];

/** i18n key suffix under `checkout.deliveryCities.*` for each city value. */
export const CHECKOUT_DELIVERY_CITY_I18N_KEYS: Record<CheckoutDeliveryCity, string> = {
  Yerevan: 'yerevan',
  Aragatsotn: 'aragatsotn',
  Ararat: 'ararat',
  Armavir: 'armavir',
  Gegharkunik: 'gegharkunik',
  Kotayk: 'kotayk',
  Lori: 'lori',
  Shirak: 'shirak',
  Syunik: 'syunik',
  Tavush: 'tavush',
  'Vayots Dzor': 'vayotsDzor',
};

export function getCheckoutDeliveryCityLabel(
  t: (key: string) => string,
  city: CheckoutDeliveryCity,
): string {
  const key = CHECKOUT_DELIVERY_CITY_I18N_KEYS[city];
  return t(`checkout.deliveryCities.${key}`);
}

export function resolveCheckoutDeliveryCityDisplayLabel(
  t: (key: string) => string,
  city: string | undefined,
): string | undefined {
  if (!city?.trim()) {
    return undefined;
  }

  if (isCheckoutDeliveryCity(city)) {
    return getCheckoutDeliveryCityLabel(t, city);
  }

  return city;
}
