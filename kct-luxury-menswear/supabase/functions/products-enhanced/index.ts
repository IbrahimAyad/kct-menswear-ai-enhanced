Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        const url = new URL(req.url);
        const searchParams = url.searchParams;
        
        // Query parameters
        const category = searchParams.get('category');
        const type = searchParams.get('type');
        const featured = searchParams.get('featured');
        const trending = searchParams.get('trending');
        const newArrivals = searchParams.get('new_arrivals');
        const limit = searchParams.get('limit');
        const offset = searchParams.get('offset');
        const search = searchParams.get('search');
        const productId = searchParams.get('id');

        let query = `${supabaseUrl}/rest/v1/products_enhanced`;
        let select = '*';
        let filters = [];
        
        // Add filters based on query parameters
        if (productId) {
            filters.push(`id=eq.${productId}`);
        }
        if (category && category !== 'all') {
            filters.push(`category=eq.${category}`);
        }
        if (type && type !== 'all') {
            filters.push(`type=eq.${type}`);
        }
        if (featured === 'true') {
            filters.push('is_featured=eq.true');
        }
        if (trending === 'true') {
            filters.push('is_trending=eq.true');
        }
        if (newArrivals === 'true') {
            filters.push('is_new_arrival=eq.true');
        }
        if (search) {
            filters.push(`name=ilike.*${search}*`);
        }
        
        // Build final URL
        const params = new URLSearchParams();
        params.append('select', select);
        
        if (filters.length > 0) {
            filters.forEach(filter => {
                const [key, value] = filter.split('=');
                params.append(key, value);
            });
        }
        
        // Add ordering
        params.append('order', 'created_at.desc');
        
        // Add pagination
        if (limit) {
            params.append('limit', limit);
        }
        if (offset) {
            params.append('offset', offset);
        }
        
        const finalUrl = `${query}?${params.toString()}`;
        
        console.log('Fetching products from:', finalUrl);
        
        const response = await fetch(finalUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Database query failed:', errorText);
            throw new Error(`Database query failed: ${errorText}`);
        }

        const products = await response.json();
        
        // Process products to ensure CDN URLs and clean data
        const processedProducts = products.map(product => {
            // Clean up image URLs to use CDN
            if (product.images) {
                if (product.images.hero?.url) {
                    product.images.hero.cdn_url = product.images.hero.url.replace(
                        /https:\/\/.*supabase.*\/storage\/v1\/object\/public\//,
                        'https://cdn.kctmenswear.com/'
                    );
                }
                if (product.images.primary?.url) {
                    product.images.primary.cdn_url = product.images.primary.url.replace(
                        /https:\/\/.*supabase.*\/storage\/v1\/object\/public\//,
                        'https://cdn.kctmenswear.com/'
                    );
                }
                if (product.images.gallery) {
                    product.images.gallery = product.images.gallery.map(img => ({
                        ...img,
                        cdn_url: img.url.replace(
                            /https:\/\/.*supabase.*\/storage\/v1\/object\/public\//,
                            'https://cdn.kctmenswear.com/'
                        )
                    }));
                }
            }
            
            return product;
        });
        
        const result = {
            data: processedProducts,
            count: processedProducts.length,
            filters: {
                category,
                type,
                featured,
                trending,
                newArrivals,
                search
            }
        };

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Products API error:', error);

        const errorResponse = {
            error: {
                code: 'PRODUCTS_FETCH_FAILED',
                message: error.message,
                timestamp: new Date().toISOString()
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
