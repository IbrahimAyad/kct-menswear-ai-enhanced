import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

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

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 })
    }

    console.log('Starting inventory and image update...')
    
    let updatedProducts = 0
    let updatedVariants = 0
    let errorCount = 0
    const results = []

    // Get all products
    const { data: products, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('*')

    if (fetchError) {
      return NextResponse.json({ error: 'Failed to fetch products', details: fetchError }, { status: 500 })
    }

    for (const product of products || []) {
      try {
        const images = productImageMappings[product.name]
        
        if (images) {
          // Delete existing images
          await supabaseAdmin
            .from('product_images')
            .delete()
            .eq('product_id', product.id)
          
          // Insert new images
          const { error: imageError } = await supabaseAdmin
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
            results.push({ name: product.name, status: 'error', message: `Failed to update images: ${imageError.message}` })
            errorCount++
            continue
          }
        }

        // Update all product variants to have inventory
        const { data: variants, error: variantFetchError } = await supabaseAdmin
          .from('product_variants')
          .select('*')
          .eq('product_id', product.id)

        if (variantFetchError) {
          results.push({ name: product.name, status: 'error', message: `Failed to fetch variants: ${variantFetchError.message}` })
          errorCount++
          continue
        }

        // Update each variant with inventory
        for (const variant of variants || []) {
          const { error: variantUpdateError } = await supabaseAdmin
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
            updatedVariants++
          }
        }

        // Calculate total inventory from all variants
        const totalInventory = variants?.reduce((sum, variant) => sum + 10, 0) || 0
        
        // Update product with total inventory
        const { error: productUpdateError } = await supabaseAdmin
          .from('products')
          .update({ 
            total_inventory: totalInventory,
            in_stock: totalInventory > 0
          })
          .eq('id', product.id)
        
        if (productUpdateError) {
          console.error(`Error updating product ${product.name}:`, productUpdateError)
        }

        updatedProducts++
        results.push({ 
          name: product.name, 
          status: 'success', 
          message: `Updated with ${variants?.length || 0} variants (Total inventory: ${totalInventory})`,
          hasImages: !!images
        })
      } catch (error) {
        results.push({ 
          name: product.name, 
          status: 'error', 
          message: error instanceof Error ? error.message : 'Unknown error' 
        })
        errorCount++
      }
    }

    return NextResponse.json({
      summary: {
        totalProducts: products?.length || 0,
        updatedProducts,
        updatedVariants,
        errors: errorCount
      },
      results
    })
  } catch (error) {
    console.error('Error in update-inventory API:', error)
    return NextResponse.json({ 
      error: 'Failed to update inventory',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}