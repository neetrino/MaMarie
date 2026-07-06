import type { Metadata } from 'next';
import { DEFAULT_LANGUAGE } from '@/lib/language';
import { getProductBySlug } from './get-product-by-slug';

const DEFAULT_TITLE = 'Product';
const SITE_NAME = 'MAMARIE';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = rawSlug.includes(':') ? rawSlug.split(':')[0] : rawSlug;

  try {
    const product = await getProductBySlug(slug, DEFAULT_LANGUAGE);
    if (!product) {
      return { title: `${DEFAULT_TITLE} | ${SITE_NAME}` };
    }

    const title = product.title || DEFAULT_TITLE;
    const description = product.description || null;
    const firstImage =
      Array.isArray(product.media) && product.media.length > 0
        ? String(typeof product.media[0] === 'string' ? product.media[0] : product.media[0]?.url ?? '')
        : null;

    return {
      title: `${title} | ${SITE_NAME}`,
      description: description ?? undefined,
      openGraph: {
        title,
        description: description ?? undefined,
        ...(firstImage && { images: [{ url: firstImage, alt: title }] }),
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: description ?? undefined,
        ...(firstImage && { images: [firstImage] }),
      },
    };
  } catch {
    return {
      title: `${DEFAULT_TITLE} | ${SITE_NAME}`,
    };
  }
}

export default function ProductSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
