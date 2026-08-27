import { NextRequest, NextResponse } from 'next/server';
import { db } from '@white-shop/db';
import { processImageUrl, smartSplitUrls } from '@/lib/utils/image-utils';
import { logger } from '@/lib/utils/logger';
import { createStoredImageResponse } from '@/lib/utils/serve-stored-image';

const DEFAULT_IMAGE_INDEX = 0;

function parseImageIndex(raw: string | null): number {
  if (!raw) {
    return DEFAULT_IMAGE_INDEX;
  }
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return DEFAULT_IMAGE_INDEX;
  }
  return parsed;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const imageIndex = parseImageIndex(req.nextUrl.searchParams.get('index'));

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

    const urls = smartSplitUrls(variant.imageUrl)
      .map((url) => processImageUrl(url))
      .filter((url): url is string => url !== null);

    const selectedUrl = urls[imageIndex] ?? urls[DEFAULT_IMAGE_INDEX];
    if (!selectedUrl) {
      return new NextResponse(null, { status: 404 });
    }

    return createStoredImageResponse(selectedUrl, req);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('GET variant image failed', { error: message });
    return new NextResponse(null, { status: 500 });
  }
}
