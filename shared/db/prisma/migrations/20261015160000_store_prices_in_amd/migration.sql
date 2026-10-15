-- Catalog and order product amounts were stored in USD. Shipping was already AMD.
-- Convert once using the configured AMD-per-USD rate (fallback 400).

DO $$
DECLARE
  amd_rate numeric;
  already text;
BEGIN
  SELECT value::text INTO already FROM settings WHERE key = 'priceStorageCurrency';
  IF already IS NOT NULL THEN
    RETURN;
  END IF;

  SELECT COALESCE((value->>'AMD')::numeric, 400) INTO amd_rate
  FROM settings WHERE key = 'currencyRates';
  IF amd_rate IS NULL OR amd_rate <= 0 THEN
    amd_rate := 400;
  END IF;

  UPDATE product_variants
  SET
    price = price * amd_rate,
    "compareAtPrice" = CASE
      WHEN "compareAtPrice" IS NULL THEN NULL
      ELSE "compareAtPrice" * amd_rate
    END,
    cost = CASE
      WHEN cost IS NULL THEN NULL
      ELSE cost * amd_rate
    END;

  UPDATE cart_items
  SET "priceSnapshot" = "priceSnapshot" * amd_rate;

  UPDATE order_items
  SET
    price = price * amd_rate,
    total = total * amd_rate;

  UPDATE orders
  SET
    subtotal = subtotal * amd_rate,
    "discountAmount" = "discountAmount" * amd_rate,
    "taxAmount" = "taxAmount" * amd_rate,
    total = (subtotal * amd_rate)
      - ("discountAmount" * amd_rate)
      + "shippingAmount"
      + ("taxAmount" * amd_rate);

  UPDATE payments AS payment
  SET amount = orders.total
  FROM orders
  WHERE payment."orderId" = orders.id;

  INSERT INTO settings (id, key, value, description, "createdAt", "updatedAt")
  VALUES (
    'price-storage-amd',
    'priceStorageCurrency',
    '"AMD"'::jsonb,
    'Product and order amounts are stored in AMD',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );
END $$;
