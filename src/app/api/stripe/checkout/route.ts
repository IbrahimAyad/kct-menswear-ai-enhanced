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
    
    // Detect bundle information
    let bundleInfo = null;
    let totalDiscount = 0;
    
    // Check if this is a bundle order
    const isBundleOrder = items.some((item: any) => item.category === 'bundle' || item.bundleType);
    if (isBundleOrder) {
      const originalTotal = items.reduce((sum: number, item: any) => sum + (item.originalPrice || item.price) * item.quantity, 0);
      const discountedTotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
      totalDiscount = originalTotal - discountedTotal;
      
      bundleInfo = {
        order_type: 'bundle',
        bundle_type: items[0]?.bundleType || 'custom',
        bundle_discount: totalDiscount.toFixed(2),
      };
    }
    
    // Create metadata for webhook processing
    const metadata: { [key: string]: string } = {
      itemCount: items.length.toString(),
      timestamp: new Date().toISOString(),
    };
    
    // Add bundle info to metadata
    if (bundleInfo) {
      Object.assign(metadata, bundleInfo);
    }
    
    // Store full items data as JSON string (Stripe allows up to 500 chars per metadata value)
    // We'll create a simplified version for the webhook
    const itemsForWebhook = items.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      quantity: item.quantity,
      category: item.category,
      color: item.color,
      size: item.size,
      image: item.image,
      stripeProductId: item.stripeProductId,
      stripePriceId: item.stripePriceId,
      bundleItems: item.bundleItems,
      metadata: item.metadata,
    }));
    
    // Stringify and check length
    const itemsJson = JSON.stringify(itemsForWebhook);
    if (itemsJson.length <= 500) {
      metadata.items = itemsJson;
    } else {
      // If too long, store essential info only
      metadata.items = JSON.stringify(itemsForWebhook.map((item: any) => ({
        id: item.id,
        name: item.name.substring(0, 30),
        price: item.price,
        qty: item.quantity,
        size: item.size,
      })));
    }
    
    console.log('About to create Stripe session with config:', {
      lineItemsCount: lineItems.length,
      firstLineItem: lineItems[0],
      origin: req.headers.get('origin'),
      metadata
    });
    
    // Create checkout session with optimized payment options
    const sessionConfig: any = {
      payment_method_types: ['card', 'link'],
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