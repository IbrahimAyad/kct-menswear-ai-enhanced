const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl ? '✅ Found' : '❌ Missing');
console.log('Key:', supabaseKey ? '✅ Found' : '❌ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Basic connection
    console.log('\n📡 Testing connection...');
    const { data: tables, error: tablesError } = await supabase
      .from('products')
      .select('count')
      .limit(1);

    if (tablesError) {
      console.error('❌ Connection failed:', tablesError.message);
      return;
    }
    console.log('✅ Connected to Supabase!');

    // Test 2: Fetch products
    console.log('\n📦 Fetching products...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);

    if (productsError) {
      console.error('❌ Error fetching products:', productsError.message);
      return;
    }

    console.log(`✅ Found ${products?.length || 0} products`);
    
    if (products && products.length > 0) {
      console.log('\nFirst product:');
      console.log(JSON.stringify(products[0], null, 2));
    }

    // Test 3: Check product_images table
    console.log('\n🖼️  Checking images...');
    const { data: images, error: imagesError } = await supabase
      .from('product_images')
      .select('*')
      .limit(5);

    if (imagesError) {
      console.error('❌ Error fetching images:', imagesError.message);
    } else {
      console.log(`✅ Found ${images?.length || 0} images`);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testConnection();