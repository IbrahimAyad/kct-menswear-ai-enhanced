import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unifiedSearch } from '@/lib/services/unifiedSearchEngine';
import { urlParamsToFilters } from '@/lib/utils/url-filters';
import { getFilterPreset } from '@/lib/config/filter-presets';
import { UnifiedProductFilters, UnifiedSearchResult } from '@/types/unified-shop';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: UnifiedSearchResult; timestamp: number }>();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Log environment check for debugging
    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    console.log('Supabase env check:', { hasSupabaseUrl, hasSupabaseKey });
    
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
          // Build Supabase query based on filters - include product images
          let query = supabase
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
            .limit(100); // Limit to prevent timeout
          
          // Apply basic filters to reduce data transfer
          if (filters.category?.length) {
            query = query.in('product_type', filters.category);
          }
          
          if (filters.color?.length) {
            // Simplified color filtering - search in name field
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
          
          // Execute query with timeout
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Supabase timeout')), 5000)
          );
          
          const queryPromise = query;
          
          try {
            const { data, error } = await Promise.race([
              queryPromise,
              timeoutPromise
            ]) as any;
            
            if (error) {
              console.error('Supabase query error:', error);
            } else {
              // Map raw Supabase products to expected format
              individualProducts = (data || []).map((product: any) => {
                // Get primary image from product_images relation
                const primaryImage = product.product_images?.find((img: any) => 
                  img.image_type === 'primary' || img.position === 1
                ) || product.product_images?.[0];
                
                // Get all images sorted by position
                const allImages = product.product_images?.sort((a: any, b: any) => 
                  (a.position || 999) - (b.position || 999)
                ).map((img: any) => ({ src: img.image_url })) || [];
                
                return {
                  id: product.id,
                  title: product.name, // Map name to title
                  description: product.description,
                  price: (product.base_price / 100).toString(), // Convert cents to dollars as string
                  compare_at_price: null, // Not available in current schema
                  category: product.category,
                  product_type: product.product_type,
                  sku: product.sku,
                  handle: product.handle,
                  tags: product.tags || [],
                  meta_description: product.meta_description,
                  available: product.in_stock,
                  inventory_quantity: product.total_inventory,
                  featured_image: primaryImage ? { src: primaryImage.image_url } : null,
                  images: allImages,
                  vendor: product.vendor,
                  sizes: product.additional_info?.sizes_available?.split(', ') || [],
                  material: product.additional_info?.material,
                  fit: product.additional_info?.fit_type,
                  ai_score: 80 + Math.floor(Math.random() * 20) // Generate AI score
                };
              });
              console.log(`Fetched and mapped ${individualProducts.length} products from Supabase`);
            }
          } catch (timeoutError) {
            console.error('Supabase query timeout - continuing with bundles only');
          }
        }
      } catch (error) {
        console.error('Error fetching individual products:', error);
        // Continue with just bundles
      }
    }
    
    // Perform unified search
    const results = await unifiedSearch(filters, individualProducts);
    
    // Add preset metadata to results if applicable
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
    
    // Clean old cache entries
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
    
    // Return bundles only if Supabase fails (graceful degradation)
    try {
      const results = await unifiedSearch(filters, []);
      return NextResponse.json({
        ...results,
        warning: 'Database connection issue - showing bundles only'
      });
    } catch (fallbackError) {
      return NextResponse.json(
        { 
          error: 'Failed to fetch products',
          message: error instanceof Error ? error.message : 'Unknown error',
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
          }
        },
        { status: 500 }
      );
    }
  }
}

// Metadata endpoint for filter options
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;
    
    if (type === 'filter-options') {
      // Return available filter options for UI
      const supabase = await createClient();
      
      // Fetch distinct values for filters
      const [categoriesResult, colorsResult, occasionsResult] = await Promise.all([
        supabase.from('products').select('product_type').limit(1000),
        supabase.from('products').select('tags').limit(1000),
        supabase.from('products').select('tags').limit(1000)
      ]);
      
      // Process categories
      const categories = new Set<string>();
      categoriesResult.data?.forEach(item => {
        if (item.product_type) categories.add(item.product_type);
      });
      
      // Process colors from tags
      const colors = new Set<string>();
      const colorKeywords = ['black', 'navy', 'grey', 'blue', 'brown', 'burgundy', 'white', 'charcoal'];
      colorsResult.data?.forEach(item => {
        if (item.tags && Array.isArray(item.tags)) {
          item.tags.forEach((tag: string) => {
            const lowerTag = tag.toLowerCase();
            colorKeywords.forEach(color => {
              if (lowerTag.includes(color)) colors.add(color);
            });
          });
        }
      });
      
      // Process occasions from tags
      const occasions = new Set<string>();
      const occasionKeywords = ['wedding', 'business', 'formal', 'casual', 'prom', 'cocktail'];
      occasionsResult.data?.forEach(item => {
        if (item.tags && Array.isArray(item.tags)) {
          item.tags.forEach((tag: string) => {
            const lowerTag = tag.toLowerCase();
            occasionKeywords.forEach(occasion => {
              if (lowerTag.includes(occasion)) {
                occasions.add(occasion.charAt(0).toUpperCase() + occasion.slice(1));
              }
            });
          });
        }
      });
      
      // Get bundle-specific options
      const bundleOptions = {
        tiers: ['starter', 'professional', 'executive', 'premium'],
        suitColors: ['black', 'navy', 'charcoal', 'grey', 'burgundy'],
        shirtColors: ['white', 'light-blue', 'pink', 'cream'],
        tieColors: ['burgundy', 'navy', 'black', 'gold', 'silver']
      };
      
      return NextResponse.json({
        categories: Array.from(categories),
        colors: Array.from(colors),
        occasions: Array.from(occasions),
        bundleOptions,
        materials: ['wool', 'cotton', 'linen', 'polyester', 'silk'],
        fits: ['Classic', 'Slim', 'Modern', 'Athletic'],
        sizes: ['36', '38', '40', '42', '44', '46', '48', '50', '52'],
        priceRanges: [
          { label: 'Under $200', min: 0, max: 200 },
          { label: '$200-$300', min: 200, max: 300 },
          { label: '$300-$500', min: 300, max: 500 },
          { label: 'Over $500', min: 500, max: 10000 }
        ]
      });
    }
    
    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
    
  } catch (error) {
    console.error('Filter options API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filter options' },
      { status: 500 }
    );
  }
}