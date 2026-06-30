-- Add support for multiple parent categories
ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "parentIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "categories"
SET "parentIds" = ARRAY["parentId"]
WHERE "parentId" IS NOT NULL
  AND cardinality("parentIds") = 0;
