-- Ensure every product has exactly one Main Variant for storefront card/PDP defaults.
-- 1) Collapse accidental multi-main products to a single Main (lowest position, then createdAt).
WITH ranked_mains AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY "productId"
      ORDER BY position ASC, "createdAt" ASC
    ) AS rn
  FROM "product_variants"
  WHERE "isMain" = true
)
UPDATE "product_variants" AS pv
SET "isMain" = false
FROM ranked_mains AS rm
WHERE pv.id = rm.id
  AND rm.rn > 1;

-- 2) Backfill Main for products that still have none.
UPDATE "product_variants" AS pv
SET "isMain" = true
FROM (
  SELECT DISTINCT ON ("productId") id
  FROM "product_variants"
  WHERE "productId" NOT IN (
    SELECT DISTINCT "productId"
    FROM "product_variants"
    WHERE "isMain" = true
  )
  ORDER BY "productId", position ASC, "createdAt" ASC
) AS pick
WHERE pv.id = pick.id;
