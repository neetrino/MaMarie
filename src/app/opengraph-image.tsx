import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { BRAND_ASSETS } from '../constants/brand';

export const runtime = 'nodejs';
export const alt = 'MaMarie';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

const OG_LOGO_DISPLAY_PX = 360;

/** Link-preview image — white canvas with navbar wordmark. */
export default async function OpenGraphImage() {
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
    { ...size },
  );
}
