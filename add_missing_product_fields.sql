-- Add missing fields to products table for inventory management
-- This SQL script should be run in Supabase SQL Editor

-- Add total_inventory column if it doesn't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS total_inventory INTEGER DEFAULT 0;

-- Add in_stock column if it doesn't exist  
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT true;

-- Add stripe_price_id column if it doesn't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;

-- Add comment to describe the purpose
COMMENT ON COLUMN products.total_inventory IS 'Calculated total inventory across all variants';
COMMENT ON COLUMN products.in_stock IS 'Whether the product has inventory available';
COMMENT ON COLUMN products.stripe_price_id IS 'Stripe price ID for checkout integration';

-- Create index for performance on frequently queried fields
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_total_inventory ON products(total_inventory);
CREATE INDEX IF NOT EXISTS idx_products_product_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_visibility_status ON products(visibility, status);

-- Update existing products to have correct inventory status
-- This will be handled by the updateProductTotalInventory.ts script