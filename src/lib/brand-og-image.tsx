import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { BRAND_ASSETS } from '../constants/brand';

const OG_IMAGE_WIDTH_PX = 1200;
const OG_IMAGE_HEIGHT_PX = 630;
const OG_LOGO_DISPLAY_PX = 360;

/** White canvas with centered navbar wordmark — shared by Open Graph + Twitter images. */
export async function createBrandOgImageResponse(): Promise<ImageResponse> {
  const logoPath = path.join(process.cwd(), 'public', BRAND_ASSETS.logoNavbar);
  const logoBuffer = await readFile(logoPath);
  const logoSrc = `data:image/png;base64,${logoBuffer.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
        }}
      >
        <img
          src={logoSrc}
          alt=""
          width={OG_LOGO_DISPLAY_PX}
          height={OG_LOGO_DISPLAY_PX}
          style={{ objectFit: 'contain' }}
        />
      </div>
    ),
    {
      width: OG_IMAGE_WIDTH_PX,
      height: OG_IMAGE_HEIGHT_PX,
    },
  );
}
