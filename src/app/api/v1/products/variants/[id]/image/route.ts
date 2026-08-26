import { NextRequest, NextResponse } from 'next/server';
import { db } from '@white-shop/db';
import { processImageUrl, smartSplitUrls } from '@/lib/utils/image-utils';
import { logger } from '@/lib/utils/logger';
import { createStoredImageResponse } from '@/lib/utils/serve-stored-image';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const variant = await db.productVariant.findFirst({
      where: {
        id,
        published: true,
        product: { published: true, deletedAt: null },
      },
      select: { imageUrl: true },
    });

    if (!variant?.imageUrl) {
      return new NextResponse(null, { status: 404 });
    }

    const firstUrl = smartSplitUrls(variant.imageUrl)
      .map((url) => processImageUrl(url))
      .find((url): url is string => url !== null);

    if (!firstUrl) {
      return new NextResponse(null, { status: 404 });
    }

    return createStoredImageResponse(firstUrl, req);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('GET variant image failed', { error: message });
    return new NextResponse(null, { status: 500 });
  }
}
