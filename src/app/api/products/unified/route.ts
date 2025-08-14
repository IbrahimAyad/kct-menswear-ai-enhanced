import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unifiedSearch } from '@/lib/services/unifiedSearchEngine';
import { urlParamsToFilters } from '@/lib/utils/url-filters';
import { getFilterPreset } from '@/lib/config/filter-presets';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Generate cache key from search params
    const cacheKey = searchParams.toString();
    
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }
    
    // Parse filters from URL
    const filters = urlParamsToFilters(searchParams);
    
    // Get preset information if specified
    const presetId = searchParams.get('preset');
    let presetData = null;
    if (presetId) {
      presetData = getFilterPreset(presetId);
    }
    
    // Fetch individual products from Supabase if needed
    let individualProducts = [];
    if (filters.includeIndividual !== false) {
      try {
        const supabase = await createClient();
        
        if (!supabase) {
          console.error('Supabase client is null - check environment variables');
        } else {
          // Build Supabase query - properly join with product_variants
          let query = supabase
            .from('products')
            .select(`
              *,
              product_variants (
                id,
                title,
                option1,
                option2,
                option3,
                price,
                inventory_quantity,
                available,
                stripe_price_id
              )
            `)
            .eq('visibility', true)
            .eq('status', 'active')
            .limit(500);
          
          // Apply basic filters
          if (filters.category?.length) {
            const lowercaseCategories = filters.category.map(c => c.toLowerCase());
            query = query.in('product_type', lowercaseCategories);
          }
          
          if (filters.color?.length) {
            const firstColor = filters.color[0];
            query = query.ilike('name', `%${firstColor}%`);
          }
          
          // Price filters - use base_price (stored in cents)
          if (filters.minPrice) {
            query = query.gte('base_price', filters.minPrice * 100);
          }
          if (filters.maxPrice) {
            query = query.lte('base_price', filters.maxPrice * 100);
          }
          
          const { data, error } = await query;
          
          if (error) {
            console.error('Supabase query error:', error);
          } else if (data) {
            // Map Supabase products to unified format
            individualProducts = data.map((product: any) => {
              // Get primary image
              const primaryImageUrl = product.primary_image || null;
              
              // Get first variant for pricing and availability
              const firstVariant = product.product_variants?.[0];
              const hasVariants = product.product_variants && product.product_variants.length > 0;
              
              // Calculate price (use variant price or base price)
              const priceInCents = firstVariant?.price || product.base_price || 0;
              const displayPrice = priceInCents / 100; // Convert cents to dollars
              
              // Get sizes from variants (option1 field)
              const sizes = hasVariants 
                ? product.product_variants
                    .filter((v: any) => v.option1 && v.option1 !== 'Default Size')
                    .map((v: any) => v.option1)
                : [];
              
              // Calculate total inventory
              const totalInventory = hasVariants
                ? product.product_variants.reduce(
                    (sum: number, v: any) => sum + (v.inventory_quantity || 0), 0
                  )
                : product.total_inventory || 0;
              
              return {
                id: product.id,
                name: product.name,
                title: product.name,
                description: product.description,
                price: displayPrice,
                category: product.category || 'uncategorized',
                product_type: product.product_type,
                primary_image: primaryImageUrl,
                sku: product.sku,
                handle: product.handle,
                tags: Array.isArray(product.tags) ? product.tags.filter(Boolean) : [],
                available: totalInventory > 0,
                inventory_quantity: totalInventory,
                featured_image: primaryImageUrl ? { src: primaryImageUrl } : null,
                images: primaryImageUrl ? [{ src: primaryImageUrl }] : [],
                vendor: product.vendor,
                sizes: sizes,
                // Stripe data from first variant
                stripePriceId: firstVariant?.stripe_price_id || null,
                stripeActive: firstVariant?.available || false,
                variants: product.product_variants || [],
                // Additional fields
                ai_score: 80 + Math.floor(Math.random() * 20)
              };
            });
            
            console.log(`Fetched ${individualProducts.length} products from Supabase`);
          }
        }
      } catch (error) {
        console.error('Error fetching Supabase products:', error);
      }
    }
    
    // Perform unified search with products
    const results = await unifiedSearch(filters, individualProducts);
    
    // Add preset metadata if applicable
    if (presetData) {
      (results as any).presetMetadata = {
        name: presetData.name,
        description: presetData.description,
        icon: presetData.icon,
        seo: presetData.seo
      };
    }
    
    // Cache the results
    cache.set(cacheKey, {
      data: results,
      timestamp: Date.now()
    });
    
    // Clean old cache entries periodically
    if (cache.size > 100) {
      const entries = Array.from(cache.entries());
      const cutoff = Date.now() - CACHE_DURATION;
      entries.forEach(([key, value]) => {
        if (value.timestamp < cutoff) {
          cache.delete(key);
        }
      });
    }
    
    return NextResponse.json(results);
    
  } catch (error) {
    console.error('Unified products API error:', error);
    
    // Return empty results with error info
    return NextResponse.json({
      products: [],
      totalCount: 0,
      filteredCount: 0,
      facets: {
        categories: [],
        colors: [],
        occasions: [],
        priceRanges: [],
        bundleTiers: []
      },
      pagination: {
        currentPage: 1,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      },
      error: true,
      message: error instanceof Error ? error.message : 'Failed to fetch products'
    });
  }
}