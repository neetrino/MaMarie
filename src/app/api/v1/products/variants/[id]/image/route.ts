import { NextRequest, NextResponse } from 'next/server';
import { db } from '@white-shop/db';
import { processImageUrl, smartSplitUrls } from '@/lib/utils/image-utils';
import { logger } from '@/lib/utils/logger';

const CACHE_CONTROL = 'public, max-age=86400, stale-while-revalidate=604800';

function parseDataUrlImage(dataUrl: string): { mime: string; buffer: Buffer } | null {
  const match = dataUrl.match(/^data:(image\/[a-z+]+);base64,([\s\S]+)$/i);
  if (!match) {
    return null;
  }

  return {
    mime: match[1].toLowerCase(),
    buffer: Buffer.from(match[2], 'base64'),
  };
}

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

    if (firstUrl.startsWith('data:image/')) {
      const parsed = parseDataUrlImage(firstUrl);
      if (!parsed) {
        return new NextResponse(null, { status: 404 });
      }

      return new NextResponse(new Uint8Array(parsed.buffer), {
        headers: {
          'Content-Type': parsed.mime,
          'Cache-Control': CACHE_CONTROL,
        },
      });
    }

    if (firstUrl.startsWith('http://') || firstUrl.startsWith('https://')) {
      return NextResponse.redirect(firstUrl);
    }

    const absolute = new URL(firstUrl, req.url);
    return NextResponse.redirect(absolute);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('GET variant image failed', { error: message });
    return new NextResponse(null, { status: 500 });
  }
}
