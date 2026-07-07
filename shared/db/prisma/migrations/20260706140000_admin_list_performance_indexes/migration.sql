-- Admin product list: WHERE "deletedAt" IS NULL ORDER BY "createdAt" DESC
CREATE INDEX IF NOT EXISTS "products_deleted_at_created_at_idx"
  ON "products" ("deletedAt", "createdAt" DESC);

-- Cheapest published variant per product (admin list select)
CREATE INDEX IF NOT EXISTS "product_variants_product_id_published_price_idx"
  ON "product_variants" ("productId", "published", "price");

-- Translation lookup by product + locale (admin list)
CREATE INDEX IF NOT EXISTS "product_translations_product_id_locale_idx"
  ON "product_translations" ("productId", "locale");

-- Active users aggregation on orders
CREATE INDEX IF NOT EXISTS "orders_user_id_created_at_idx"
  ON "orders" ("userId", "createdAt" DESC);
