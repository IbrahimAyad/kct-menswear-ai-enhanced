import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  console.log('=== CHECKOUT API CALLED ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Environment check:', {
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    stripeKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 10)
  });
  
  try {
    // Initialize Stripe inside the function to ensure env vars are available
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not found in environment variables');
      return NextResponse.json(
        { error: 'Payment configuration error' },
        { status: 500 }
      );
    }
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-10-28.acacia',
    });
    
    const { items, customerEmail } = await req.json();
    
    console.log('Checkout request received:', { 
      itemsCount: items?.length, 
      customerEmail,
      items: items?.map((item: any) => ({
        stripePriceId: item.stripePriceId,
        quantity: item.quantity,
        name: item.name
      }))
    });
    
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }
    
    // Build line items with metadata
    const lineItems = items.map((item: any) => {
      console.log('Processing line item:', {
        stripePriceId: item.stripePriceId,
        quantity: item.quantity,
        name: item.name
      });
      
      if (!item.stripePriceId) {
        throw new Error(`Missing stripePriceId for item: ${item.name || item.id}`);
      }
      
      return {
        price: item.stripePriceId,
        quantity: item.quantity,
      };
    });
    
    // Simplify metadata for Stripe's 500 character limit
    // Group items by bundle or product type
    const bundleGroups: { [key: string]: number } = {};
    const individualItems: string[] = [];
    
    items.forEach((item: any) => {
      if (item.bundleId) {
        // For bundles, just count the bundle types
        const bundleType = item.metadata?.bundleType || 'bundle';
        bundleGroups[bundleType] = (bundleGroups[bundleType] || 0) + 1;
      } else {
        // For individual items, store minimal info
        individualItems.push(`${item.id}:${item.quantity}`);
      }
    });
    
    // Create compact metadata
    const metadata: { [key: string]: string } = {
      itemCount: items.length.toString(),
      timestamp: new Date().toISOString(),
    };
    
    // Add bundle info if present
    if (Object.keys(bundleGroups).length > 0) {
      metadata.bundles = Object.entries(bundleGroups)
        .map(([type, count]) => `${type}:${count}`)
        .join(',');
    }
    
    // Add individual items if present and within limit
    if (individualItems.length > 0) {
      const itemsString = individualItems.slice(0, 5).join(','); // Limit to 5 items
      if (itemsString.length < 200) {
        metadata.items = itemsString;
      }
    }
    
    console.log('About to create Stripe session with config:', {
      lineItemsCount: lineItems.length,
      firstLineItem: lineItems[0],
      origin: req.headers.get('origin'),
      metadata
    });
    
    // Create checkout session with optimized payment options
    const sessionConfig: any = {
      // Use automatic payment methods for best conversion
      automatic_payment_methods: {
        enabled: true,
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/cart`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      shipping_options: [
        {
          shipping_rate: 'shr_1Rq49FCHc12x7sCzaNB3IohF',
        },
      ],
      automatic_tax: {
        enabled: true,
      },
      // Allow promotion codes
      allow_promotion_codes: true,
      // Phone number collection for better conversion
      phone_number_collection: {
        enabled: true,
      },
      metadata: metadata,
    };
    
    // Add customer email if provided
    if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
    }
    
    const session = await stripe.checkout.sessions.create(sessionConfig);
    
    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url 
    });
  } catch (error) {
    console.error('Checkout error:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { error: 'Checkout failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}