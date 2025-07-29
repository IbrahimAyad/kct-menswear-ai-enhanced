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
    
    console.log('About to create Stripe session with config:', {
      lineItemsCount: lineItems.length,
      firstLineItem: lineItems[0],
      origin: req.headers.get('origin')
    });
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/cart`,
      metadata: {
        order_details: JSON.stringify(orderDetails),
      },
    });
    
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