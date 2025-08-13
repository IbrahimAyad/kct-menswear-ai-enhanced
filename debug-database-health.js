const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', !!supabaseKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseHealth() {
  console.log('=== Database Health Check ===');
  
  try {
    // Test basic connection
    console.log('1. Testing basic connection...');
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Basic connection failed:', testError);
      return;
    }
    console.log('✅ Basic connection successful');
    
    // Check products table structure
    console.log('\n2. Checking products table...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, product_type, base_price, total_inventory, in_stock, stripe_price_id')
      .limit(5);
    
    if (productsError) {
      console.error('❌ Products query failed:', productsError);
    } else {
      console.log(`✅ Found ${products.length} products`);
      if (products.length > 0) {
        console.log('Sample product fields:', Object.keys(products[0]));
        console.log('Sample product:', products[0]);
      }
    }
    
    // Check product_images table
    console.log('\n3. Checking product_images table...');
    const { data: images, error: imagesError } = await supabase
      .from('product_images')
      .select('id, product_id, image_url, position, image_type')
      .limit(3);
    
    if (imagesError) {
      console.error('❌ Product images query failed:', imagesError);
    } else {
      console.log(`✅ Found ${images.length} product images`);
    }
    
    // Check product_variants table
    console.log('\n4. Checking product_variants table...');
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('id, product_id, title, price, inventory_quantity')
      .limit(3);
    
    if (variantsError) {
      console.error('❌ Product variants query failed:', variantsError);
    } else {
      console.log(`✅ Found ${variants.length} product variants`);
    }
    
    // Test the exact query from the API
    console.log('\n5. Testing API query...');
    const { data: apiProducts, error: apiError } = await supabase
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
      .eq('visibility', true)
      .limit(2);
    
    if (apiError) {
      console.error('❌ API query failed:', apiError);
    } else {
      console.log(`✅ API query successful, found ${apiProducts.length} products`);
      if (apiProducts.length > 0) {
        console.log('Sample product with images:', {
          id: apiProducts[0].id,
          name: apiProducts[0].name,
          images_count: apiProducts[0].product_images?.length || 0
        });
      }
    }
    
    // Check for missing required fields
    console.log('\n6. Checking for missing fields...');
    const { data: fieldCheck, error: fieldError } = await supabase
      .from('products')
      .select('total_inventory, in_stock, stripe_price_id')
      .limit(1);
    
    if (fieldError) {
      console.error('❌ Missing fields detected:', fieldError.message);
      console.log('Please run the add_missing_product_fields.sql script');
    } else {
      console.log('✅ Required fields are present');
    }
    
    console.log('\n=== Health Check Complete ===');
    
  } catch (error) {
    console.error('Unexpected error during health check:', error);
  }
}

checkDatabaseHealth().catch(console.error);