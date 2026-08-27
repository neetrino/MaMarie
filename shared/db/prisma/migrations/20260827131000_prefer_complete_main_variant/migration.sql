-- Prefer a complete Main Variant (most options), then position / createdAt.
-- 1) Collapse accidental multi-main products to a single Main.
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

-- 2) Reset all mains, then pick the best candidate per product.
UPDATE "product_variants" SET "isMain" = false;

UPDATE "product_variants" AS pv
SET "isMain" = true
FROM (
  SELECT DISTINCT ON (v."productId") v.id
  FROM "product_variants" AS v
  LEFT JOIN "product_variant_options" AS o ON o."variantId" = v.id
  GROUP BY v.id, v."productId", v.position, v."createdAt"
  ORDER BY
    v."productId",
    COUNT(o.id) DESC,
    v.position ASC,
    v."createdAt" ASC
) AS pick
WHERE pv.id = pick.id;
