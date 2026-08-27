/**
 * One-time: move product_variants.imageUrl base64 blobs to Cloudflare R2.
 * Keeps storefront contract — URLs become https R2 links (API route still redirects).
 *
 * Usage (from repo root, with .env loaded):
 *   node scripts/migrate-variant-images-to-r2.cjs
 */
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require(
  require.resolve('@prisma/client', { paths: [process.cwd()] })
);
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { randomBytes } = require('crypto');

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, 'utf8');
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;
const publicUrl = process.env.R2_PUBLIC_URL;

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
  console.error('R2 env vars missing. Aborting.');
  process.exit(1);
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
};

function smartSplitUrls(str) {
  if (!str) return [];
  if (!str.includes('data:image/')) {
    return str.split(',').map((s) => s.trim()).filter(Boolean);
  }
  const results = [];
  let i = 0;
  while (i < str.length) {
    if (str.substring(i).startsWith('data:image/')) {
      const headerEnd = str.indexOf(',', i);
      if (headerEnd === -1) {
        results.push(str.substring(i).trim());
        break;
      }
      let nextSeparator = str.length;
      for (let j = headerEnd + 1; j < str.length; j++) {
        if (str[j] !== ',') continue;
        const afterComma = str.substring(j + 1).trim();
        if (
          afterComma.startsWith('data:image/') ||
          afterComma.startsWith('http://') ||
          afterComma.startsWith('https://') ||
          afterComma.startsWith('/')
        ) {
          nextSeparator = j;
          break;
        }
      }
      const part = str.substring(i, nextSeparator).trim();
      if (part) results.push(part);
      i = nextSeparator + 1;
    } else {
      const nextComma = str.indexOf(',', i);
      if (nextComma === -1) {
        const url = str.substring(i).trim();
        if (url) results.push(url);
        break;
      }
      const url = str.substring(i, nextComma).trim();
      if (url) results.push(url);
      i = nextComma + 1;
    }
  }
  return results.filter(Boolean);
}

function parseDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:(image\/[a-z+]+);base64,([\s\S]+)$/i);
  if (!match) return null;
  return { mime: match[1].toLowerCase(), buffer: Buffer.from(match[2], 'base64') };
}

async function upload(buffer, mime) {
  const ext = MIME_TO_EXT[mime] ?? 'jpg';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const key = `products/variants/${date}-${randomBytes(5).toString('hex')}.${ext}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: mime,
    })
  );
  return `${publicUrl.replace(/\/$/, '')}/${key}`;
}

async function migrateVariantImageUrl(raw) {
  const parts = smartSplitUrls(raw);
  if (parts.length === 0) return null;
  if (!parts.some((p) => p.startsWith('data:image/'))) return parts.join(',');

  const out = [];
  for (const part of parts) {
    if (!part.startsWith('data:image/')) {
      out.push(part);
      continue;
    }
    const parsed = parseDataUrl(part);
    if (!parsed) throw new Error('Invalid data URL');
    out.push(await upload(parsed.buffer, parsed.mime));
  }
  return out.join(',');
}

async function main() {
  const db = new PrismaClient();
  const rows = await db.$queryRawUnsafe(`
    SELECT id, length("imageUrl")::int AS bytes
    FROM product_variants
    WHERE "imageUrl" IS NOT NULL
      AND position('data:image/' in "imageUrl") > 0
    ORDER BY length("imageUrl") DESC
  `);

  console.log(`Found ${rows.length} variants with inline base64 images`);
  let ok = 0;
  let fail = 0;

  for (const row of rows) {
    try {
      const full = await db.productVariant.findUnique({
        where: { id: row.id },
        select: { id: true, imageUrl: true },
      });
      if (!full?.imageUrl) continue;

      const next = await migrateVariantImageUrl(full.imageUrl);
      if (!next) continue;

      await db.productVariant.update({
        where: { id: full.id },
        data: { imageUrl: next },
      });
      ok += 1;
      console.log(`OK ${full.id}  ${row.bytes} bytes → ${next.slice(0, 80)}...`);
    } catch (error) {
      fail += 1;
      console.error(`FAIL ${row.id}`, error.message || error);
    }
  }

  const after = await db.$queryRawUnsafe(`
    SELECT
      COUNT(*) FILTER (WHERE position('data:image/' in coalesce("imageUrl",'')) > 0)::int AS still_inline,
      COALESCE(SUM(length("imageUrl")),0)::bigint AS total_bytes
    FROM product_variants
  `);
  console.log('Done', { ok, fail, after: after[0] });
  await db.$disconnect();
  if (fail > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
