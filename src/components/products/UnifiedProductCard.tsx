'use client';

import { UnifiedProduct } from '@/types/unified-shop';
import BundleProductCard from './BundleProductCard';
import SimpleProductCard from './SimpleProductCard';

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
  
  // Use SimpleProductCard for individual products
  return (
    <SimpleProductCard
      product={product}
      onQuickView={onQuickView}
      onAddToCart={onAddToCart}
      featured={featured}
    />
  );
}