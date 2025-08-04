import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

// Complete product image mappings for all products
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

// Default images for products without specific mappings
const defaultImages = {
  model: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/placeholder-model.jpg',
  product: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/placeholder-product.jpg'
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 })
    }

    console.log('Starting comprehensive image fix...')
    
    let fixedCount = 0
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
        // Get images for this product or use defaults
        const images = productImageMappings[product.name] || defaultImages
        
        // First, check if product has any images
        const { data: existingImages, error: checkError } = await supabaseAdmin
          .from('product_images')
          .select('*')
          .eq('product_id', product.id)

        if (checkError) {
          console.error(`Error checking images for ${product.name}:`, checkError)
          errorCount++
          continue
        }

        // If product has images with UUID values, update them
        if (existingImages && existingImages.length > 0) {
          // Update existing images
          for (const img of existingImages) {
            const isUUID = !img.image_url.startsWith('http')
            if (isUUID) {
              const newUrl = img.position === 1 ? images.product : images.model
              const { error: updateError } = await supabaseAdmin
                .from('product_images')
                .update({ image_url: newUrl })
                .eq('id', img.id)

              if (updateError) {
                console.error(`Error updating image ${img.id}:`, updateError)
              }
            }
          }
        } else {
          // No images exist, create them
          const { error: insertError } = await supabaseAdmin
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

          if (insertError) {
            console.error(`Error inserting images for ${product.name}:`, insertError)
            errorCount++
            continue
          }
        }

        // Also update the primary_image field if it exists
        if (product.primary_image && !product.primary_image.startsWith('http')) {
          const { error: primaryUpdateError } = await supabaseAdmin
            .from('products')
            .update({ primary_image: images.product })
            .eq('id', product.id)

          if (primaryUpdateError) {
            console.error(`Error updating primary image for ${product.name}:`, primaryUpdateError)
          }
        }

        fixedCount++
        results.push({ 
          name: product.name, 
          status: 'success', 
          message: 'Images updated successfully'
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
        fixedProducts: fixedCount,
        errors: errorCount
      },
      results,
      message: 'Image fix completed. Please refresh the shop page to see the updated images.'
    })
  } catch (error) {
    console.error('Error in fix-product-images API:', error)
    return NextResponse.json({ 
      error: 'Failed to fix product images',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}