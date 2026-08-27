/** Attribute keys shown as read-only product info, not variant selectors. */
export const PRODUCT_PDP_INFO_ATTRIBUTE_KEYS = ['material'] as const;

export function isProductInfoAttribute(attrKey: string): boolean {
  return (PRODUCT_PDP_INFO_ATTRIBUTE_KEYS as readonly string[]).includes(attrKey);
}
