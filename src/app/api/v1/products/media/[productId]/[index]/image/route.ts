import { NextRequest, NextResponse } from 'next/server';
import { db } from '@white-shop/db';
import { processImageUrl, type ImageUrlInput } from '@/lib/utils/image-utils';
import { logger } from '@/lib/utils/logger';
import { createStoredImageResponse } from '@/lib/utils/serve-stored-image';

function parseMediaIndex(raw: string): number | null {
  const index = Number.parseInt(raw, 10);
  if (!Number.isInteger(index) || index < 0) {
    return null;
  }
  return index;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string; index: string }> },
) {
  try {
    const { productId, index: indexParam } = await params;
    const index = parseMediaIndex(indexParam);
    if (index === null) {
      return new NextResponse(null, { status: 404 });
    }

    const product = await db.product.findFirst({
      where: {
        id: productId,
        published: true,
        deletedAt: null,
      },
      select: { media: true },
    });

    if (!product || !Array.isArray(product.media) || index >= product.media.length) {
      return new NextResponse(null, { status: 404 });
    }

    const processed = processImageUrl(product.media[index] as ImageUrlInput);
    if (!processed) {
      return new NextResponse(null, { status: 404 });
    }

    return createStoredImageResponse(processed, req);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('GET product media image failed', { error: message });
    return new NextResponse(null, { status: 500 });
  }
}
