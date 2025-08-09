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
        
        if (supabase) {
          // Build Supabase query based on filters
          let query = supabase
            .from('products')
            .select('*')
            .limit(100); // Limit to prevent timeout
          
          // Apply basic filters to reduce data transfer
          if (filters.category?.length) {
            query = query.in('product_type', filters.category);
          }
          
          if (filters.color?.length) {
            // Simplified color filtering
            const firstColor = filters.color[0];
            query = query.ilike('title', `%${firstColor}%`);
          }
          
          // Price filters
          if (filters.minPrice) {
            query = query.gte('price', filters.minPrice);
          }
          if (filters.maxPrice) {
            query = query.lte('price', filters.maxPrice);
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
              individualProducts = data || [];
              console.log(`Fetched ${individualProducts.length} products from Supabase`);
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
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
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