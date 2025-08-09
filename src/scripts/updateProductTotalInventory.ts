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

async function updateProductTotalInventory() {
  // console.log('Starting product total inventory update...')
  
  let updatedCount = 0
  let errorCount = 0

  try {
    // Get all products
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name, total_inventory')

    if (fetchError) {
      console.error('Error fetching products:', fetchError)
      return
    }

    // console.log(`Found ${products?.length || 0} products to update`)

    for (const product of products || []) {
      try {
        // Get total inventory from all variants
        const { data: variants, error: variantError } = await supabase
          .from('product_variants')
          .select('inventory_quantity')
          .eq('product_id', product.id)

        if (variantError) {
          console.error(`Error fetching variants for ${product.name}:`, variantError)
          errorCount++
          continue
        }

        // Calculate total inventory
        const totalInventory = variants?.reduce((sum, variant) => sum + (variant.inventory_quantity || 0), 0) || 0

        // Update product with total inventory
        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            total_inventory: totalInventory,
            in_stock: totalInventory > 0
          })
          .eq('id', product.id)

        if (updateError) {
          console.error(`Error updating ${product.name}:`, updateError)
          errorCount++
        } else {
          updatedCount++
          // console.log(`✓ Updated ${product.name} - Total inventory: ${totalInventory}`)
        }
      } catch (error) {
        console.error(`Error processing ${product.name}:`, error)
        errorCount++
      }
    }

    // console.log('\n--- Update Summary ---')
    // console.log(`✓ Successfully updated: ${updatedCount} products`)
    // console.log(`✗ Errors encountered: ${errorCount}`)
    // console.log('----------------------')
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the update
updateProductTotalInventory()
  .then(() => {}) // console.log('Update complete')
  .catch(console.error)