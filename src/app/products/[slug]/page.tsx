import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { DEFAULT_LANGUAGE } from '@/lib/language';
import { ProductPageClient } from './ProductPageClient';
import { ProductRelatedFallback } from './ProductRelatedFallback';
import { ProductRelatedSection } from './ProductRelatedSection';
import { getProductPageCore } from './get-product-by-slug';
import { RESERVED_ROUTES } from './types';

/** Aligned with STOREFRONT_CACHE_TTL.productDetails (300s). */
export const revalidate = 300;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug: rawSlug } = await params;
  const slugParts = rawSlug.includes(':') ? rawSlug.split(':') : [rawSlug];
  const slug = slugParts[0] ?? '';

  if (!slug) {
    notFound();
  }

  if (RESERVED_ROUTES.includes(slug.toLowerCase())) {
    redirect(`/${slug}`);
  }

  const core = await getProductPageCore(slug, DEFAULT_LANGUAGE);
  if (!core) {
    notFound();
  }

  const { product, reviews } = core;

  const primaryCategory = product.categories?.[0];

  return (
    <ProductPageClient
      slugParam={rawSlug}
      initialProduct={product}
      initialReviews={reviews}
      serverLang={DEFAULT_LANGUAGE}
      relatedSection={
        <Suspense fallback={<ProductRelatedFallback />}>
          <ProductRelatedSection
            slug={slug}
            lang={DEFAULT_LANGUAGE}
            productId={product.id}
            categoryId={primaryCategory?.id ?? null}
            categorySlug={primaryCategory?.slug}
          />
        </Suspense>
      }
    />
  );
}
