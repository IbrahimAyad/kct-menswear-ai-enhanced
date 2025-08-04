import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Product image mappings
const productImageMappings: Record<string, { model: string; product: string }> = {
  // Vest & Tie Sets
  'Turquoise Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/Turquoise-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/Turquoise-vest.jpg'
  },
  'Blush Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/blush-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/blush-vest.jpg'
  },
  'Burnt Orange Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/burnt-orange-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/burnt-orange-vest.jpg'
  },
  'Canary Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/canary-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/canary-vest.jpg'
  },
  'Carolina Blue Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/carolina-blue-men-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/carolina-blue-men-vest.jpg'
  },
  'Chocolate Brown Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/chocolate-brown-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/chocolate-brown-vest.jpg'
  },
  'Coral Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/coral-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/coral-vest.jpg'
  },
  'Dark Burgundy Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/dark-burgundy-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/dar-burgundy-vest.jpg'
  },
  'Dusty Rose Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/dusty-rose-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/dusty-rose-vest.jpg'
  },
  'Dusty Sage Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/dusty-sage-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/dusty-sage-vest.png'
  },
  'Emerald Green Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/emerald-green=model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/emerald-green-vest.jpg'
  },
  'Fuchsia Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/fuchsia-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/fuchsia-vest.jpg'
  },
  'Gold Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/gold-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/gold-vest.jpg'
  },
  'Grey Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/grey-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/grey-vest.jpg'
  },
  'Hunter Green Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/hunter-green-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/hunter-green-model.jpg'
  },
  'Lilac Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/lilac-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/lilac-vest.jpg'
  },
  'Mint Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/mint-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/mint-vest.jpg'
  },
  'Peach Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/peach-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/peach-vest.jpg'
  },
  'Pink Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/pink-vest-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/pink-vest.jpg'
  },
  'Plum Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/plum-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/plum-vest.jpg'
  },
  'Powder Blue Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/powder-blue-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/powder-blue-vest.jpg'
  },
  'Red Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/red-vest-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/red-vest.jpg'
  },
  'Rose Gold Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/rose-gold-vest.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/rose-gold-vest.jpg'
  },
  'Royal Blue Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/royal-blue-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/royal-blue-model.jpg'
  },
  'Wine Vest & Tie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/wine-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/wine-veset.jpg'
  },
  // Suspender & Bowtie Sets
  'Powder Blue Suspender & Bowtie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/powder-blue-suspender-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/powder-blue-suspender-set.jpg'
  },
  'Orange Suspender & Bowtie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/orange-suspender-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/orange-suspender-set.jpg'
  },
  'Medium Red Suspender & Bowtie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/medium-red-suspender-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/medium-red-suspender-set.jpg'
  },
  'Hunter Green Suspender & Bowtie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/hunter-green-suspender-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/hunter-green-suspender-set.jpg'
  },
  'Gold Suspender & Bowtie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/gold-suspender-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/gold-suspender-set.jpg'
  },
  'Fuchsia Suspender & Bowtie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/fuchsia-suspender-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/fuchsia-suspender-set.jpg'
  },
  'Dusty Rose Suspender & Bowtie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/dusty-rose-suspender-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/dusty-rose-suspender-set.jpg'
  },
  'Burnt Orange Suspender & Bowtie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/burnt-orange-suspender-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/burnt-orange-suspender-set.jpg'
  },
  'Brown Suspender & Bowtie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/brown-suspender-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/brown-suspender-set.jpg'
  },
  'Black Suspender & Bowtie Set': {
    model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/black-suspender-model.png',
    product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/black-suspender-set.jpg'
  }
}

async function updateProductsWithInventoryAndImages() {
  console.log('Starting product update...')
  
  let updatedCount = 0
  let errorCount = 0
  let variantCount = 0

  try {
    // Get all products
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('*')

    if (fetchError) {
      console.error('Error fetching products:', fetchError)
      return
    }

    console.log(`Found ${products?.length || 0} products to update`)

    for (const product of products || []) {
      try {
        const images = productImageMappings[product.name]
        
        if (images) {
          // Update product images
          console.log(`Updating images for: ${product.name}`)
          
          // Delete existing images
          await supabase
            .from('product_images')
            .delete()
            .eq('product_id', product.id)
          
          // Insert new images
          const { error: imageError } = await supabase
            .from('product_images')
            .insert([
              {
                product_id: product.id,
                image_url: images.product,
                alt_text: `${product.name} product view`,
                position: 1,
                image_type: 'product'
              },
              {
                product_id: product.id,
                image_url: images.model,
                alt_text: `${product.name} on model`,
                position: 2,
                image_type: 'lifestyle'
              }
            ])
          
          if (imageError) {
            console.error(`Error updating images for ${product.name}:`, imageError)
            errorCount++
          }
        }

        // Update all product variants to have inventory
        const { data: variants, error: variantFetchError } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', product.id)

        if (variantFetchError) {
          console.error(`Error fetching variants for ${product.name}:`, variantFetchError)
          continue
        }

        // Update each variant with inventory
        for (const variant of variants || []) {
          const { error: variantUpdateError } = await supabase
            .from('product_variants')
            .update({
              inventory_quantity: 10,
              available: true,
              allow_backorders: true
            })
            .eq('id', variant.id)

          if (variantUpdateError) {
            console.error(`Error updating variant ${variant.title}:`, variantUpdateError)
          } else {
            variantCount++
          }
        }

        updatedCount++
        console.log(`✓ Updated ${product.name}`)
      } catch (error) {
        console.error(`Error processing ${product.name}:`, error)
        errorCount++
      }
    }

    console.log('\n--- Update Summary ---')
    console.log(`✓ Successfully updated: ${updatedCount} products`)
    console.log(`✓ Updated variants: ${variantCount}`)
    console.log(`✗ Errors encountered: ${errorCount}`)
    console.log('----------------------')
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the update
updateProductsWithInventoryAndImages()
  .then(() => console.log('Update complete'))
  .catch(console.error)