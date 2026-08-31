import type { Metadata } from 'next';
import { DEFAULT_LANGUAGE } from '@/lib/language';
import { normalizeProductSlug } from '@/lib/products/parse-product-slug-param';
import { getProductPageCore } from './get-product-by-slug';

const DEFAULT_TITLE = 'Product';
const SITE_NAME = 'MaMarie';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = normalizeProductSlug(rawSlug);

  try {
    const core = await getProductPageCore(slug, DEFAULT_LANGUAGE);
    const product = core?.product;
    if (!product) {
      return { title: `${DEFAULT_TITLE} | ${SITE_NAME}` };
    }

    const title = product.title || DEFAULT_TITLE;
    const description = product.description || null;

    return {
      title: `${title} | ${SITE_NAME}`,
      description: description ?? undefined,
      openGraph: {
        title,
        description: description ?? undefined,
        type: 'website',
        siteName: SITE_NAME,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: description ?? undefined,
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
