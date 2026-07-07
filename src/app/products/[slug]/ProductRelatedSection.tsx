import { RelatedProducts } from '@/components/RelatedProducts';
import { LazyWhenVisible } from '@/components/LazyWhenVisible';
import { findRelatedForStorefront } from '@/lib/services/products-slug/product-related.service';
import type { LanguageCode } from '@/lib/language';
import { PRODUCT_PDP_RELATED_PLACEHOLDER_MIN_HEIGHT_PX } from './constants';

interface ProductRelatedSectionProps {
  slug: string;
  lang: LanguageCode;
  productId: string;
  categoryId: string | null;
  categorySlug?: string;
}

/**
 * Async PDP section — related products load after the main product shell streams.
 */
export async function ProductRelatedSection({
  slug,
  lang,
  productId,
  categoryId,
  categorySlug,
}: ProductRelatedSectionProps) {
  const related = await findRelatedForStorefront(slug, lang, productId, categoryId);

  return (
    <LazyWhenVisible minHeightPx={PRODUCT_PDP_RELATED_PLACEHOLDER_MIN_HEIGHT_PX}>
      <RelatedProducts
        productSlug={slug}
        categorySlug={categorySlug}
        currentProductId={productId}
        initialProducts={related.data}
      />
    </LazyWhenVisible>
  );
}
