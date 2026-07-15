import {
  CHECKOUT_DELIVERY_CITY_VALUES,
  isCheckoutDeliveryCity,
  type CheckoutDeliveryCity,
} from '../constants/checkout-delivery-cities';

/** Localized / alternate spellings → checkout select values. */
const CITY_ALIASES: Record<string, CheckoutDeliveryCity> = {
  yerevan: 'Yerevan',
  երևան: 'Yerevan',
  ереван: 'Yerevan',
  aragatsotn: 'Aragatsotn',
  արագածոտն: 'Aragatsotn',
  арагацотн: 'Aragatsotn',
  ararat: 'Ararat',
  արարատ: 'Ararat',
  арарат: 'Ararat',
  armavir: 'Armavir',
  արմավիր: 'Armavir',
  армавир: 'Armavir',
  gegharkunik: 'Gegharkunik',
  գեղարքունիք: 'Gegharkunik',
  гехаркуник: 'Gegharkunik',
  kotayk: 'Kotayk',
  կոտայք: 'Kotayk',
  котайк: 'Kotayk',
  lori: 'Lori',
  լոռի: 'Lori',
  лори: 'Lori',
  shirak: 'Shirak',
  շիրակ: 'Shirak',
  ширак: 'Shirak',
  syunik: 'Syunik',
  սյունիք: 'Syunik',
  сюник: 'Syunik',
  tavush: 'Tavush',
  տավուշ: 'Tavush',
  тавуш: 'Tavush',
  'vayots dzor': 'Vayots Dzor',
  վայոցձոր: 'Vayots Dzor',
  'վայոց ձոր': 'Vayots Dzor',
  'вайоц дзор': 'Vayots Dzor',
};

/**
 * Maps a free-text profile city to a checkout delivery city value, if possible.
 */
export function resolveDeliveryCityFromProfile(
  city: string | undefined | null,
): CheckoutDeliveryCity | undefined {
  if (!city?.trim()) {
    return undefined;
  }

  const trimmed = city.trim();
  if (isCheckoutDeliveryCity(trimmed)) {
    return trimmed;
  }

  const normalized = trimmed.toLowerCase().replace(/\s+/g, ' ');
  const alias = CITY_ALIASES[normalized];
  if (alias) {
    return alias;
  }

  const compact = normalized.replace(/\s/g, '');
  const compactAlias = CITY_ALIASES[compact];
  if (compactAlias) {
    return compactAlias;
  }

  return CHECKOUT_DELIVERY_CITY_VALUES.find(
    (value) => value.toLowerCase() === normalized,
  );
}
