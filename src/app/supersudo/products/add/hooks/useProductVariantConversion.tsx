'use client';

import { useEffect } from 'react';
import { convertPrice, type CurrencyCode } from '@/lib/currency';
import { smartSplitUrls } from '@/lib/utils/image-utils';
import type { GeneratedVariant } from '../types';
import { ensureOneMainVariant } from '../utils/variantMainHelpers';
import { logger } from "@/lib/utils/logger";

interface UseProductVariantConversionProps {
  productId: string | null;
  attributes: any[];
  defaultCurrency: CurrencyCode;
  /** True after edit load parked variants on window — triggers conversion when attributes are ready. */
  hasVariantsToLoad: boolean;
  setSelectedAttributesForVariants: (attrs: Set<string>) => void;
  setSelectedAttributeValueIds: (ids: Record<string, string[]>) => void;
  setGeneratedVariants: (variants: GeneratedVariant[]) => void;
  setHasVariantsToLoad: (has: boolean) => void;
}

function parseVariantNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export function useProductVariantConversion({
  productId,
  attributes,
  defaultCurrency,
  hasVariantsToLoad,
  setSelectedAttributesForVariants,
  setSelectedAttributeValueIds,
  setGeneratedVariants,
  setHasVariantsToLoad,
}: UseProductVariantConversionProps) {
  useEffect(() => {
    if (productId && attributes.length > 0 && (window as any).__productVariantsToConvert) {
      const productVariants = (window as any).__productVariantsToConvert;
      logger.debug('🔄 [ADMIN] Converting product variants to generatedVariants format:', {
        variantsCount: productVariants.length,
        attributesCount: attributes.length,
        firstVariant: productVariants[0],
      });
      
      const attributeIdsSet = new Set<string>();
      const attributeValueIdsMap: Record<string, string[]> = {};
      
      productVariants.forEach((variant: any) => {
        if (variant.options && Array.isArray(variant.options)) {
          variant.options.forEach((opt: any) => {
            let attributeId = opt.attributeId;
            let valueId = opt.valueId;
            
            if (!attributeId && opt.attributeValue) {
              attributeId = opt.attributeValue.attributeId || opt.attributeValue.attribute?.id;
            }
            if (!valueId && opt.attributeValue) {
              valueId = opt.attributeValue.id;
            }
            
            if (attributeId && valueId) {
              attributeIdsSet.add(attributeId);
              
              if (!attributeValueIdsMap[attributeId]) {
                attributeValueIdsMap[attributeId] = [];
              }
              if (!attributeValueIdsMap[attributeId].includes(valueId)) {
                attributeValueIdsMap[attributeId].push(valueId);
              }
            }
          });
        }
      });
      
      const productAttributeIds = (window as any).__productAttributeIds || [];
      if (productAttributeIds.length > 0) {
        logger.debug('📋 [ADMIN] Adding product attributeIds to selected attributes:', productAttributeIds);
        productAttributeIds.forEach((attrId: string) => {
          attributeIdsSet.add(attrId);
        });
      }
      
      if (attributeIdsSet.size > 0) {
        logger.debug('📋 [ADMIN] Setting selectedAttributesForVariants with all attributes:', Array.from(attributeIdsSet));
        setSelectedAttributesForVariants(attributeIdsSet);
      }
      
      if (Object.keys(attributeValueIdsMap).length > 0) {
        setSelectedAttributeValueIds(attributeValueIdsMap);
      }
      
      interface VariantData {
        id: string;
        selectedValueIds: string[];
        price: number;
        compareAtPrice: number | null;
        stock: number;
        sku: string;
        images: string[];
        isMain?: boolean;
        originalVariantIds: string[];
      }
      
      const variantDataList: VariantData[] = [];
      
      productVariants.forEach((variant: any, variantIndex: number) => {
        const selectedValueIds: string[] = [];
        
        if (variant.attributes && typeof variant.attributes === 'object') {
          logger.debug(`🔍 [ADMIN] Variant ${variantIndex} has attributes JSONB:`, variant.attributes);
          
          Object.keys(variant.attributes).forEach((attributeKey) => {
            const attribute = attributes.find(a => a.key === attributeKey);
            if (!attribute) {
              console.warn(`⚠️ [ADMIN] Attribute not found for key: ${attributeKey}`);
              return;
            }
            
            const attributeValues = variant.attributes[attributeKey];
            if (Array.isArray(attributeValues)) {
              attributeValues.forEach((attrValue: any) => {
                const valueId = attrValue.valueId || attrValue.id;
                const value = attrValue.value || attrValue;
                
                if (valueId) {
                  if (!selectedValueIds.includes(valueId)) {
                    selectedValueIds.push(valueId);
                  }
                } else if (value) {
                  const foundValue = attribute.values.find((v: { id: string; value: string; label: string }) => 
                    v.value === value || v.label === value
                  );
                  if (foundValue && !selectedValueIds.includes(foundValue.id)) {
                    selectedValueIds.push(foundValue.id);
                  }
                }
              });
            }
          });
        }
        
        if (selectedValueIds.length === 0 && variant.options && Array.isArray(variant.options)) {
          logger.debug(`🔍 [ADMIN] Variant ${variantIndex} using options fallback:`, variant.options);

          variant.options.forEach((opt: any) => {
            let attributeId = opt.attributeId;
            let valueId = opt.valueId;
            let attributeKey = opt.attributeKey;

            if (!attributeId && opt.attributeValue) {
              attributeId = opt.attributeValue.attributeId || opt.attributeValue.attribute?.id;
              attributeKey = opt.attributeValue.attribute?.key || opt.attributeValue.attributeKey;
            }
            if (!valueId && opt.attributeValue) {
              valueId = opt.attributeValue.id || opt.attributeValue.valueId;
            }

            if (!attributeId && opt.attributeKey) {
              const foundAttr = attributes.find((a: { key: string; id: string }) => a.key === opt.attributeKey);
              if (foundAttr) {
                attributeId = foundAttr.id;
                attributeKey = foundAttr.key;
              }
            }

            if (attributeId && !valueId && opt.value) {
              const foundAttr = attributes.find((a: { id: string; values: Array<{ id: string; value: string; label: string }> }) => a.id === attributeId);
              if (foundAttr) {
                const foundValue = foundAttr.values.find(
                  (v: { id: string; value: string; label: string }) =>
                    v.value === opt.value || v.label === opt.value
                );
                if (foundValue) {
                  valueId = foundValue.id;
                }
              }
            }

            if (!valueId && attributeKey && opt.value) {
              const foundAttr = attributes.find((a: { key: string }) => a.key === attributeKey);
              if (foundAttr) {
                const foundValue = foundAttr.values.find(
                  (v: { id: string; value: string; label: string }) =>
                    v.value === opt.value || v.label === opt.value
                );
                if (foundValue) {
                  valueId = foundValue.id;
                }
              }
            }

            if (valueId && !selectedValueIds.includes(valueId)) {
              selectedValueIds.push(valueId);
            }
          });
        }
        
        const variantImages =
          typeof variant.imageUrl === 'string' && variant.imageUrl.trim()
            ? smartSplitUrls(variant.imageUrl)
            : [];
        if (variantImages.length > 0) {
          logger.debug(`🖼️ [ADMIN] Variant ${variantIndex} imageUrl count:`, variantImages.length);
        } else {
          logger.debug(`🖼️ [ADMIN] Variant ${variantIndex} has no imageUrl`);
        }

        const rawPrice = parseVariantNumber(variant.price);
        const rawCompareAt =
          variant.compareAtPrice !== undefined &&
          variant.compareAtPrice !== null &&
          String(variant.compareAtPrice).trim() !== ''
            ? parseVariantNumber(variant.compareAtPrice)
            : null;
        const priceInDefaultCurrency =
          rawPrice > 0 ? convertPrice(rawPrice, 'USD', defaultCurrency) : 0;
        const compareAtPriceInDefaultCurrency =
          rawCompareAt !== null && rawCompareAt > 0
            ? convertPrice(rawCompareAt, 'USD', defaultCurrency)
            : null;
        const stockValue = parseVariantNumber(variant.stock);

        variantDataList.push({
          id: variant.id || `variant-${Date.now()}-${variantIndex}-${Math.random()}`,
          selectedValueIds: selectedValueIds.sort(),
          price: priceInDefaultCurrency,
          compareAtPrice: compareAtPriceInDefaultCurrency,
          stock: stockValue,
          sku: variant.sku || '',
          images: variantImages,
          isMain: variant.isMain === true,
          originalVariantIds: [variant.id || `variant-${variantIndex}`],
        });
      });
      
      const variantGroups = new Map<string, VariantData[]>();
      
      variantDataList.forEach((variantData) => {
        const valueIdsKey = variantData.selectedValueIds.join(',');
        const priceKey = variantData.price.toString();
        const compareAtPriceKey = variantData.compareAtPrice !== null ? variantData.compareAtPrice.toString() : 'null';
        
        const groupKey = `${valueIdsKey}|${priceKey}|${compareAtPriceKey}`;
        
        if (!variantGroups.has(groupKey)) {
          variantGroups.set(groupKey, []);
        }
        variantGroups.get(groupKey)!.push(variantData);
      });
      
      const builtVariants: GeneratedVariant[] = [];
      const productMainImage = (window as { __productMainImage?: string }).__productMainImage ?? '';

      variantGroups.forEach((group) => {
        const allValueIds = new Set<string>();
        group.forEach(variantData => {
          variantData.selectedValueIds.forEach(valueId => {
            allValueIds.add(valueId);
          });
        });
        
        const firstVariant = group[0];
        const allStocksSame = group.every(v => v.stock === firstVariant.stock);
        const stockValue = allStocksSame ? firstVariant.stock : firstVariant.stock;
        
        const combinedSku = group.length === 1 
          ? firstVariant.sku 
          : group.map(v => v.sku).filter(Boolean).join(', ');
        
        const combinedImages = group.reduce<string[]>((acc, item) => {
          for (const img of item.images) {
            if (!acc.includes(img)) acc.push(img);
          }
          return acc;
        }, []);

        const groupIsMain = group.some((item) => item.isMain);

        builtVariants.push({
          id: `variant-group-${Date.now()}-${Math.random()}`,
          selectedValueIds: Array.from(allValueIds).sort(),
          price: firstVariant.price.toString(),
          compareAtPrice: firstVariant.compareAtPrice !== null ? firstVariant.compareAtPrice.toString() : '',
          stock: stockValue.toString(),
          sku: combinedSku,
          images: combinedImages,
          isMain: groupIsMain,
        });
        
        logger.debug(`✅ [ADMIN] Grouped ${group.length} variants into 1 row:`, {
          valueIds: Array.from(allValueIds),
          price: firstVariant.price,
          stock: stockValue,
          imagesCount: combinedImages.length,
          originalVariantIds: group.flatMap(v => v.originalVariantIds),
        });
      });

      const imagesMatch = (a: string, b: string): boolean =>
        a === b || a.includes(b) || b.includes(a);

      const hasExplicitMain = builtVariants.some((v) => v.isMain);
      let convertedVariants: GeneratedVariant[];

      if (hasExplicitMain) {
        convertedVariants = ensureOneMainVariant(builtVariants);
      } else {
        const mainIndex = productMainImage
          ? builtVariants.findIndex(
              (v) => v.images.some((img) => imagesMatch(img, productMainImage))
            )
          : -1;
        const resolvedMainIndex = mainIndex >= 0 ? mainIndex : 0;
        convertedVariants = builtVariants.map((variant, index) => ({
          ...variant,
          isMain: index === resolvedMainIndex,
        }));
        convertedVariants = ensureOneMainVariant(convertedVariants);
      }

      if (convertedVariants.length > 0) {
        const variantsWithMain = ensureOneMainVariant(convertedVariants);
        setGeneratedVariants(variantsWithMain);
        logger.debug('✅ [ADMIN] Converted product variants to generatedVariants:', {
          totalVariants: variantsWithMain.length,
          totalOriginalVariants: productVariants.length,
          attributeValueIdsMap,
          convertedVariants: variantsWithMain.map(v => ({
            id: v.id,
            valueIdsCount: v.selectedValueIds.length,
            price: v.price,
            stock: v.stock,
            sku: v.sku,
          })),
        });
        delete (window as { __productVariantsToConvert?: unknown }).__productVariantsToConvert;
        delete (window as { __productMainImage?: string }).__productMainImage;
        setHasVariantsToLoad(false);
      } else {
        console.warn('⚠️ [ADMIN] No variants converted. Check variant options structure:', {
          variantsCount: productVariants.length,
          firstVariantOptions: productVariants[0]?.options,
        });
        delete (window as { __productVariantsToConvert?: unknown }).__productVariantsToConvert;
        delete (window as { __productMainImage?: string }).__productMainImage;
        setHasVariantsToLoad(false);
      }
    } else if (productId && attributes.length > 0 && hasVariantsToLoad) {
      logger.debug('ℹ️ [ADMIN] Waiting for variants to convert. Attributes loaded:', attributes.length);
    }
  }, [
    productId,
    attributes,
    defaultCurrency,
    hasVariantsToLoad,
    setSelectedAttributesForVariants,
    setSelectedAttributeValueIds,
    setGeneratedVariants,
    setHasVariantsToLoad,
  ]);
}

