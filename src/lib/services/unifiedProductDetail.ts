import { getProduct } from '@/lib/supabase/products';
import { bundleProductsWithImages } from '@/lib/products/bundleProductsWithImages';
import { UnifiedProduct } from '@/types/unified-shop';

/**
 * Get a unified product by ID or slug - checks both bundles and Supabase products
 */
export async function getUnifiedProduct(idOrSlug: string): Promise<UnifiedProduct | null> {
  // First, check if it's a bundle (bundles use ID)
  const bundle = bundleProductsWithImages.bundles.find(b => b.id === idOrSlug);
  
  if (bundle) {
    // Convert bundle to UnifiedProduct format
    return {
      id: bundle.id,
      name: bundle.name,
      description: bundle.description,
      price: bundle.price,
      originalPrice: bundle.originalPrice,
      imageUrl: bundle.components[0]?.image || '/placeholder.jpg',
      images: bundle.components.map(c => c.image).filter(Boolean),
      category: bundle.category,
      color: bundle.components[0]?.color,
      size: bundle.components[0]?.sizes,
      material: bundle.components[0]?.material,
      trending: bundle.trending || false,
      inStock: bundle.inStock !== false,
      isBundle: true,
      bundleComponents: bundle.components.map(c => ({
        type: c.type,
        name: c.name,
        color: c.color,
        material: c.material,
        image: c.image,
        sizes: c.sizes
      })),
      aiScore: bundle.aiScore || 85,
      slug: bundle.id,
      tags: bundle.tags || [],
      occasionSuitability: bundle.occasionSuitability || {},
      stockLevel: bundle.stockLevel || 'in-stock'
    };
  }

  // If not a bundle, check Supabase by ID first, then by handle/slug
  let product = await getProduct(idOrSlug);
  
  // If not found by ID, try to find by handle (slug)
  if (!product) {
    // Import Supabase client to search by handle
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            image_url,
            alt_text,
            position,
            image_type
          )
        `)
        .eq('handle', idOrSlug)
        .single();
      
      if (data && !error) {
        // Convert to the format expected by getProduct
        const { getProductById } = await import('@/lib/supabase/products');
        product = await getProductById(data.id);
      }
    }
  }
  
  if (product) {
    // Convert Supabase product to UnifiedProduct format
    return {
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price / 100, // Convert cents to dollars
      originalPrice: product.compareAtPrice ? product.compareAtPrice / 100 : undefined,
      imageUrl: product.primaryImage || product.images[0] || '/placeholder.jpg',
      images: product.images,
      category: product.category || product.productType || 'product',
      color: product.colorFamily,
      size: product.variants?.map(v => v.size).filter(Boolean),
      material: product.materials?.[0],
      trending: product.isFeatured || false,
      inStock: product.inStock,
      isBundle: false,
      aiScore: 75,
      slug: product.handle || product.id,
      tags: product.tags || [],
      occasionSuitability: {},
      stockLevel: product.inStock ? 'in-stock' : 'out-of-stock'
    };
  }

  return null;
}

/**
 * Get related products for a unified product
 */
export async function getRelatedUnifiedProducts(
  productId: string, 
  category?: string,
  limit: number = 4
): Promise<UnifiedProduct[]> {
  const relatedProducts: UnifiedProduct[] = [];
  
  // Get related bundles from the same category
  if (category) {
    const relatedBundles = bundleProductsWithImages.bundles
      .filter(b => b.category === category && b.id !== productId)
      .slice(0, Math.floor(limit / 2))
      .map(bundle => ({
        id: bundle.id,
        name: bundle.name,
        description: bundle.description,
        price: bundle.price,
        originalPrice: bundle.originalPrice,
        imageUrl: bundle.components[0]?.image || '/placeholder.jpg',
        images: bundle.components.map(c => c.image).filter(Boolean),
        category: bundle.category,
        color: bundle.components[0]?.color,
        size: bundle.components[0]?.sizes,
        material: bundle.components[0]?.material,
        trending: bundle.trending || false,
        inStock: bundle.inStock !== false,
        isBundle: true,
        bundleComponents: bundle.components.map(c => ({
          type: c.type,
          name: c.name,
          color: c.color,
          material: c.material,
          image: c.image,
          sizes: c.sizes
        })),
        aiScore: bundle.aiScore || 85,
        slug: bundle.id,
        tags: bundle.tags || [],
        occasionSuitability: bundle.occasionSuitability || {},
        stockLevel: bundle.stockLevel || 'in-stock'
      }));
    
    relatedProducts.push(...relatedBundles);
  }
  
  // TODO: Also fetch related individual products from Supabase
  // For now, just return the bundles
  
  return relatedProducts;
}