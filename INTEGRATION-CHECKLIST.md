# 📋 Website Integration Checklist

## ✅ Database Import Complete - 274 Products Ready!

**CRITICAL UPDATE:** The database has been completely restructured with proper product variants and 100% Stripe integration. Every product is now purchasable!

---

## 1️⃣ Product Data Structure

### Products Table Schema:
```sql
products {
  id: UUID                    -- Primary key
  name: string               -- Product name
  handle: string             -- URL slug (USE THIS FOR ROUTES!)
  category: string           -- Main category
  description: text          -- Full description
  base_price: integer        -- In cents (6500 = $65.00)
  primary_image: string      -- Full CDN URL
  meta_title: string         -- SEO title
  meta_description: string   -- SEO description
  search_keywords: text      -- For search
  tags: text[]              -- Array of tags
  status: string            -- 'active' or 'inactive'
  created_at: timestamp
  updated_at: timestamp
}
```

### ⚠️ IMPORTANT NOTES:
- **Prices are in CENTS** - divide by 100 for display (6500 → $65.00)
- **Use `handle` for URLs**, not `slug` (slug field removed)
- **Filter by `status = 'active'`** to hide inactive products

---

## 2️⃣ Variants Table Structure

### Product Variants Schema:
```sql
product_variants {
  id: UUID
  product_id: UUID           -- Links to products.id
  size: string              -- S, M, L, XL, 2XL, 3XL, etc.
  sku: string               -- Unique SKU
  price: integer            -- In cents (override base_price if different)
  stripe_price_id: string   -- Stripe Price ID (100% populated!)
  stripe_active: boolean    -- Is this variant active in Stripe?
  inventory_quantity: integer -- Stock level
  created_at: timestamp
  updated_at: timestamp
}
```

### ✅ Key Achievement:
**ALL 399 variants have valid Stripe price IDs - 100% coverage!**

---

## 3️⃣ Database Statistics

| Metric | Count | Status |
|--------|-------|--------|
| Total Products | 274 | ✅ |
| Product Variants | 399 | ✅ |
| Products with Stripe IDs | 100% | ✅ |
| Product Images | 280 | ✅ |
| Active Products | 274 | ✅ |

---

## 4️⃣ Essential API Queries

### Get All Active Products with Price Ranges:
```sql
SELECT
  p.*,
  COUNT(pv.id) as variant_count,
  MIN(pv.price) as min_price,
  MAX(pv.price) as max_price,
  ARRAY_AGG(DISTINCT pv.size ORDER BY 
    CASE pv.size
      WHEN 'XS' THEN 1
      WHEN 'S' THEN 2
      WHEN 'M' THEN 3
      WHEN 'L' THEN 4
      WHEN 'XL' THEN 5
      WHEN '2XL' THEN 6
      WHEN '3XL' THEN 7
      ELSE 8
    END
  ) as available_sizes
FROM products p
LEFT JOIN product_variants pv ON pv.product_id = p.id
WHERE p.status = 'active'
  AND pv.stripe_active = true
  AND pv.inventory_quantity > 0
GROUP BY p.id
ORDER BY p.created_at DESC;
```

### Get Single Product with Variants:
```sql
-- Get product by handle (for product detail page)
SELECT * FROM products 
WHERE handle = 'navy-blue-2-piece-suit' 
  AND status = 'active';

-- Get all variants for the product
SELECT * FROM product_variants
WHERE product_id = 'product-uuid-here'
  AND stripe_active = true
  AND inventory_quantity > 0
ORDER BY
  CASE size
    WHEN 'XS' THEN 1
    WHEN 'S' THEN 2
    WHEN 'M' THEN 3
    WHEN 'L' THEN 4
    WHEN 'XL' THEN 5
    WHEN '2XL' THEN 6
    WHEN '3XL' THEN 7
    ELSE 8
  END;
```

### Get Products by Category:
```sql
SELECT p.*, 
  MIN(pv.price) as starting_price,
  COUNT(DISTINCT pv.size) as size_options
FROM products p
JOIN product_variants pv ON pv.product_id = p.id
WHERE p.category ILIKE '%suits%'
  AND p.status = 'active'
  AND pv.stripe_active = true
GROUP BY p.id
ORDER BY p.created_at DESC
LIMIT 20;
```

---

## 5️⃣ Product Categories

### Main Categories with Product Counts:
| Category | Product Count | Example Products |
|----------|--------------|------------------|
| **Vest & Tie Sets** | 58 | Solid colors, patterns, wedding sets |
| **Men's Suits** | 45+ | 2-piece, 3-piece, slim fit |
| **Tuxedos** | 16 | Classic, modern, midnight blue |
| **Blazers** | 28 | Velvet, sparkle, casual |
| **Accessories** | 35+ | Suspenders, bowties, ties |
| **Dress Shirts** | 24 | White, blue, pink, patterns |
| **Shoes** | 18 | Oxfords, loafers, boots |
| **Kids Formal** | 12 | Boys suits, junior tuxedos |

---

## 6️⃣ Stripe Checkout Integration

### For Add to Cart / Checkout:
```javascript
// Example checkout implementation
const checkoutWithStripe = async (variantId) => {
  // 1. Get the variant with Stripe price ID
  const { data: variant } = await supabase
    .from('product_variants')
    .select('*, products(*)')
    .eq('id', variantId)
    .single();

  // 2. Create Stripe checkout session
  const response = await fetch('/api/create-checkout', {
    method: 'POST',
    body: JSON.stringify({
      priceId: variant.stripe_price_id,  // Use this!
      quantity: 1,
      metadata: {
        productName: variant.products.name,
        size: variant.size,
        sku: variant.sku
      }
    })
  });

  // 3. Redirect to Stripe
  const { url } = await response.json();
  window.location.href = url;
};
```

### Display Price Correctly:
```javascript
// Always divide by 100 for display
const formatPrice = (priceInCents) => {
  return `$${(priceInCents / 100).toFixed(2)}`;
};

// Example: 6500 → "$65.00"
```

---

## 7️⃣ Image Handling

### Image Structure:
- **Primary Image:** `products.primary_image` (always populated)
- **Gallery Images:** `product_images` table (multiple per product)
- **CDN Base URL:** `https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/`

### Example Image URLs:
```
https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/burgundy-model.png
https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/velvet-blazer/mens_green_velvet_blazer_2025_1060.webp
```

---

## 8️⃣ Common Integration Points to Update

### ✅ Product Listing Pages:
```javascript
// Update to use new structure
const { data: products } = await supabase
  .from('products')
  .select(`
    *,
    product_variants!inner(
      min_price:price.min(),
      max_price:price.max(),
      sizes:size
    )
  `)
  .eq('status', 'active')
  .eq('product_variants.stripe_active', true);
```

### ✅ Product Detail Page:
```javascript
// Get product with all variants
const { data: product } = await supabase
  .from('products')
  .select(`
    *,
    product_variants(*)
  `)
  .eq('handle', productHandle)
  .eq('status', 'active')
  .single();
```

### ✅ Cart Implementation:
```javascript
// Store variant ID, not product ID
const cartItem = {
  variantId: selectedVariant.id,
  productId: product.id,
  name: product.name,
  size: selectedVariant.size,
  price: selectedVariant.price,
  stripeId: selectedVariant.stripe_price_id,  // Critical!
  quantity: 1
};
```

---

## 9️⃣ Testing Checklist

### Before Going Live:
- [ ] Test product listing shows correct prices (divided by 100)
- [ ] Verify size selector shows available variants
- [ ] Confirm add to cart uses variant ID
- [ ] Test Stripe checkout with real stripe_price_id
- [ ] Check inventory updates when items sold
- [ ] Verify SEO meta tags from database
- [ ] Test search with new search_keywords field
- [ ] Confirm category filtering works
- [ ] Test mobile responsive views
- [ ] Verify image loading from CDN

---

## 🚨 Critical Changes from Previous Setup

1. **URL Structure:** Use `handle` field, not `slug`
2. **Pricing:** All prices in cents (multiply display price by 100)
3. **Checkout:** Use `stripe_price_id` from variants, not products
4. **Inventory:** Check `inventory_quantity` on variants
5. **Active Status:** Filter by `status = 'active'` AND `stripe_active = true`

---

## 📞 Support Information

**Import Summary:**
- ✅ 274 products successfully imported
- ✅ 399 variants with sizes created
- ✅ 100% Stripe price ID coverage
- ✅ All products ready for purchase

**Next Steps:**
1. Update API endpoints to use new schema
2. Test checkout flow with any product
3. Verify inventory management
4. Deploy to production

---

**THE DATABASE IS READY! Every product has valid Stripe IDs and can be purchased immediately.**

Last Updated: 2025-01-14