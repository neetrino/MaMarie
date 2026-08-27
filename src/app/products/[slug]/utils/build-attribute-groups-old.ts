import type { Product, ProductVariant, AttributeGroupValue } from '../types';
import { getCurrentSelections } from './variant-compatibility';
import { calculateStock } from './stock-calculator';

interface BuildGroupsFromVariantsProps {
  product: Product;
  selectedColor: string | null;
  selectedSize: string | null;
  selectedAttributeValues: Map<string, string>;
}

type ValueBucket = {
  value: string;
  label: string;
  variants: ProductVariant[];
};

/**
 * Build attribute groups from variants (old format)
 */
export function buildGroupsFromVariants({
  product,
  selectedColor,
  selectedSize,
  selectedAttributeValues,
}: BuildGroupsFromVariantsProps): Map<string, AttributeGroupValue[]> {
  const groups = new Map<string, AttributeGroupValue[]>();

  if (!product?.variants) {
    return groups;
  }

  const colorMap = new Map<string, ValueBucket>();
  const sizeMap = new Map<string, ValueBucket>();
  const otherAttributesMap = new Map<string, Map<string, ValueBucket>>();

  product.variants.forEach((variant) => {
    variant.options?.forEach((opt) => {
      const attrKey = opt.key || opt.attribute || '';
      const value = opt.value || '';
      const label = opt.label?.trim() || value;

      if (!value) return;

      if (attrKey === 'color') {
        const normalizedColor = value.toLowerCase().trim();
        const bucket = colorMap.get(normalizedColor);
        if (!bucket) {
          colorMap.set(normalizedColor, { value: normalizedColor, label, variants: [variant] });
          return;
        }
        if (!bucket.variants.some((v) => v.id === variant.id)) {
          bucket.variants.push(variant);
        }
        return;
      }

      if (attrKey === 'size') {
        const normalizedSize = value.toLowerCase().trim();
        const bucket = sizeMap.get(normalizedSize);
        if (!bucket) {
          sizeMap.set(normalizedSize, { value: normalizedSize, label, variants: [variant] });
          return;
        }
        if (!bucket.variants.some((v) => v.id === variant.id)) {
          bucket.variants.push(variant);
        }
        return;
      }

      if (!attrKey) return;

      if (!otherAttributesMap.has(attrKey)) {
        otherAttributesMap.set(attrKey, new Map());
      }
      const valueMap = otherAttributesMap.get(attrKey)!;
      const normalizedValue = value.toLowerCase().trim();
      const bucket = valueMap.get(normalizedValue);
      if (!bucket) {
        valueMap.set(normalizedValue, { value: normalizedValue, label, variants: [variant] });
        return;
      }
      if (!bucket.variants.some((v) => v.id === variant.id)) {
        bucket.variants.push(variant);
      }
    });
  });

  const colorSelections = getCurrentSelections(
    'color',
    selectedColor,
    selectedSize,
    selectedAttributeValues,
  );
  const sizeSelections = getCurrentSelections(
    'size',
    selectedColor,
    selectedSize,
    selectedAttributeValues,
  );

  if (colorMap.size > 0) {
    groups.set(
      'color',
      Array.from(colorMap.values()).map((bucket) => ({
        value: bucket.value,
        label: bucket.label,
        stock: calculateStock(bucket.variants, colorSelections, 'color'),
        variants: bucket.variants,
      })),
    );
  }

  if (sizeMap.size > 0) {
    groups.set(
      'size',
      Array.from(sizeMap.values()).map((bucket) => ({
        value: bucket.value,
        label: bucket.label,
        stock: calculateStock(bucket.variants, sizeSelections, 'size'),
        variants: bucket.variants,
      })),
    );
  }

  otherAttributesMap.forEach((valueMap, attrKey) => {
    const attrSelections = getCurrentSelections(
      attrKey,
      selectedColor,
      selectedSize,
      selectedAttributeValues,
    );

    groups.set(
      attrKey,
      Array.from(valueMap.values()).map((bucket) => ({
        value: bucket.value,
        label: bucket.label,
        stock: calculateStock(bucket.variants, attrSelections, attrKey),
        variants: bucket.variants,
        imageUrl: null,
        colors: null,
      })),
    );
  });

  return groups;
}
