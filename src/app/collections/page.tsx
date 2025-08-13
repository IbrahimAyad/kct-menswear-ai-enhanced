'use client';

import { useMemo } from 'react';
import { useUnifiedShop } from '@/hooks/useUnifiedShop';
import { MasterCollectionPage } from '@/components/collections/MasterCollectionPage';
import { UnifiedProduct } from '@/types/unified-shop';

// All categories with updated images and dynamic counts
const allCategories = [
  {
    id: 'suits',
    name: 'Suits',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/double_breasted/mens_double_breasted_suit_model_2024_0.webp',
    count: 0, // Will be updated dynamically
    description: 'Complete suit collections'
  },
  {
    id: 'shirts',
    name: 'Shirts',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/dress_shirts/stretch_collar/mens_dress_shirt_stretch_collar_model_3005_0.webp',
    count: 0,
    description: 'Dress shirts and casual shirts'
  },
  {
    id: 'vest',
    name: 'Vests',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/dusty-sage-model.png',
    count: 0,
    description: 'Formal and casual vests'
  },
  {
    id: 'jackets',
    name: 'Jackets',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/prom_blazer/mens_red_floral_pattern_prom_blazer_model_1018.webp',
    count: 0,
    description: 'Blazers and sport coats'
  },
  {
    id: 'pants',
    name: 'Shirt & Tie',
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/dd5c1f7d-722d-4e17-00be-60a3fdb33900/public',
    count: 0,
    description: 'Dress pants and trousers'
  },
  {
    id: 'knitwear',
    name: 'Knitwear',
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9ac91a19-5951-43d4-6a98-c9d658765c00/public',
    count: 0,
    description: 'Sweaters and knit tops'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/powder-blue-model.png',
    count: 0,
    description: 'Ties, belts, and more'
  },
  {
    id: 'shoes',
    name: 'Shoes',
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/7d203d2a-63b7-46d3-9749-1f203e4ccc00/public',
    count: 0,
    description: 'Formal and casual footwear'
  },
  {
    id: 'velvet-blazers',
    name: 'Velvet Blazers',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/velvet-blazer/mens_green_paisley_pattern_velvet_model_1089.webp',
    count: 0,
    description: 'Luxury velvet blazers'
  }
];

// Helper function to map UnifiedProduct to MasterCollectionPage Product format
function mapUnifiedProductToCollectionProduct(unifiedProduct: UnifiedProduct) {
  return {
    id: unifiedProduct.id,
    name: unifiedProduct.name,
    price: unifiedProduct.price,
    originalPrice: unifiedProduct.originalPrice,
    image: unifiedProduct.imageUrl,
    hoverImage: unifiedProduct.images?.[1], // Use second image as hover if available
    category: unifiedProduct.category || 'uncategorized',
    tags: unifiedProduct.tags || [],
    isNew: unifiedProduct.tags?.includes('new') || false,
    isSale: unifiedProduct.originalPrice ? unifiedProduct.originalPrice > unifiedProduct.price : false
  };
}

export default function CollectionsPage() {
  // Fetch products from API using the unified shop hook
  const { products: unifiedProducts, loading, error, facets } = useUnifiedShop({
    autoFetch: true,
    debounceDelay: 300
  });

  // Transform UnifiedProducts to the format expected by MasterCollectionPage
  const mappedProducts = useMemo(() => {
    return unifiedProducts.map(mapUnifiedProductToCollectionProduct);
  }, [unifiedProducts]);

  // Update category counts based on actual products
  const updatedCategories = useMemo(() => {
    const categoryCounts = mappedProducts.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return allCategories.map(category => ({
      ...category,
      count: categoryCounts[category.id] || 0
    }));
  }, [mappedProducts]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading products: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-burgundy text-white rounded hover:bg-burgundy-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <MasterCollectionPage
      title="Master Collection"
      subtitle="COMPLETE MENSWEAR"
      description="Precision-tailored pieces in timeless colors enhance every part of a man's wardrobe."
      categories={updatedCategories}
      products={mappedProducts}
      heroImage="https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/hero-collection.webp"
    />
  );
}