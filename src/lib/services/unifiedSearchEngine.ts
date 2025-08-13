import { UnifiedProduct, UnifiedProductFilters, UnifiedSearchResult, BUNDLE_TIERS } from '@/types/unified-shop';
import { Bundle } from '@/lib/products/bundleProducts';
import { bundleProductsWithImages } from '@/lib/products/bundleProductsWithImages';
import { EnhancedProduct } from '@/lib/supabase/types';
import { getAllCoreProducts } from '@/lib/config/coreProducts';

/**
 * Convert a bundle to UnifiedProduct format
 */
export function bundleToUnifiedProduct(bundle: any): UnifiedProduct {
  // Determine bundle tier based on price
  let bundleTier: 'starter' | 'professional' | 'executive' | 'premium' = 'professional';
  
  if (bundle.bundlePrice <= 199) bundleTier = 'starter';
  else if (bundle.bundlePrice <= 229) bundleTier = 'professional';
  else if (bundle.bundlePrice <= 249) bundleTier = 'executive';
  else bundleTier = 'premium';
  
  // Build bundle components - handle both tie and pocket square bundles
  const bundleComponents: any = {
    suit: {
      name: `${bundle.suit.color} ${bundle.suit.type} Suit`,
      color: bundle.suit.color.toLowerCase(),
      type: bundle.suit.type,
      image: bundle.suit?.image || ''
    },
    shirt: {
      name: `${bundle.shirt.color} ${bundle.shirt.fit} Shirt`,
      color: bundle.shirt.color.toLowerCase(),
      fit: bundle.shirt.fit,
      image: bundle.shirt?.image || ''
    }
  };
  
  // Add tie if present
  if (bundle.tie) {
    bundleComponents.tie = {
      name: `${bundle.tie.color} ${bundle.tie.style} Tie`,
      color: bundle.tie.color.toLowerCase(),
      style: bundle.tie.style,
      image: bundle.tie?.image || ''
    };
  }
  
  // Add pocket square if present (casual bundles)
  if (bundle.pocketSquare) {
    bundleComponents.pocketSquare = {
      name: `${bundle.pocketSquare.color} ${bundle.pocketSquare.pattern} Pocket Square`,
      color: bundle.pocketSquare.color.toLowerCase(),
      pattern: bundle.pocketSquare.pattern
    };
  }
  
  return {
    id: bundle.id,
    sku: bundle.id,
    type: 'bundle',
    name: bundle.name,
    description: bundle.description,
    imageUrl: bundle.imageUrl,
    price: bundle.bundlePrice,
    originalPrice: bundle.originalPrice,
    bundlePrice: bundle.bundlePrice,
    savings: bundle.savings,
    stripePriceId: bundle.stripePriceId,
    isBundle: true,
    bundleTier,
    bundleComponents,
    occasions: bundle.occasions,
    tags: [bundle.category, ...(bundle.trending ? ['trending'] : [])],
    trending: bundle.trending,
    seasonal: bundle.seasonal || bundle.season,
    aiScore: bundle.aiScore,
    inStock: true, // Bundles are always in stock
    category: bundle.category
  };
}

/**
 * Convert Supabase product to UnifiedProduct format
 */
export function supabaseProductToUnified(product: any): UnifiedProduct {
  return {
    id: product.id,
    sku: product.sku || product.id,
    type: 'individual',
    name: product.title || product.name,
    description: product.description || '',
    imageUrl: product.featured_image?.src || product.images?.[0]?.src || '',
    images: product.images?.map((img: any) => typeof img === 'string' ? img : img.src),
    price: parseFloat(product.price || '0'),
    originalPrice: product.compare_at_price ? parseFloat(product.compare_at_price) : undefined,
    isBundle: false,
    category: product.product_type || product.category,
    color: extractColorFromProduct(product),
    size: product.sizes || extractSizesFromVariants(product),
    material: product.material,
    fit: product.fit,
    occasions: extractOccasionsFromTags(product),
    tags: product.tags || [],
    trending: product.tags?.includes('trending'),
    seasonal: extractSeasonFromTags(product),
    aiScore: product.ai_score,
    inStock: product.available !== false,
    stockLevel: product.inventory_quantity,
    slug: product.handle,
    metaDescription: product.meta_description
  };
}

/**
 * Helper to extract color from product
 */
function extractColorFromProduct(product: any): string | undefined {
  // Try to get from color field or additional_info
  if (product.color) return product.color.toLowerCase();
  if (product.additional_info?.color) return product.additional_info.color.toLowerCase();
  
  // Try to extract from title or name
  const productName = product.title || product.name || '';
  const colorPattern = /(black|navy|grey|gray|blue|brown|tan|burgundy|white|cream|charcoal|red|green|pink|coral|sage)/i;
  const match = productName.match(colorPattern);
  if (match) return match[1].toLowerCase();
  
  // Try tags
  const colorTag = product.tags?.find((tag: string) => colorPattern.test(tag));
  if (colorTag) return colorTag.toLowerCase();
  
  return undefined;
}

/**
 * Extract sizes from variants
 */
function extractSizesFromVariants(product: any): string[] {
  if (product.sizes) return product.sizes;
  if (product.additional_info?.sizes_available) {
    return product.additional_info.sizes_available.split(', ');
  }
  if (!product.variants) return [];
  
  const sizes = new Set<string>();
  product.variants.forEach((variant: any) => {
    if (variant.option1) sizes.add(variant.option1);
    if (variant.option2) sizes.add(variant.option2);
  });
  
  return Array.from(sizes);
}

/**
 * Extract occasions from tags
 */
function extractOccasionsFromTags(product: any): string[] {
  if (!product.tags) return [];
  
  const occasionKeywords = ['wedding', 'business', 'formal', 'casual', 'prom', 'cocktail', 'black-tie', 'gala', 'party'];
  return product.tags.filter((tag: string) => 
    occasionKeywords.some(keyword => tag.toLowerCase().includes(keyword))
  );
}

/**
 * Extract season from tags
 */
function extractSeasonFromTags(product: any): 'spring' | 'summer' | 'fall' | 'winter' | 'year-round' | undefined {
  if (!product.tags) return 'year-round';
  
  const seasons = ['spring', 'summer', 'fall', 'winter'];
  const seasonTag = product.tags.find((tag: string) => 
    seasons.some(season => tag.toLowerCase().includes(season))
  );
  
  return seasonTag ? seasonTag.toLowerCase() as any : 'year-round';
}

/**
 * Main unified search function
 */
export async function unifiedSearch(
  filters: UnifiedProductFilters,
  individualProducts: EnhancedProduct[] = []
): Promise<UnifiedSearchResult> {
  let results: UnifiedProduct[] = [];
  
  // Convert core products to unified format
  const coreProducts = getAllCoreProducts();
  const unifiedCoreProducts = coreProducts.map(coreProduct => ({
    id: coreProduct.id,
    sku: coreProduct.id,
    type: 'individual' as const,
    name: coreProduct.name,
    description: coreProduct.description || `Premium ${coreProduct.name} from our core collection`,
    imageUrl: coreProduct.image || '/placeholder-product.svg',
    images: coreProduct.image ? [coreProduct.image] : ['/placeholder-product.svg'],
    price: coreProduct.price / 100, // Convert cents to dollars
    category: coreProduct.category,
    stripePriceId: coreProduct.stripe_price_id,
    occasions: ['business', 'formal', 'wedding'],
    tags: [coreProduct.category, 'core', 'premium'],
    trending: false,
    inStock: true,
    stockLevel: 100
  }));
  
  // Convert bundles to unified format
  const unifiedBundles = bundleProductsWithImages.bundles.map(bundleToUnifiedProduct);
  
  // Convert individual products to unified format
  const unifiedIndividual = individualProducts.map(supabaseProductToUnified);
  
  // Combine based on filter preferences
  if (filters.includeBundles !== false) {
    results.push(...unifiedBundles);
  }
  
  if (filters.includeIndividual !== false) {
    results.push(...unifiedCoreProducts, ...unifiedIndividual);
  }
  
  // If no preference, include all types
  if (filters.includeBundles === undefined && filters.includeIndividual === undefined) {
    results = [...unifiedCoreProducts, ...unifiedBundles, ...unifiedIndividual];
  }
  
  // Apply filters
  results = applyFilters(results, filters);
  
  // Apply sorting
  results = applySorting(results, filters.sortBy);
  
  // Generate facets from filtered results
  const facets = generateFacets(results);
  
  // Apply pagination
  const page = filters.page || 1;
  const limit = filters.limit || 24;
  const start = (page - 1) * limit;
  const paginatedResults = results.slice(start, start + limit);
  
  return {
    products: paginatedResults,
    totalCount: results.length,
    filteredCount: results.length,
    facets,
    appliedFilters: filters,
    suggestions: generateSuggestions(filters, results),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(results.length / limit),
      hasNext: start + limit < results.length,
      hasPrev: page > 1
    }
  };
}

/**
 * Apply filters to products
 */
function applyFilters(products: UnifiedProduct[], filters: UnifiedProductFilters): UnifiedProduct[] {
  return products.filter(product => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText = `
        ${product.name} 
        ${product.description} 
        ${product.category || ''} 
        ${product.color || ''}
        ${product.bundleComponents?.suit?.color || ''}
        ${product.bundleComponents?.shirt?.color || ''}
        ${product.bundleComponents?.tie?.color || ''}
        ${product.bundleComponents?.pocketSquare?.color || ''}
        ${product.occasions.join(' ')}
        ${product.tags.join(' ')}
      `.toLowerCase();
      
      if (!searchableText.includes(searchTerm)) return false;
    }
    
    // Type filter
    if (filters.type && filters.type.length > 0) {
      if (!filters.type.includes(product.type)) return false;
    }
    
    // Category filter
    if (filters.category && filters.category.length > 0) {
      if (!product.category || !filters.category.includes(product.category)) return false;
    }
    
    // Bundle tier filter
    if (filters.bundleTier && filters.bundleTier.length > 0) {
      if (!product.bundleTier || !filters.bundleTier.includes(product.bundleTier)) return false;
    }
    
    // Color filters
    if (filters.color && filters.color.length > 0) {
      const productColors = [
        product.color,
        product.bundleComponents?.suit?.color,
        product.bundleComponents?.shirt?.color,
        product.bundleComponents?.tie?.color,
        product.bundleComponents?.pocketSquare?.color
      ].filter(Boolean).map(c => c?.toLowerCase());
      
      if (!filters.color.some(c => productColors.includes(c.toLowerCase()))) return false;
    }
    
    // Bundle-specific color filters
    if (filters.suitColor && filters.suitColor.length > 0) {
      if (!product.bundleComponents?.suit || 
          !filters.suitColor.includes(product.bundleComponents.suit.color)) return false;
    }
    
    if (filters.shirtColor && filters.shirtColor.length > 0) {
      if (!product.bundleComponents?.shirt || 
          !filters.shirtColor.includes(product.bundleComponents.shirt.color)) return false;
    }
    
    if (filters.tieColor && filters.tieColor.length > 0) {
      if (!product.bundleComponents?.tie || 
          !filters.tieColor.includes(product.bundleComponents.tie.color)) return false;
    }
    
    // Price filter
    if (filters.minPrice !== undefined && product.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) return false;
    
    // Occasions filter
    if (filters.occasions && filters.occasions.length > 0) {
      if (!filters.occasions.some(o => product.occasions.includes(o))) return false;
    }
    
    // Material filter
    if (filters.material && filters.material.length > 0) {
      if (!product.material || !filters.material.includes(product.material)) return false;
    }
    
    // Fit filter
    if (filters.fit && filters.fit.length > 0) {
      const productFits = [
        product.fit,
        product.bundleComponents?.shirt?.fit
      ].filter(Boolean);
      
      if (!filters.fit.some(f => productFits.includes(f))) return false;
    }
    
    // Special filters
    if (filters.trending && !product.trending) return false;
    if (filters.onSale && !product.savings) return false;
    if (filters.newArrivals && !product.tags?.includes('new')) return false;
    
    // AI score filter
    if (filters.minAiScore && (!product.aiScore || product.aiScore < filters.minAiScore)) return false;
    
    return true;
  });
}

/**
 * Apply sorting to products
 */
function applySorting(
  products: UnifiedProduct[], 
  sortBy?: UnifiedProductFilters['sortBy']
): UnifiedProduct[] {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    
    case 'trending':
      return sorted.sort((a, b) => {
        if (a.trending && !b.trending) return -1;
        if (!a.trending && b.trending) return 1;
        return 0;
      });
    
    case 'ai-score':
      return sorted.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
    
    case 'newest':
    default:
      // Bundles first, then by AI score
      return sorted.sort((a, b) => {
        if (a.isBundle && !b.isBundle) return -1;
        if (!a.isBundle && b.isBundle) return 1;
        return (b.aiScore || 0) - (a.aiScore || 0);
      });
  }
}

/**
 * Generate facets from filtered results
 */
function generateFacets(products: UnifiedProduct[]): UnifiedSearchResult['facets'] {
  const categories = new Map<string, number>();
  const colors = new Map<string, number>();
  const occasions = new Map<string, number>();
  const bundleTiers = new Map<string, { count: number; price: number }>();
  
  products.forEach(product => {
    // Categories
    if (product.category) {
      categories.set(product.category, (categories.get(product.category) || 0) + 1);
    }
    
    // Colors
    const productColors = [
      product.color,
      product.bundleComponents?.suit?.color,
      product.bundleComponents?.shirt?.color,
      product.bundleComponents?.tie?.color,
      product.bundleComponents?.pocketSquare?.color
    ].filter(Boolean);
    
    productColors.forEach(color => {
      if (color) colors.set(color, (colors.get(color) || 0) + 1);
    });
    
    // Occasions
    product.occasions.forEach(occasion => {
      occasions.set(occasion, (occasions.get(occasion) || 0) + 1);
    });
    
    // Bundle tiers
    if (product.bundleTier) {
      const tier = bundleTiers.get(product.bundleTier) || { count: 0, price: BUNDLE_TIERS[product.bundleTier].price };
      tier.count++;
      bundleTiers.set(product.bundleTier, tier);
    }
  });
  
  // Price ranges
  const prices = products.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRanges = [
    { label: 'Under $200', min: 0, max: 200, count: products.filter(p => p.price < 200).length },
    { label: '$200 - $300', min: 200, max: 300, count: products.filter(p => p.price >= 200 && p.price < 300).length },
    { label: '$300 - $500', min: 300, max: 500, count: products.filter(p => p.price >= 300 && p.price < 500).length },
    { label: 'Over $500', min: 500, max: 10000, count: products.filter(p => p.price >= 500).length }
  ].filter(range => range.count > 0);
  
  return {
    categories: Array.from(categories.entries()).map(([name, count]) => ({ name, count })),
    colors: Array.from(colors.entries()).map(([name, count]) => ({ name, count })),
    occasions: Array.from(occasions.entries()).map(([name, count]) => ({ name, count })),
    priceRanges,
    bundleTiers: Array.from(bundleTiers.entries()).map(([tier, data]) => ({
      tier: tier as any,
      count: data.count,
      price: data.price
    }))
  };
}

/**
 * Generate search suggestions
 */
function generateSuggestions(
  filters: UnifiedProductFilters, 
  results: UnifiedProduct[]
): UnifiedSearchResult['suggestions'] {
  const suggestions: UnifiedSearchResult['suggestions'] = {};
  
  // If no results, suggest alternative searches
  if (results.length === 0 && filters.search) {
    suggestions.didYouMean = filters.search.replace(/s$/, ''); // Simple pluralization fix
    suggestions.relatedSearches = [
      'navy suit',
      'wedding guest',
      'black tie'
    ];
  }
  
  // Recommend filters based on results
  if (results.length > 10) {
    const hasExpensiveItems = results.some(p => p.price > 400);
    const hasBundles = results.some(p => p.isBundle);
    
    suggestions.recommendedFilters = {};
    
    if (hasExpensiveItems && !filters.maxPrice) {
      suggestions.recommendedFilters.maxPrice = 300;
    }
    
    if (hasBundles && !filters.includeBundles) {
      suggestions.recommendedFilters.includeBundles = true;
    }
  }
  
  return suggestions;
}