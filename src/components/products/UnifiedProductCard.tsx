'use client';

import { UnifiedProduct } from '@/types/unified-shop';
import BundleProductCard from './BundleProductCard';
import { SupabaseProductCard } from '@/components/shop/SupabaseProductCard';
import { EnhancedProduct } from '@/lib/supabase/types';

interface UnifiedProductCardProps {
  product: UnifiedProduct;
  onQuickView?: (product: UnifiedProduct) => void;
  onAddToCart?: (product: UnifiedProduct) => void;
  featured?: boolean;
  layout?: 'standard' | 'large' | 'compact';
}

export default function UnifiedProductCard({
  product,
  onQuickView,
  onAddToCart,
  featured = false,
  layout = 'standard'
}: UnifiedProductCardProps) {
  
  // If it's a bundle, use the bundle card
  if (product.isBundle) {
    return (
      <BundleProductCard
        product={product}
        onQuickView={onQuickView}
        onAddToCart={onAddToCart}
        featured={featured}
      />
    );
  }
  
  // Convert UnifiedProduct to EnhancedProduct format for individual products
  const enhancedProduct: EnhancedProduct = {
    id: product.id,
    title: product.name,
    handle: product.slug || product.id,
    description: product.description,
    price: product.price.toString(),
    compare_at_price: product.originalPrice?.toString(),
    product_type: product.category,
    tags: product.tags,
    featured_image: product.imageUrl ? {
      src: product.imageUrl,
      alt: product.name
    } : undefined,
    images: product.images?.map(src => ({ src, alt: product.name })),
    available: product.inStock !== false,
    inventory_quantity: product.stockLevel,
    sku: product.sku,
    color: product.color,
    sizes: product.size,
    material: product.material,
    fit: product.fit,
    ai_score: product.aiScore,
    meta_description: product.metaDescription,
    category: product.category,
    vendor: 'KCT Menswear',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Use the existing SupabaseProductCard for individual products
  return (
    <SupabaseProductCard
      product={enhancedProduct}
      onQuickView={(p) => {
        // Convert back to UnifiedProduct for the callback
        const unified: UnifiedProduct = {
          ...product,
          name: p.title,
          description: p.description || '',
          price: parseFloat(p.price || '0')
        };
        onQuickView?.(unified);
      }}
      featured={featured}
    />
  );
}