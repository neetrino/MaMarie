import { notFound, redirect } from 'next/navigation';
import { DEFAULT_LANGUAGE } from '@/lib/language';
import { reviewsService } from '@/lib/services/reviews.service';
import { calculateAverageRating } from '@/components/ProductReviews/utils';
import type { Review } from '@/components/ProductReviews/utils';
import { ProductPageClient } from './ProductPageClient';
import { getProductBySlug } from './get-product-by-slug';
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

  const product = await getProductBySlug(slug, DEFAULT_LANGUAGE);
  if (!product) {
    notFound();
  }

  const reviews = (await reviewsService.getProductReviews(product.id, {
    publishedOnly: true,
  })) as Review[];

  return (
    <ProductPageClient
      slugParam={rawSlug}
      initialProduct={product}
      initialReviews={reviews}
      serverLang={DEFAULT_LANGUAGE}
    />
  );
}
