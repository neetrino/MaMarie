import { useState, useEffect, useCallback, useMemo } from 'react';
import { getOptionValue } from '../utils/variant-helpers';
import { findVariantByColorAndSize, findVariantByAllAttributes } from '../utils/variant-finders';
import { switchToVariantImage, handleColorSelect as handleColorSelectUtil } from '../utils/image-switching';
import type { Product, ProductVariant, VariantOption } from '../types';
import { selectDefaultVariant } from '@/lib/products/select-default-variant';

interface UseVariantSelectionProps {
  product: Product | null;
  images: string[];
  setCurrentImageIndex: (index: number) => void;
  initialVariantId?: string | null;
}

function resolveVariantById(
  product: Product,
  variantId: string
): ProductVariant | null {
  const byId = product.variants.find(
    (variant) => variant.id === variantId || variant.id.endsWith(variantId)
  );
  if (byId) {
    return byId;
  }

  const index = Number.parseInt(variantId, 10);
  if (Number.isFinite(index) && index > 0) {
    return product.variants[index - 1] ?? null;
  }

  return null;
}

function applyVariantSelection(
  variant: ProductVariant,
  getOptionValueFn: (options: VariantOption[] | undefined, key: string) => string | null,
  setSelectedVariant: (variant: ProductVariant | null) => void,
  setSelectedColor: (color: string | null) => void,
  setSelectedSize: (size: string | null) => void,
  switchToVariantImageFn: (variant: ProductVariant | null) => void
): void {
  setSelectedVariant(variant);
  const colorValue = getOptionValueFn(variant.options, 'color');
  if (colorValue) {
    setSelectedColor(colorValue);
  }
  const sizeValue = getOptionValueFn(variant.options, 'size');
  if (sizeValue) {
    setSelectedSize(sizeValue);
  }
  switchToVariantImageFn(variant);
}

export function useVariantSelection({
  product,
  images,
  setCurrentImageIndex,
  initialVariantId = null,
}: UseVariantSelectionProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedAttributeValues, setSelectedAttributeValues] = useState<Map<string, string>>(new Map());

  const getOptionValueFn = useCallback((options: VariantOption[] | undefined, key: string): string | null => {
    return getOptionValue(options, key);
  }, []);

  const findVariantByColorAndSizeFn = useCallback((color: string | null, size: string | null): ProductVariant | null => {
    return findVariantByColorAndSize(product, color, size);
  }, [product]);

  const findVariantByAllAttributesFn = useCallback((
    color: string | null,
    size: string | null,
    otherAttributes: Map<string, string>
  ): ProductVariant | null => {
    return findVariantByAllAttributes(product, color, size, otherAttributes);
  }, [product]);

  const switchToVariantImageFn = useCallback((variant: ProductVariant | null) => {
    switchToVariantImage(variant, product, images, setCurrentImageIndex);
  }, [product, images, setCurrentImageIndex]);

  // Initialize with URL variant or Main Variant (never cheapest / arbitrary first by price order).
  useEffect(() => {
    if (!product?.variants?.length || selectedVariant) {
      return;
    }

    const urlVariant = initialVariantId
      ? resolveVariantById(product, initialVariantId)
      : null;
    const initialVariant =
      urlVariant ??
      selectDefaultVariant(
        product.variants.map((variant) => ({
          ...variant,
          isMain: variant.isMain === true,
        }))
      ) ??
      product.variants[0];

    applyVariantSelection(
      initialVariant,
      getOptionValueFn,
      setSelectedVariant,
      setSelectedColor,
      setSelectedSize,
      switchToVariantImageFn
    );
  }, [
    product,
    selectedVariant,
    initialVariantId,
    getOptionValueFn,
    switchToVariantImageFn,
  ]);

  // Update variant when selections change
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      const newVariant = findVariantByAllAttributesFn(selectedColor, selectedSize, selectedAttributeValues);
      if (newVariant && newVariant.id !== selectedVariant?.id) {
        setSelectedVariant(newVariant);
        switchToVariantImageFn(newVariant);
        const sizeValue = getOptionValueFn(newVariant.options, 'size');
        if (sizeValue && sizeValue !== selectedSize?.toLowerCase().trim()) {
          setSelectedSize(sizeValue);
        }
      } else if (newVariant && newVariant.imageUrl) {
        switchToVariantImageFn(newVariant);
      }
    }
  }, [selectedColor, selectedSize, selectedAttributeValues, findVariantByAllAttributesFn, selectedVariant?.id, product, getOptionValueFn, switchToVariantImageFn]);

  const handleColorSelect = useCallback((color: string) => {
    handleColorSelectUtil(
      color,
      product,
      images,
      selectedColor,
      setSelectedColor,
      setCurrentImageIndex
    );
  }, [product, images, selectedColor, setSelectedColor, setCurrentImageIndex]);

  const handleSizeSelect = useCallback((size: string) => {
    if (selectedSize === size) {
      setSelectedSize(null);
    } else {
      setSelectedSize(size);
    }
  }, [selectedSize]);

  const handleAttributeValueSelect = useCallback((attrKey: string, value: string) => {
    const newMap = new Map(selectedAttributeValues);
    const currentValue = selectedAttributeValues.get(attrKey);
    if (currentValue === value) {
      newMap.delete(attrKey);
    } else {
      newMap.set(attrKey, value);
    }
    setSelectedAttributeValues(newMap);
  }, [selectedAttributeValues]);

  const currentVariant = useMemo(() => {
    return (
      selectedVariant ||
      findVariantByColorAndSizeFn(selectedColor, selectedSize) ||
      selectDefaultVariant(product?.variants ?? []) ||
      product?.variants?.[0] ||
      null
    );
  }, [selectedVariant, findVariantByColorAndSizeFn, selectedColor, selectedSize, product?.variants]);

  return {
    selectedVariant,
    setSelectedVariant,
    selectedColor,
    selectedSize,
    selectedAttributeValues,
    currentVariant,
    getOptionValue: getOptionValueFn,
    handleColorSelect,
    handleSizeSelect,
    handleAttributeValueSelect,
  };
}
