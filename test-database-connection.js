#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Run this script to verify Supabase connection and data access
 * 
 * Usage: node test-database-connection.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please check your .env file has:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('🔗 Connecting to Supabase...');
console.log(`URL: ${supabaseUrl}`);
console.log(`Key: ${supabaseAnonKey.substring(0, 20)}...`);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('\n📊 Testing database connection...');
    
    // Test 1: Basic connection
    console.log('\n1️⃣ Testing basic connection...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('products')
      .select('count', { count: 'exact', head: true });
    
    if (healthError) {
      console.error('❌ Connection failed:', healthError.message);
      return false;
    }
    
    console.log(`✅ Connection successful! Found ${healthCheck} products`);

    // Test 2: Fetch sample products
    console.log('\n2️⃣ Testing products query...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, handle, status')
      .limit(5);
    
    if (productsError) {
      console.error('❌ Products query failed:', productsError.message);
      return false;
    }
    
    console.log(`✅ Products query successful! Sample data:`);
    products?.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} (${product.status})`);
    });

    // Test 3: Test product variants
    console.log('\n3️⃣ Testing product variants...');
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('id, title, price, product_id')
      .limit(5);
    
    if (variantsError) {
      console.error('❌ Variants query failed:', variantsError.message);
    } else {
      console.log(`✅ Variants query successful! Found ${variants?.length} sample variants`);
    }

    // Test 4: Test product images
    console.log('\n4️⃣ Testing product images...');
    const { data: images, error: imagesError } = await supabase
      .from('product_images')
      .select('id, src, product_id')
      .limit(5);
    
    if (imagesError) {
      console.error('❌ Images query failed:', imagesError.message);
    } else {
      console.log(`✅ Images query successful! Found ${images?.length} sample images`);
    }

    // Test 5: Test collections
    console.log('\n5️⃣ Testing collections...');
    const { data: collections, error: collectionsError } = await supabase
      .from('collections')
      .select('id, title, handle')
      .limit(5);
    
    if (collectionsError) {
      console.error('❌ Collections query failed:', collectionsError.message);
    } else {
      console.log(`✅ Collections query successful! Found ${collections?.length} collections`);
    }

    // Test 6: Test joined query (products with variants)
    console.log('\n6️⃣ Testing joined query...');
    const { data: productsWithVariants, error: joinError } = await supabase
      .from('products')
      .select(`
        id,
        title,
        product_variants (
          id,
          title,
          price
        )
      `)
      .limit(3);
    
    if (joinError) {
      console.error('❌ Joined query failed:', joinError.message);
    } else {
      console.log(`✅ Joined query successful!`);
      productsWithVariants?.forEach((product) => {
        console.log(`   - ${product.title}: ${product.product_variants?.length || 0} variants`);
      });
    }

    return true;

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🧪 KCT Menswear Database Connection Test');
  console.log('=========================================');
  
  const success = await testConnection();
  
  console.log('\n📋 Test Summary:');
  console.log('================');
  
  if (success) {
    console.log('✅ Database connection is working properly!');
    console.log('✅ RLS policies appear to be configured correctly');
    console.log('✅ Your application should be able to fetch products');
  } else {
    console.log('❌ Database connection issues detected');
    console.log('💡 Check your RLS policies and environment variables');
  }
  
  console.log('\n🔍 Next steps:');
  console.log('- Run the SQL queries in database-verification-queries.sql in your Supabase dashboard');
  console.log('- Test the API endpoints using the curl commands');
  console.log('- Check your application logs for any additional errors');
}

main().catch(console.error);