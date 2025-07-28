import { NextResponse } from 'next/server';
import { fetchStripeProducts, transformStripeProduct } from '@/lib/services/stripeProductService';

export async function GET() {
  try {
    const products = await fetchStripeProducts();
    
    // Transform to match your frontend structure
    const transformedProducts = products.map(product => 
      transformStripeProduct(product)
    );
    
    // Group by category for easier frontend consumption
    const groupedProducts = transformedProducts.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as Record<string, any[]>);
    
    return NextResponse.json({ 
      products: transformedProducts,
      grouped: groupedProducts,
      total: transformedProducts.length 
    });
  } catch (error) {
    console.error('Error fetching Stripe products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' }, 
      { status: 500 }
    );
  }
}