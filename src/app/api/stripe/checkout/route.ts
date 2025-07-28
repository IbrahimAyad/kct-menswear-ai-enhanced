import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
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
      apiVersion: '2024-11-20.acacia',
    });
    
    const { items, customerEmail } = await req.json();
    
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }
    
    // Build line items with metadata
    const lineItems = items.map((item: any) => ({
      price: item.stripePriceId,
      quantity: item.quantity,
    }));
    
    // Store detailed order information in metadata
    const orderDetails = items.map((item: any) => ({
      productId: item.id,
      productName: item.name,
      size: item.selectedSize || 'N/A',
      color: item.selectedColor || 'N/A',
      sku: `${item.id}-${item.selectedColor || 'default'}-${item.selectedSize || 'default'}`,
      quantity: item.quantity,
      price: item.price,
      stripePriceId: item.stripePriceId,
    }));
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/cart`,
      customer_email: customerEmail,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      automatic_tax: {
        enabled: true,
      },
      metadata: {
        order_details: JSON.stringify(orderDetails),
      },
      // Add phone number collection for customer service
      phone_number_collection: {
        enabled: true,
      },
      // Add customer creation for future purchases
      customer_creation: 'if_required',
      // Add invoice creation
      invoice_creation: {
        enabled: true,
      },
    });
    
    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url 
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Checkout failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}