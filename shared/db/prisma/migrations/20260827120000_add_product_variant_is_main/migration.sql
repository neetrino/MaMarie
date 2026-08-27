-- Explicit Main Variant flag for variable products (replaces cheapest-price default).
ALTER TABLE "product_variants" ADD COLUMN IF NOT EXISTS "isMain" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS "product_variants_productId_isMain_idx" ON "product_variants"("productId", "isMain");
