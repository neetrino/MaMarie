import { NextRequest, NextResponse } from 'next/server';
import { processImageUrl } from './image-utils';

const STORED_IMAGE_CACHE_CONTROL = 'public, max-age=86400, stale-while-revalidate=604800';

export function parseDataUrlImage(dataUrl: string): { mime: string; buffer: Buffer } | null {
  const match = dataUrl.match(/^data:(image\/[a-z+]+);base64,([\s\S]+)$/i);
  if (!match) {
    return null;
  }

  return {
    mime: match[1].toLowerCase(),
    buffer: Buffer.from(match[2], 'base64'),
  };
}

/** Serves a DB-stored image URL as bytes, or redirects http(s)/relative paths. */
export function createStoredImageResponse(rawUrl: string, req: NextRequest): NextResponse {
  const firstUrl = processImageUrl(rawUrl);
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
        'Cache-Control': STORED_IMAGE_CACHE_CONTROL,
      },
    });
  }

  if (firstUrl.startsWith('http://') || firstUrl.startsWith('https://')) {
    return NextResponse.redirect(firstUrl);
  }

  return NextResponse.redirect(new URL(firstUrl, req.url));
}
