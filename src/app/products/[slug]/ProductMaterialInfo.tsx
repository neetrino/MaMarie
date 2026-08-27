'use client';

import type { LanguageCode } from '../../../lib/language';
import { t } from '../../../lib/i18n';
import {
  PRODUCT_PDP_INFO_ATTRIBUTE_LABEL_CLASS,
  PRODUCT_PDP_INFO_ATTRIBUTE_ROW_CLASS,
  PRODUCT_PDP_INFO_ATTRIBUTE_SEPARATOR,
  PRODUCT_PDP_INFO_ATTRIBUTE_SEPARATOR_CLASS,
  PRODUCT_PDP_INFO_ATTRIBUTE_VALUE_CLASS,
} from './constants';
import type { AttributeGroupValue, Product } from './types';
import {
  resolveAttributeNameDisplay,
  resolveAttributeValueDisplayLabel,
} from './utils/attribute-display-label';
import { isProductInfoAttribute } from './utils/is-product-info-attribute';

interface ProductMaterialInfoProps {
  product: Product;
  attributeGroups: Map<string, AttributeGroupValue[]>;
  language: LanguageCode;
}

function resolveInfoAttributeLabel(
  language: LanguageCode,
  attrKey: string,
  product: Product,
): string {
  if (attrKey === 'material') {
    return t(language, 'product.material');
  }

  const productAttr = product.productAttributes?.find(
    (pa) => pa.attribute?.key === attrKey,
  );
  return resolveAttributeNameDisplay(
    language,
    attrKey,
    productAttr?.attribute?.name,
  );
}

/** Read-only product info (material) — shown under the description, not as a selector. */
export function ProductMaterialInfo({
  product,
  attributeGroups,
  language,
}: ProductMaterialInfoProps) {
  const infoEntries = Array.from(attributeGroups.entries()).filter(
    ([attrKey, groups]) => isProductInfoAttribute(attrKey) && groups.length > 0,
  );

  if (infoEntries.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 space-y-3">
      {infoEntries.map(([attrKey, groups]) => {
        const label = resolveInfoAttributeLabel(language, attrKey, product);
        const value = groups
          .map((group) =>
            resolveAttributeValueDisplayLabel(
              language,
              attrKey,
              group.value,
              group.label,
            ),
          )
          .join(', ');

        return (
          <div key={attrKey} className={PRODUCT_PDP_INFO_ATTRIBUTE_ROW_CLASS}>
            <span className={PRODUCT_PDP_INFO_ATTRIBUTE_LABEL_CLASS}>{label}</span>
            <span aria-hidden className={PRODUCT_PDP_INFO_ATTRIBUTE_SEPARATOR_CLASS}>
              {PRODUCT_PDP_INFO_ATTRIBUTE_SEPARATOR}
            </span>
            <span className={PRODUCT_PDP_INFO_ATTRIBUTE_VALUE_CLASS}>{value}</span>
          </div>
        );
      })}
    </div>
  );
}
