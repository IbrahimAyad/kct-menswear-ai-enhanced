import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkProductImages() {
  // console.log('Checking product images in Supabase...\n')

  try {
    // Get a sample of products with their images
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        product_images (
          id,
          image_url,
          image_type,
          position
        )
      `)
      .limit(5)

    if (error) {
      console.error('Error fetching products:', error)
      return
    }

    // console.log('Sample products and their images:')
    // console.log('================================\n')

    for (const product of products || []) {
      // console.log(`Product: ${product.name}`)
      // console.log(`ID: ${product.id}`)
      
      if (product.product_images && product.product_images.length > 0) {
        // console.log('Images:')
        product.product_images.forEach((img: any) => {
          // console.log(`  - Type: ${img.image_type}, URL: ${img.image_url}`)
        })
      } else {
        // console.log('  No images found')
      }
      // console.log('---')
    }

    // Check if there are any products with actual URLs
    const { data: urlCheck, error: urlError } = await supabase
      .from('product_images')
      .select('image_url')
      .like('image_url', 'http%')
      .limit(5)

    if (urlCheck && urlCheck.length > 0) {
      // console.log('\nFound products with actual URLs:')
      urlCheck.forEach(img => {}) // console.log(`  - ${img.image_url}`)
    } else {
      // console.log('\nNo products found with actual URLs (all are UUIDs)')
    }

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

checkProductImages()
  .then(() => {}) // console.log('\nCheck complete')
  .catch(console.error)