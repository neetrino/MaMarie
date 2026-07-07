#!/usr/bin/env node
/**
 * Optimizer for static assets in public/.
 * 1. Resize oversized PNG/JPEG to ~2× display bounds (sharp).
 * 2. Optional second pass: `pngquant --quality=65-88 --speed 1 --force --output FILE FILE`
 *    on photo-like PNGs >100 KB (brew install pngquant).
 *
 * Usage: node scripts/optimize-public-images.mjs
 */
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import { join, relative } from 'node:path';
import sharp from 'sharp';

const PUBLIC_DIR = new URL('../public', import.meta.url).pathname;
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg']);

/** @type {Array<{ match?: RegExp; maxDim: number; palette: boolean }>} */
const RULES = [
  { match: /\/hero\//, maxDim: 1800, palette: true },
  { match: /\/home\/about-us\/section-photo/, maxDim: 1800, palette: false },
  { match: /\/home\/about-us\/deco-/, maxDim: 800, palette: true },
  { match: /\/footer\/deco-/, maxDim: 800, palette: true },
  { match: /\/home\/sale-banner/, maxDim: 1400, palette: false },
  { match: /\/mobile\/sale-banner-girl/, maxDim: 800, palette: false },
  { match: /\/home\/why-us\//, maxDim: 700, palette: false },
  { match: /\/brand\/.*logo|\/footer\/logo|\/home\/about-us\/logo/, maxDim: 400, palette: true },
  { match: /\/contact\/icon-|\/footer\/icon-mail\.png/, maxDim: 256, palette: true },
  { match: /\/payments\/|\/footer\/payments\//, maxDim: 256, palette: true },
  { match: /\/profile\//, maxDim: 512, palette: false },
  { match: /\/cart\/|\/wishlist\/|\/orders\//, maxDim: 800, palette: true },
  { match: /\/not-found\//, maxDim: 1200, palette: true },
  { match: /\/auth\//, maxDim: 1200, palette: false },
  { match: /\/home\/product-card\/placeholder/, maxDim: 600, palette: false },
  { maxDim: 1600, palette: true },
];

function ruleFor(relativePath) {
  const normalized = `/${relativePath.replace(/\\/g, '/')}`;
  return RULES.find((rule) => !rule.match || rule.match.test(normalized)) ?? RULES.at(-1);
}

async function walk(dir) {
  /** @type {string[]} */
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }
    const ext = entry.name.slice(entry.name.lastIndexOf('.')).toLowerCase();
    if (IMAGE_EXT.has(ext)) {
      files.push(fullPath);
    }
  }
  return files;
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  return `${Math.round(bytes / 1024)} KB`;
}

async function optimizeFile(filePath) {
  const rel = relative(PUBLIC_DIR, filePath);
  const before = (await stat(filePath)).size;
  const meta = await sharp(filePath).metadata();
  const rule = ruleFor(rel);
  const maxSide = Math.max(meta.width ?? 0, meta.height ?? 0);
  const needsResize = maxSide > rule.maxDim;

  let pipeline = sharp(filePath).rotate();

  if (needsResize) {
    pipeline = pipeline.resize({
      width: rule.maxDim,
      height: rule.maxDim,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
  const tmpPath = `${filePath}.opt.tmp`;

  if (ext === '.png') {
    await pipeline
      .png({
        compressionLevel: 9,
        effort: 10,
        palette: rule.palette,
        quality: rule.palette ? 80 : 85,
      })
      .toFile(tmpPath);
  } else {
    await pipeline.jpeg({ quality: 85, mozjpeg: true }).toFile(tmpPath);
  }

  const after = (await stat(tmpPath)).size;
  if (after >= before && !needsResize) {
    await unlink(tmpPath);
    return { rel, before, after: before, skipped: true };
  }

  await rename(tmpPath, filePath);
  return {
    rel,
    before,
    after,
    skipped: false,
    resized: needsResize,
    from: `${meta.width}x${meta.height}`,
  };
}

const files = await walk(PUBLIC_DIR);
let totalBefore = 0;
let totalAfter = 0;

console.log(`Optimizing ${files.length} images in public/...\n`);

for (const filePath of files) {
  const result = await optimizeFile(filePath);
  totalBefore += result.before;
  totalAfter += result.after;

  if (result.skipped) {
    console.log(`  skip  ${result.rel} (${formatBytes(result.before)})`);
    continue;
  }

  const saved = ((1 - result.after / result.before) * 100).toFixed(0);
  const resizeNote = result.resized ? ` ${result.from} → smaller` : '';
  console.log(
    `  ok    ${result.rel}: ${formatBytes(result.before)} → ${formatBytes(result.after)} (-${saved}%)${resizeNote}`,
  );
}

console.log(
  `\nTotal: ${formatBytes(totalBefore)} → ${formatBytes(totalAfter)} (-${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%)`,
);
