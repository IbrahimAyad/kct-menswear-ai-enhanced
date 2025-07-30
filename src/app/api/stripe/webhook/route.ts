import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Disable body parsing, we need the raw body for signature verification
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  console.log('=== WEBHOOK RECEIVED ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Headers:', Object.fromEntries(req.headers.entries()));
  
  let body: string;
  let event: Stripe.Event;

  try {
    // Get raw body as string for signature verification
    body = await req.text();
    console.log('Body length:', body.length);
    console.log('Body preview:', body.substring(0, 200));
  } catch (error) {
    console.error('Error reading request body:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    console.error('No stripe-signature header');
    return NextResponse.json(
      { error: 'No stripe-signature header' },
      { status: 400 }
    );
  }

  // Check environment variables
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('STRIPE')));
    return NextResponse.json(
      { error: 'Webhook endpoint not configured on server' },
      { status: 500 }
    );
  }
  
  console.log('Webhook secret exists:', !!process.env.STRIPE_WEBHOOK_SECRET);
  console.log('Webhook secret prefix:', process.env.STRIPE_WEBHOOK_SECRET?.substring(0, 10));

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY not configured');
    return NextResponse.json(
      { error: 'Stripe not configured on server' },
      { status: 500 }
    );
  }

  // Initialize Stripe
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-10-28.acacia',
  });

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log('Webhook signature verified successfully');
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    console.error('Signature header:', sig);
    console.error('Expected secret format:', process.env.STRIPE_WEBHOOK_SECRET?.startsWith('whsec_') ? 'Valid (starts with whsec_)' : 'Invalid format');
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  console.log(`Webhook event received: ${event.type}`);
  console.log('Event ID:', event.id);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout completed:', session.id);
        console.log('Customer email:', session.customer_email);
        console.log('Amount total:', session.amount_total);
        
        // Extract order details from metadata
        const orderDetails = session.metadata?.order_details ? 
          JSON.parse(session.metadata.order_details) : null;
        
        if (orderDetails) {
          console.log('Order details:', JSON.stringify(orderDetails, null, 2));
        }
        
        if (session.shipping_details) {
          console.log('Shipping details:', JSON.stringify(session.shipping_details, null, 2));
        }
        
        // TODO: Save order to your database
        // TODO: Send confirmation email
        // TODO: Update inventory
        
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        console.log('Amount:', paymentIntent.amount);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', paymentIntent.id);
        console.log('Error:', paymentIntent.last_payment_error?.message);
        break;
      }

      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge;
        console.log('Charge succeeded:', charge.id);
        console.log('Amount:', charge.amount);
        break;
      }

      case 'customer.created': {
        const customer = event.data.object as Stripe.Customer;
        console.log('Customer created:', customer.id);
        console.log('Email:', customer.email);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return success response
    return NextResponse.json(
      { received: true, eventId: event.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    // Still return 200 to acknowledge receipt
    return NextResponse.json(
      { received: true, error: 'Processing error but acknowledged' },
      { status: 200 }
    );
  }
}